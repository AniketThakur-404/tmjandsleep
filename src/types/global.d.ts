export {};

declare global {
  interface Window {
    /** Set by the hero once its first video frame has loaded. */
    __heroReady?: boolean;
    /** Set by the intro loader when the page is revealed. */
    __appRevealed?: boolean;
  }
}
