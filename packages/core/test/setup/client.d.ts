import '@testing-library/jest-dom/vitest';
/**
 * 解决 TypeError: URL.createObjectURL is not a function
 * 解决 ReferenceError: Worker is not defined
 */
import 'jsdom-worker';
