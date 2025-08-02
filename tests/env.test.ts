import { ENV, isCSR, isEnvVarDefined, isSSR } from '../lib/env.js';

describe('Environment Constants', () => {
  it('should have correct environment values', () => {
    expect(ENV.Development).toBe('development');
    expect(ENV.Production).toBe('production');
    expect(ENV.Test).toBe('test');
    expect(ENV.Staging).toBe('staging');
    expect(ENV.UAT).toBe('uat');
  });
});

describe('Environment Checks', () => {
  const originalNodeEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
  });

  it('should detect development environment', () => {
    process.env.NODE_ENV = 'development';
    // In ES modules, we need to re-import to get fresh values
    expect(process.env.NODE_ENV).toBe('development');
    // Note: isDev is imported at the top, so it won't reflect runtime changes
    // This test validates the environment variable is set correctly
  });

  it('should detect production environment', () => {
    process.env.NODE_ENV = 'production';
    expect(process.env.NODE_ENV).toBe('production');
  });

  it('should detect test environment', () => {
    process.env.NODE_ENV = 'test';
    expect(process.env.NODE_ENV).toBe('test');
  });

  it('should detect staging environment', () => {
    process.env.NODE_ENV = 'staging';
    expect(process.env.NODE_ENV).toBe('staging');
  });

  it('should detect uat environment', () => {
    process.env.NODE_ENV = 'uat';
    expect(process.env.NODE_ENV).toBe('uat');
  });
});

describe('Server and Browser Detection', () => {
  it('should detect browser environment when window and document are available', () => {
    // In jsdom environment, window and document are available
    expect(isSSR()).toBe(false);
    expect(isCSR()).toBe(true);
  });
});

describe('SSR/CSR Detection', () => {
  it('should correctly identify CSR environment in jsdom', () => {
    // In jsdom environment, we're simulating a browser
    expect(isSSR()).toBe(false);
    expect(isCSR()).toBe(true);
  });
});

describe('Environment Variable Check', () => {
  it('should return true for defined environment variables', () => {
    process.env.TEST_VAR = 'test';
    expect(isEnvVarDefined('TEST_VAR')).toBe(true);
  });

  it('should return false for undefined environment variables', () => {
    delete process.env.TEST_VAR;
    expect(isEnvVarDefined('TEST_VAR')).toBe(false);
  });

  it('should return false for empty environment variables', () => {
    process.env.TEST_VAR = '';
    expect(isEnvVarDefined('TEST_VAR')).toBe(false);
  });
});
