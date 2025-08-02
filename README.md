# env-x-utils

A lightweight utility library for environment variables and runtime environment
detection in Node.js, with full support for Next.js 15 app router.

## Features

- 🔍 **Environment Detection**: Detect development, production, test, staging, and
  UAT environments
- 🌐 **Runtime Detection**: Check if code is running on server vs browser, SSR vs
  CSR
- 🔒 **Secure Stringification**: Safely stringify objects while redacting sensitive
  data
- 📊 **Memory Monitoring**: Monitor memory usage in browser environments
- 🛡️ **Type Safety**: Full support with proper type definitions

## Installation

```bash
npm install env-x-utils
# or
yarn add env-x-utils
# or
pnpm add env-x-utils
```

## Usage

### Basic Environment Detection

```
import { isBrowser, isDev, isProd, isServer, isTest } from 'env-x-utils';

// Environment checks
if (isDev) {
  console.log('Running in development mode');
}

if (isProd) {
  console.log('Running in production mode');
}

// Runtime detection
if (isServer) {
  console.log('Running on server');
}

if (isBrowser) {
  console.log('Running in browser');
}
```

### Environment Variables

```
import { env, isEnvVarDefined, validateRequiredEnv } from 'env-x-utils';

// Get environment variable with type support
const apiUrl = env('API_URL', 'http://localhost:3000');
const port = env('PORT', 3000);
const debug = env('DEBUG', false);

// Check if environment variable is defined
if (isEnvVarDefined('DATABASE_URL')) {
  console.log('Database URL is configured');
}

// Validate required environment variables
const { isValid, missing } = validateRequiredEnv(['API_KEY', 'DATABASE_URL']);
if (!isValid) {
  console.error('Missing required environment variables:', missing);
}
```

### Secure Stringification

```
import { safeStringify } from 'env-x-utils';

const config = {
  apiUrl: 'https://api.example.com',
  apiKey: 'secret-key-123',
  password: 'user-password',
  settings: { debug: true },
};

// Automatically redacts sensitive data
const safeConfig = safeStringify(config);
console.log(safeConfig);
// Output: {"apiUrl":"https://api.example.com","apiKey":"[REDACTED]","password":"[REDACTED]","settings":{"debug":true}}
```

### Memory Monitoring

```
import { checkMemoryUsage } from 'env-x-utils';

// Check memory usage (browser only)
checkMemoryUsage();
// Will warn if memory usage is high or if memory API is not supported
```

## Next.js 15 Compatibility

This package is fully compatible with Next.js 15 app router and ES modules:

```
// In your Next.js app
import { isDev, env } from 'env-x-utils';

export default function MyComponent() {
  const apiUrl = env('NEXT_PUBLIC_API_URL', 'http://localhost:3000');

  return (
    <div>
      {isDev && <p>Development mode active</p>}
      <p>API URL: {apiUrl}</p>
    </div>
  );
}
```

## API Reference

### Environment Detection

- `isDev` - Check if in development environment
- `isProd` - Check if in production environment
- `isTest` - Check if in test environment
- `isStage` - Check if in staging environment
- `isUat` - Check if in UAT environment

### Runtime Detection

- `isBrowser` - Check if running in browser
- `isServer` - Check if running on server
- `isSSR()` - Check if in server-side rendering
- `isCSR()` - Check if in client-side rendering

### Environment Variables

- `env(key, defaultValue?)` - Get environment variable with type support
- `isEnvVarDefined(key)` - Check if environment variable is defined
- `getAllEnv()` - Get all environment variables
- `validateRequiredEnv(required)` - Validate required environment variables

### Utilities

- `safeStringify(obj, redactedWord?)` - Safely stringify objects
- `isBoolean(value)` - Check if value is boolean
- `checkMemoryUsage()` - Monitor memory usage (browser only)

## License

MIT
