/**
 * useDeepLinks - Deep link handling hook for iOS/Android
 *
 * Handles deep links (myapp://path) and app URL opens.
 * Uses Capacitor App plugin to listen for URL opens.
 *
 * URL Scheme: myapp://
 *
 * Examples:
 *   myapp://org/my-league                    → /org/my-league
 *   myapp://org/my-league/tournament/123     → /org/my-league/tournament/123
 *   myapp://org/my-league/team/456           → /org/my-league/team/456
 *
 * Usage:
 *   // In a component or provider
 *   useDeepLinks({
 *     onDeepLink: (path) => {
 *       router.push(path);
 *     }
 *   });
 */
import { useEffect, useRef } from 'react';
import { log } from '@app/lib/logger';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

export interface UseDeepLinksOptions {
  /** Callback when a deep link is received */
  onDeepLink?: (path: string, url: string) => void;
}

export interface DeepLinkInfo {
  /** The full URL that was opened */
  url: string;
  /** The path portion (e.g., /org/my-league) */
  path: string;
  /** URL search params if any */
  params: URLSearchParams;
}

/**
 * Parse a deep link URL into its components
 */
export function parseDeepLink(url: string): DeepLinkInfo {
  // Handle myapp:// scheme
  // myapp://org/my-league → /org/my-league
  const urlWithoutScheme = url.replace(/^myapp:\/\//, '');

  // Handle https://www.myapp.com URLs (Universal Links)
  const urlWithoutDomain = urlWithoutScheme.replace(
    /^https?:\/\/(www\.)?myapp\.com/,
    '',
  );

  // Extract path and query string
  const [pathPart, queryPart] = urlWithoutDomain.split('?');

  // Ensure path starts with /
  const path = pathPart.startsWith('/') ? pathPart : `/${pathPart}`;

  // Parse query params
  const params = new URLSearchParams(queryPart || '');

  return {
    url,
    path,
    params,
  };
}

export function useDeepLinks(options: UseDeepLinksOptions = {}): void {
  const { onDeepLink } = options;
  const isNative = Capacitor.isNativePlatform();
  const listenerRegistered = useRef(false);

  useEffect(() => {
    if (!isNative || listenerRegistered.current) return;
    listenerRegistered.current = true;

    // Listen for app URL open events (deep links)
    const urlOpenListener = App.addListener(
      'appUrlOpen',
      (event: URLOpenListenerEvent) => {
        log.info('[DeepLinks] App URL opened:', { url: event.url });

        const { path, url } = parseDeepLink(event.url);

        log.info('[DeepLinks] Parsed deep link:', { path, originalUrl: url });

        if (onDeepLink) {
          onDeepLink(path, url);
        }
      },
    );

    // Check if app was launched with a URL
    App.getLaunchUrl().then((launchUrl) => {
      if (launchUrl?.url) {
        log.info('[DeepLinks] App launched with URL:', { url: launchUrl.url });

        const { path, url } = parseDeepLink(launchUrl.url);

        if (onDeepLink) {
          onDeepLink(path, url);
        }
      }
    });

    return () => {
      urlOpenListener.then((listener) => listener.remove());
    };
  }, [isNative, onDeepLink]);
}

export default useDeepLinks;
