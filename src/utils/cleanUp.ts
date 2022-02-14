import { ExtendedConfig } from '../types';
import Browser from './browser';

export function cleanUp(config: ExtendedConfig) {
  const { onLoadingEnd, onLoadingStart, onPrintDialogClose, frameId, printable } = config;

  // Check for a finished loading hook function
  onLoadingEnd?.();

  // If preloading pdf files, clean blob url
  if (onLoadingStart && typeof printable === 'string') window.URL.revokeObjectURL(printable);

  let event = 'mouseover';

  if (Browser.isChrome || Browser.isFirefox) {
    // Ps.: Firefox will require an extra click in the document to fire the focus event.
    event = 'focus';
  }

  const handler = () => {
    // Make sure the event only happens once.
    window.removeEventListener(event, handler);

    // Remove iframe from the DOM
    const iframe = document.getElementById(frameId);
    setTimeout(() => iframe?.remove(), Browser.isEdge ? 1000 : 10);

    // Run onPrintDialogClose callback
    onPrintDialogClose?.();
  };

  window.addEventListener(event, handler);
}
