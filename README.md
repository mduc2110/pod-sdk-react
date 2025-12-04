# @pod/sdk

React library for PodSDK - Embed native iOS/Android WebView containers in React web applications.

## Installation

```bash
npm install @pod/sdk
# or
yarn add @pod/sdk
# or
pnpm add @pod/sdk
```

## Quick Start

### 1. Wrap your app with PodSDKProvider

```tsx
import { PodSDKProvider } from '@pod/sdk';

function App() {
  return (
    <PodSDKProvider>
      <YourApp />
    </PodSDKProvider>
  );
}
```

### 2. Use PodWebView component

```tsx
import { PodWebView } from '@pod/sdk';

function MyComponent() {
  return (
    <PodWebView
      url="https://example.com"
      callbacks={{
        onClose: () => console.log('WebView closed'),
        onInitialized: () => console.log('WebView initialized'),
      }}
    />
  );
}
```

### 3. Use PodButton for native actions

```tsx
import { PodButton } from '@pod/sdk';

function MyComponent() {
  return (
    <PodButton eventType="web_app_close">
      Close WebView
    </PodButton>
  );
}
```

## API Reference

### Components

#### `<PodSDKProvider>`

Provider component that initializes the PodSDK bridge. Must wrap your app.

**Props:**
- `children: React.ReactNode` - Your app components

#### `<PodWebView>`

Component that embeds a WebView container.

**Props:**
- `url?: string` - URL to load in the WebView
- `html?: string` - HTML content to load directly
- `callbacks?: PodWebViewCallbacks` - Event callbacks
- `style?: React.CSSProperties` - Additional styles
- `className?: string` - CSS class name

#### `<PodButton>`

Button component that triggers native events.

**Props:**
- `eventType?: string` - Event type to post (default: 'web_app_close')
- `eventData?: any` - Event data to send
- `children: React.ReactNode` - Button label
- `onClick?: () => void` - Click handler
- `...props` - Additional button props

### Hooks

#### `usePodSDK()`

Access the PodSDK context.

**Returns:**
```typescript
{
  isAvailable: boolean;
  postEvent: (eventType: string, eventData?: any, callback?: () => void) => void;
  onEvent: (eventType: string, callback: (eventData?: any) => void) => () => void;
  offEvent: (eventType: string, callback: (eventData?: any) => void) => void;
  receiveEvent: (eventType: string, eventData?: any) => void;
}
```

#### `usePodWebView(callbacks?)`

Hook for WebView functionality.

**Parameters:**
- `callbacks?: PodWebViewCallbacks` - Event callbacks

**Returns:**
```typescript
{
  isAvailable: boolean;
  close: () => void;
  ready: () => void;
  expand: () => void;
  postEvent: (eventType: string, eventData?: any, callback?: () => void) => void;
}
```

## Examples

### Basic Usage

```tsx
import { PodSDKProvider, PodWebView, PodButton } from '@pod/sdk';

function App() {
  return (
    <PodSDKProvider>
      <div>
        <PodWebView url="https://example.com" />
        <PodButton eventType="web_app_close">Close</PodButton>
      </div>
    </PodSDKProvider>
  );
}
```

### Using Hooks

```tsx
import { PodSDKProvider, usePodSDK } from '@pod/sdk';

function MyComponent() {
  const { postEvent, isAvailable } = usePodSDK();

  const handleCustomAction = () => {
    if (isAvailable) {
      postEvent('custom_action', { data: 'value' });
    }
  };

  return (
    <button onClick={handleCustomAction}>
      Custom Action
    </button>
  );
}
```

### Event Listeners

```tsx
import { PodSDKProvider, usePodSDK } from '@pod/sdk';

function MyComponent() {
  const { onEvent, offEvent } = usePodSDK();

  useEffect(() => {
    const unsubscribe = onEvent('custom_event', (eventData) => {
      console.log('Received event:', eventData);
    });

    return () => {
      unsubscribe();
    };
  }, [onEvent, offEvent]);

  return <div>Listening for events...</div>;
}
```

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Type check
npm run type-check

# Development mode
npm run dev
```

## Requirements

- React >= 16.8.0
- React DOM >= 16.8.0

## License

MIT

