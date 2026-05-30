/**
 * useKeyboardDismiss - Auto-dismiss keyboard on scroll for iOS/Android
 *
 * Configures the Capacitor Keyboard plugin to hide the keyboard when
 * the user scrolls. This provides a native mobile feel.
 *
 * Does nothing on web.
 *
 * Usage:
 *   // In a provider or layout component
 *   useKeyboardDismiss();
 */
import { useEffect } from 'react';
import { log } from '@app/lib/logger';
import { Capacitor } from '@capacitor/core';
import { Keyboard, KeyboardResize } from '@capacitor/keyboard';

export interface UseKeyboardDismissOptions {
  /** Resize mode when keyboard appears. Default: 'body' */
  resizeMode?: KeyboardResize;
  /** Whether to enable scroll-to-dismiss. Default: true */
  scrollDismiss?: boolean;
}

export function useKeyboardDismiss(
  options: UseKeyboardDismissOptions = {},
): void {
  const { resizeMode = KeyboardResize.Body, scrollDismiss = true } = options;
  const isNative = Capacitor.isNativePlatform();

  useEffect(() => {
    if (!isNative) return;

    const configureKeyboard = async () => {
      try {
        // Set resize behavior (how the webview adjusts when keyboard appears)
        await Keyboard.setResizeMode({ mode: resizeMode });

        // Enable/disable scroll-to-dismiss
        await Keyboard.setScroll({ isDisabled: !scrollDismiss });

        log.info('[Keyboard] Configured:', { resizeMode, scrollDismiss });
      } catch (error) {
        log.error('[Keyboard] Configuration error:', { error });
      }
    };

    configureKeyboard();

    // Optional: Listen to keyboard events for debugging
    const showListener = Keyboard.addListener('keyboardWillShow', (info) => {
      log.debug('[Keyboard] Will show:', { height: info.keyboardHeight });
    });

    const hideListener = Keyboard.addListener('keyboardWillHide', () => {
      log.debug('[Keyboard] Will hide');
    });

    return () => {
      showListener.then((l) => l.remove());
      hideListener.then((l) => l.remove());
    };
  }, [isNative, resizeMode, scrollDismiss]);
}

/**
 * Programmatically hide the keyboard
 */
export async function hideKeyboard(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  try {
    await Keyboard.hide();
  } catch (error) {
    // Silently fail - keyboard may not be showing
  }
}

/**
 * Programmatically show the keyboard
 */
export async function showKeyboard(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  try {
    await Keyboard.show();
  } catch (error) {
    // Silently fail
  }
}

export default useKeyboardDismiss;
