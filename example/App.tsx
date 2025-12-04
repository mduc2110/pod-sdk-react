/**
 * Example React app using @pod/sdk
 * 
 * This app should be loaded inside your iOS/Android WebView container
 * that has the PodSDK bridge.js script loaded.
 */

import { PodSDKProvider, PodButton, usePodSDK } from '@pod/sdk';

function App() {
  return (
    <PodSDKProvider>
      <div style={{ padding: '20px' }}>
        <h1>PodSDK React Example</h1>
        <ExampleComponent />
      </div>
    </PodSDKProvider>
  );
}

function ExampleComponent() {
  const { postEvent, isAvailable } = usePodSDK();

  const handleCustomEvent = () => {
    postEvent('custom_action', { message: 'Hello from React!' });
  };

  return (
    <div>
      <p>Bridge Available: {isAvailable ? '✅' : '❌'}</p>
      
      <div style={{ marginTop: '20px', display: 'flex', gap: '10px', flexDirection: 'column' }}>
        <PodButton eventType="web_app_close">
          Close WebView
        </PodButton>
        
        <button onClick={handleCustomEvent}>
          Send Custom Event
        </button>
      </div>
    </div>
  );
}

export default App;

