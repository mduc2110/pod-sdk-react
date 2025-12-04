import React, { useEffect, useRef } from 'react';
import { usePodWebView } from './hooks';
import type { PodWebViewProps } from './types';

/**
 * PodWebView component - Embeds a WebView container
 * This component should be used inside a native iOS/Android WebView container
 */
export const PodWebView: React.FC<PodWebViewProps> = ({
  url,
  html,
  callbacks,
  style,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isAvailable, ready } = usePodWebView(callbacks);

  useEffect(() => {
    // Notify native that WebView is ready
    if (isAvailable) {
      ready();
    }
  }, [isAvailable, ready]);

  useEffect(() => {
    if (!containerRef.current) return;

    // If HTML is provided, set it directly
    if (html) {
      containerRef.current.innerHTML = html;
      return;
    }

    // If URL is provided, create an iframe
    if (url) {
      const iframe = document.createElement('iframe');
      iframe.src = url;
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = 'none';
      containerRef.current.appendChild(iframe);

      return () => {
        if (containerRef.current && iframe.parentNode === containerRef.current) {
          containerRef.current.removeChild(iframe);
        }
      };
    }
  }, [url, html]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        ...style,
      }}
    />
  );
};

/**
 * PodButton component - Button that triggers native actions
 */
export interface PodButtonProps {
  /**
   * Event type to post when clicked
   */
  eventType?: string;
  
  /**
   * Event data to send
   */
  eventData?: any;
  
  /**
   * Button label
   */
  children: React.ReactNode;
  
  /**
   * Click handler (called before posting event)
   */
  onClick?: () => void;
  
  /**
   * Additional props
   */
  [key: string]: any;
}

export const PodButton: React.FC<PodButtonProps> = ({
  eventType = 'web_app_close',
  eventData,
  children,
  onClick,
  ...props
}) => {
  const { postEvent, isAvailable } = usePodWebView();

  const handleClick = () => {
    onClick?.();
    if (isAvailable && eventType) {
      postEvent(eventType, eventData);
    } else {
      console.warn('[PodButton] Bridge not available or no eventType specified');
    }
  };

  return (
    <button onClick={handleClick} {...props}>
      {children}
    </button>
  );
};

