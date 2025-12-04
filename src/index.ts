/**
 * @pod/sdk - React library for PodSDK
 * 
 * Usage:
 * ```tsx
 * import { PodSDKProvider, PodWebView, PodButton, usePodSDK } from '@pod/sdk';
 * 
 * function App() {
 *   return (
 *     <PodSDKProvider>
 *       <PodWebView url="https://example.com" />
 *       <PodButton eventType="web_app_close">Close</PodButton>
 *     </PodSDKProvider>
 *   );
 * }
 * ```
 */

// Context and Provider
export { PodSDKProvider, usePodSDK } from './context';

// Hooks
export { usePodWebView } from './hooks';

// Components
export { PodWebView, PodButton } from './components';
export type { PodButtonProps } from './components';

// Types
export type {
  PodWebViewProps,
  PodWebViewCallbacks,
  PodWebViewEvent,
  PodSDKContextValue,
} from './types';

