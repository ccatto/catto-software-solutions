'use client';

/**
 * NetworkStatusProvider - Monitors network connectivity and shows offline banner
 *
 * This provider should be placed in the root layout to monitor network status.
 * When the device goes offline, it shows a fixed banner at the top of the screen.
 *
 * Usage:
 *   // In layout.tsx or providers.tsx
 *   <NetworkStatusProvider>
 *     {children}
 *   </NetworkStatusProvider>
 */
import { ReactNode, useEffect, useState } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { useHaptics } from '@lib/hooks/useHaptics';
import { useNetworkStatus } from '@lib/hooks/useNetworkStatus';

interface NetworkStatusProviderProps {
  children: ReactNode;
}

export function NetworkStatusProvider({
  children,
}: NetworkStatusProviderProps) {
  const { isConnected, connectionType, isChecking } = useNetworkStatus();
  const { notification } = useHaptics();
  const [showBanner, setShowBanner] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    // Don't show banner while checking initial status
    if (isChecking) return;

    if (!isConnected) {
      // Device went offline
      setShowBanner(true);
      setWasOffline(true);
      notification('warning');
    } else if (wasOffline && isConnected) {
      // Device came back online after being offline
      notification('success');
      // Show "back online" briefly then hide
      setTimeout(() => {
        setShowBanner(false);
        setWasOffline(false);
      }, 2000);
    }
  }, [isConnected, isChecking, wasOffline, notification]);

  return (
    <>
      {/* Offline/Online Banner */}
      {showBanner && !isChecking && (
        <div
          className={`fixed top-0 left-0 right-0 z-[9999] px-4 py-2 text-center text-sm font-medium transition-all duration-300 ${
            isConnected ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}
          style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
        >
          <div className="flex items-center justify-center gap-2">
            {isConnected ? (
              <>
                <Wifi className="h-4 w-4" />
                <span>Back online</span>
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4" />
                <span>No internet connection</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Add padding to content when banner is shown and offline */}
      <div className={showBanner && !isConnected ? 'pt-10' : ''}>
        {children}
      </div>
    </>
  );
}

export default NetworkStatusProvider;
