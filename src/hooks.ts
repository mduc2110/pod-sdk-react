import { useEffect, useCallback } from 'react';
import { usePodSDK } from './context';
import type { PodWebViewCallbacks } from './types';

/**
 * Hook for PodSDK WebView functionality
 */
export const usePodWebView = (callbacks?: PodWebViewCallbacks) => {
  const { isAvailable, postEvent, onEvent, offEvent } = usePodSDK();

  // Set up event listeners
  useEffect(() => {
    if (!callbacks) return;

    const unsubscribers: Array<() => void> = [];

    // Listen for close events
    if (callbacks.onClose) {
      const unsubscribe = onEvent('web_app_close', () => {
        callbacks.onClose?.();
      });
      unsubscribers.push(unsubscribe);
    }

    // Listen for initialization
    if (callbacks.onInitialized) {
      const unsubscribe = onEvent('web_app_initialized', () => {
        callbacks.onInitialized?.();
      });
      unsubscribers.push(unsubscribe);
    }

    // Generic event listener
    if (callbacks.onEvent) {
      // Note: This is a simplified version - you might want to listen to all events
      // and filter in the callback
    }

    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }, [callbacks, onEvent, offEvent]);

  // Post close event
  const close = useCallback(() => {
    postEvent('web_app_close');
  }, [postEvent]);

  // Post ready event
  const ready = useCallback(() => {
    postEvent('web_app_ready');
  }, [postEvent]);

  // Post expand event
  const expand = useCallback(() => {
    postEvent('web_app_expand');
  }, [postEvent]);

  return {
    isAvailable,
    close,
    ready,
    expand,
    postEvent,
  };
};

