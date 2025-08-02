import { checkMemoryUsage } from '../lib/utils.js';

describe('utils/checkMemoryUsage', () => {
  const originalConsoleWarn = console.warn;
  let consoleWarnCalls: string[] = [];

  beforeEach(() => {
    // Reset console.warn calls
    consoleWarnCalls = [];
    console.warn = (message: string) => {
      consoleWarnCalls.push(message);
    };

    // Reset window.performance for each test
    // @ts-expect-error - setting window.performance
    delete window.performance;
  });

  afterEach(() => {
    // Restore original console.warn
    console.warn = originalConsoleWarn;
    // Reset window.performance
    // @ts-expect-error - deleting window.performance
    delete window.performance;
  });

  it('should warn when memory usage is high', () => {
    // Mock window.performance with high memory usage
    Object.defineProperty(window, 'performance', {
      value: {
        memory: {
          usedJSHeapSize: 900,
          totalJSHeapSize: 1000,
        },
      },
      configurable: true,
    });

    checkMemoryUsage();
    expect(consoleWarnCalls).toContain(
      '🚨 Memory usage is high! Please monitor performance.',
    );
  });

  it('should not warn when memory usage is normal', () => {
    // Mock window.performance with normal memory usage
    Object.defineProperty(window, 'performance', {
      value: {
        memory: {
          usedJSHeapSize: 500,
          totalJSHeapSize: 1000,
        },
      },
      configurable: true,
    });

    checkMemoryUsage();
    expect(consoleWarnCalls).toHaveLength(0);
  });

  it('should warn when memory API is not supported', () => {
    // Mock window.performance without memory property
    Object.defineProperty(window, 'performance', {
      value: {},
      configurable: true,
    });

    checkMemoryUsage();
    expect(consoleWarnCalls).toContain(
      '🚫 Memory API is not supported in this browser.',
    );
  });

  it('should do nothing when window is undefined', () => {
    // Mock window as undefined
    // @ts-expect-error - Intentionally setting window to undefined for test
    delete window.performance;

    checkMemoryUsage();
    expect(consoleWarnCalls).toHaveLength(0);
  });
});
