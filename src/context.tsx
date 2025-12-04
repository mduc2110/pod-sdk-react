import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import type { PodSDKContextValue } from './types';

const PodSDKContext = createContext<PodSDKContextValue | null>(null);

/**
 * Provider component that initializes PodSDK bridge
 */
export const PodSDKProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [eventHandlers, setEventHandlers] = useState<Record<string, Set<(data?: any) => void>>>({});
  // Store wrapper functions for proper unsubscription
  const wrapperFunctionsRef = useRef<Map<(data?: any) => void, (eventType: string, eventData?: any) => void>>(new Map());

  // Check if bridge is available
  useEffect(() => {
    const checkAvailability = () => {
      const available = !!(
        typeof window !== 'undefined' &&
        window.PodBridge &&
        typeof window.PodBridge.postMessage === 'function'
      );
      setIsAvailable(available);
      
      if (available) {
        console.log('[PodSDK] Bridge available');
      } else {
        console.warn('[PodSDK] Bridge not available - running in browser without native container');
      }
    };

    // Check immediately
    checkAvailability();

    // Also check after a delay in case bridge loads asynchronously
    const timeout = setTimeout(checkAvailability, 1000);

    return () => clearTimeout(timeout);
  }, []);

  // Post event to native
  const postEvent = useCallback((eventType: string, eventData?: any, callback?: () => void) => {
    if (!isAvailable) {
      console.warn('[PodSDK] Cannot post event - bridge not available:', eventType);
      callback?.();
      return;
    }

    try {
      if (window.Pod?.WebView?.postEvent) {
        window.Pod.WebView.postEvent(eventType, callback, eventData);
      } else if (window.PodBridge?.postMessage) {
        window.PodBridge.postMessage({
          type: eventType,
          data: eventData || '',
        });
        callback?.();
      } else {
        console.warn('[PodSDK] Bridge interface not found');
        callback?.();
      }
    } catch (error) {
      console.error('[PodSDK] Failed to post event:', error);
      callback?.();
    }
  }, [isAvailable]);

  // Subscribe to events
  const onEvent = useCallback((eventType: string, callback: (eventData?: any) => void) => {
    setEventHandlers((prev) => {
      const newHandlers = { ...prev };
      if (!newHandlers[eventType]) {
        newHandlers[eventType] = new Set();
      }
      newHandlers[eventType].add(callback);
      return newHandlers;
    });

    // Create wrapper function for bridge.js (expects: (eventType, eventData) => void)
    const wrapperFunction = (receivedEventType: string, eventData?: any) => {
      callback(eventData);
    };
    
    // Store wrapper for later unsubscription
    wrapperFunctionsRef.current.set(callback, wrapperFunction);

    // Also register with Pod.WebView if available
    if (window.Pod?.WebView?.onEvent) {
      window.Pod.WebView.onEvent(eventType, wrapperFunction);
    }

    // Return unsubscribe function
    return () => {
      setEventHandlers((prev) => {
        const newHandlers = { ...prev };
        if (newHandlers[eventType]) {
          newHandlers[eventType].delete(callback);
        }
        return newHandlers;
      });

      const wrapper = wrapperFunctionsRef.current.get(callback);
      if (wrapper && window.Pod?.WebView?.offEvent) {
        window.Pod.WebView.offEvent(eventType, wrapper);
        wrapperFunctionsRef.current.delete(callback);
      }
    };
  }, []);

  // Unsubscribe from events
  const offEvent = useCallback((eventType: string, callback: (eventData?: any) => void) => {
    setEventHandlers((prev) => {
      const newHandlers = { ...prev };
      if (newHandlers[eventType]) {
        newHandlers[eventType].delete(callback);
      }
      return newHandlers;
    });

    const wrapper = wrapperFunctionsRef.current.get(callback);
    if (wrapper && window.Pod?.WebView?.offEvent) {
      window.Pod.WebView.offEvent(eventType, wrapper);
      wrapperFunctionsRef.current.delete(callback);
    }
  }, []);

  // Receive event from native (called internally)
  const receiveEvent = useCallback((eventType: string, eventData?: any) => {
    const handlers = eventHandlers[eventType];
    if (handlers) {
      handlers.forEach((callback) => {
        try {
          callback(eventData);
        } catch (error) {
          console.error('[PodSDK] Error in event handler:', error);
        }
      });
    }
  }, [eventHandlers]);

  const value: PodSDKContextValue = {
    isAvailable,
    postEvent,
    onEvent,
    offEvent,
    receiveEvent,
  };

  return <PodSDKContext.Provider value={value}>{children}</PodSDKContext.Provider>;
};

/**
 * Hook to access PodSDK context
 */
export const usePodSDK = (): PodSDKContextValue => {
  const context = useContext(PodSDKContext);
  if (!context) {
    throw new Error('usePodSDK must be used within PodSDKProvider');
  }
  return context;
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    Pod?: {
      WebView?: {
        postEvent: (eventType: string, callback?: () => void, eventData?: any) => void;
        onEvent: (eventType: string, callback: (eventType: string, eventData?: any) => void) => void;
        offEvent: (eventType: string, callback: (eventType: string, eventData?: any) => void) => void;
        isAvailable: () => boolean;
      };
    };
    PodBridge?: {
      postMessage: (message: { type: string; data?: any }) => void;
      _injected?: boolean;
    };
  }
}

