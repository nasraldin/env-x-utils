/* eslint-disable no-undef */
// Test file to verify package import works correctly
import { env, isBrowser, isDev, isProd, isServer } from '../dist/lib/index.js';

console.log('Package import test:');
console.log('isDev:', isDev);
console.log('isProd:', isProd);
console.log('isBrowser:', isBrowser);
console.log('isServer:', isServer);
console.log('API_URL from env:', env('API_URL', 'default-url'));

console.log('✅ Package import successful!');
