/**
 * useHaptics - Native haptic feedback hook for iOS/Android
 *
 * Provides haptic feedback on native platforms (iOS/Android via Capacitor).
 * Silently does nothing on web to avoid errors.
 *
 * Usage:
 *   const { impact, notification, selectionChanged } = useHaptics();
 *
 *   // Light tap feedback (buttons, toggles)
 *   <button onClick={() => { impact('light'); handleClick(); }}>
 *
 *   // Success/error feedback (form submission)
 *   notification('success');
 *   notification('error');
 *
 *   // Selection feedback (sliders, pickers)
 *   selectionChanged();
 */
import { useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

type ImpactWeight = 'light' | 'medium' | 'heavy';
type NotificationStyle = 'success' | 'warning' | 'error';

const impactStyleMap: Record<ImpactWeight, ImpactStyle> = {
  light: ImpactStyle.Light,
  medium: ImpactStyle.Medium,
  heavy: ImpactStyle.Heavy,
};

const notificationTypeMap: Record<NotificationStyle, NotificationType> = {
  success: NotificationType.Success,
  warning: NotificationType.Warning,
  error: NotificationType.Error,
};

export function useHaptics() {
  const isNative = Capacitor.isNativePlatform();

  /**
   * Trigger impact feedback - use for button taps, UI interactions
   * @param weight - 'light' (default), 'medium', or 'heavy'
   */
  const impact = useCallback(
    async (weight: ImpactWeight = 'light') => {
      if (!isNative) return;
      try {
        await Haptics.impact({ style: impactStyleMap[weight] });
      } catch {
        // Silently fail - haptics may not be available
      }
    },
    [isNative],
  );

  /**
   * Trigger notification feedback - use for success/error states
   * @param type - 'success', 'warning', or 'error'
   */
  const notification = useCallback(
    async (type: NotificationStyle = 'success') => {
      if (!isNative) return;
      try {
        await Haptics.notification({ type: notificationTypeMap[type] });
      } catch {
        // Silently fail
      }
    },
    [isNative],
  );

  /**
   * Trigger selection changed feedback - use for sliders, pickers, scroll snapping
   */
  const selectionChanged = useCallback(async () => {
    if (!isNative) return;
    try {
      await Haptics.selectionChanged();
    } catch {
      // Silently fail
    }
  }, [isNative]);

  /**
   * Trigger vibration - use sparingly, mainly for critical alerts
   * @param duration - milliseconds (default 300)
   */
  const vibrate = useCallback(
    async (duration: number = 300) => {
      if (!isNative) return;
      try {
        await Haptics.vibrate({ duration });
      } catch {
        // Silently fail
      }
    },
    [isNative],
  );

  return {
    impact,
    notification,
    selectionChanged,
    vibrate,
    isNative,
  };
}

export default useHaptics;
