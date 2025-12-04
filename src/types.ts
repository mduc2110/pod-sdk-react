/**
 * Type definitions for PodSDK React library
 */

export interface PodWebViewEvent {
  eventType: string;
  eventData?: any;
}

export interface PodWebViewCallbacks {
  onEvent?: (eventType: string, eventData?: any) => void;
  onClose?: () => void;
  onInitialized?: () => void;
  onError?: (error: Error) => void;
}

export interface PodWebViewProps {
  /**
   * URL to load in the WebView
   */
  url?: string;
  
  /**
   * HTML content to load directly
   */
  html?: string;
  
  /**
   * Callbacks for WebView events
   */
  callbacks?: PodWebViewCallbacks;
  
  /**
   * Additional CSS styles
   */
  style?: React.CSSProperties;
  
  /**
   * CSS class name
   */
  className?: string;
}

export interface PodSDKContextValue {
  /**
   * Check if native bridge is available
   */
  isAvailable: boolean;
  
  /**
   * Post an event to native
   */
  postEvent: (eventType: string, eventData?: any, callback?: () => void) => void;
  
  /**
   * Subscribe to events from native
   */
  onEvent: (eventType: string, callback: (eventData?: any) => void) => () => void;
  
  /**
   * Unsubscribe from events
   */
  offEvent: (eventType: string, callback: (eventData?: any) => void) => void;
  
  /**
   * Receive event from native (called internally)
   */
  receiveEvent: (eventType: string, eventData?: any) => void;
}

