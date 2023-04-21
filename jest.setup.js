import '@testing-library/jest-dom';
import 'jest-canvas-mock';

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserver;