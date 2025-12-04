# Setup Guide for @pod/sdk React Library

## Step-by-Step Instructions

### 1. Navigate to the React Library Directory

```bash
cd pod-sdk-react
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Build the Library

```bash
npm run build
```

This will create:
- `dist/index.js` (CommonJS)
- `dist/index.esm.js` (ES Modules)
- `dist/index.d.ts` (TypeScript definitions)

### 4. Test Locally (Optional)

You can test the library locally using `npm link`:

```bash
# In pod-sdk-react directory
npm link

# In your test React app
npm link @pod/sdk
```

### 5. Publish to npm

#### First Time Setup

1. Create an npm account if you don't have one: https://www.npmjs.com/signup
2. Login to npm:
   ```bash
   npm login
   ```

#### Publish

```bash
npm publish --access public
```

> **Note:** The `prepublishOnly` script will automatically build before publishing.

### 6. Update Version

When making changes, update the version in `package.json`:

```bash
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.0 -> 1.1.0
npm version major  # 1.0.0 -> 2.0.0
```

## Project Structure

```
pod-sdk-react/
├── src/
│   ├── index.ts          # Main entry point
│   ├── types.ts          # TypeScript type definitions
│   ├── context.tsx       # React Context and Provider
│   ├── hooks.ts          # React hooks
│   └── components.tsx    # React components
├── dist/                 # Built files (generated)
├── package.json
├── tsconfig.json
├── rollup.config.js
└── README.md
```

## Integration with Your Native SDK

### iOS Integration

Your iOS WebView should load `bridge.js` before loading the React app:

```swift
// In WebController.swift
private func loadWebContent() {
    // 1. Load bridge.js first
    if let bridgeURL = Bundle.module.url(forResource: "bridge", withExtension: "js") {
        let bridgeScript = try? String(contentsOf: bridgeURL)
        // Inject bridge.js
    }
    
    // 2. Then load your React app HTML
    webView.load(URLRequest(url: reactAppURL))
}
```

### Android Integration

Similarly, load `bridge.js` before your React app:

```kotlin
// Load bridge.js first, then React app
webView.loadUrl("javascript: /* bridge.js content */")
webView.loadUrl("https://your-react-app.com")
```

## Usage in React Apps

Once published, users can install and use it:

```bash
npm install @pod/sdk
```

```tsx
import { PodSDKProvider, PodButton } from '@pod/sdk';

function App() {
  return (
    <PodSDKProvider>
      <PodButton eventType="web_app_close">Close</PodButton>
    </PodSDKProvider>
  );
}
```

## Development Workflow

1. Make changes in `src/`
2. Run `npm run build` to compile
3. Test locally with `npm link`
4. Update version: `npm version patch`
5. Publish: `npm publish`

## Troubleshooting

### Build Errors

- Make sure all dependencies are installed: `npm install`
- Check TypeScript errors: `npm run type-check`

### Publishing Errors

- Ensure you're logged in: `npm whoami`
- Check package name availability
- Verify version number is incremented

