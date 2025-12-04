# Quick Start Guide

## 🚀 Build and Publish Your React Library

### Step 1: Setup

```bash
cd pod-sdk-react
npm install
```

### Step 2: Build

```bash
npm run build
```

This creates:
- `dist/index.js` - CommonJS bundle
- `dist/index.esm.js` - ES Module bundle  
- `dist/index.d.ts` - TypeScript definitions

### Step 3: Test Locally (Optional)

```bash
# In pod-sdk-react
npm link

# In your test app
npm link @pod/sdk
```

### Step 4: Publish

```bash
# Login to npm (first time only)
npm login

# Publish
npm publish --access public
```

## 📦 What You Get

A React library that provides:

1. **`PodSDKProvider`** - Context provider for bridge access
2. **`usePodSDK()`** - Hook to access bridge functions
3. **`usePodWebView()`** - Hook for WebView-specific actions
4. **`PodWebView`** - Component to embed content
5. **`PodButton`** - Button component that triggers native events

## 💻 Usage Example

```tsx
import { PodSDKProvider, PodButton, usePodSDK } from '@pod/sdk';

function App() {
  return (
    <PodSDKProvider>
      <MyComponent />
    </PodSDKProvider>
  );
}

function MyComponent() {
  const { postEvent, isAvailable } = usePodSDK();
  
  return (
    <div>
      <p>Bridge: {isAvailable ? '✅' : '❌'}</p>
      <PodButton eventType="web_app_close">
        Close
      </PodButton>
    </div>
  );
}
```

## 🔗 Integration with Native SDK

### iOS

Your `index.html` should load `bridge.js` before React:

```html
<script src="bridge.js"></script>
<!-- Then load your React app -->
<div id="root"></div>
<script src="your-react-bundle.js"></script>
```

### Android

Same approach - load `bridge.js` first, then React app.

## 📝 Next Steps

1. Customize the library name/version in `package.json`
2. Add more components/hooks as needed
3. Test with your native WebView container
4. Publish to npm
5. Share with your team! 🎉

