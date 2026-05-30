'use client';

import React from 'react';
import { ToastCatto } from '@ccatto/ui';
import { ToastPlacement, useToastStore } from '@zustand/useToastStore';

function getPlacementStyle(placement: ToastPlacement, index: number) {
  const offset = index * 80; // 80px between toasts

  switch (placement) {
    case 'upperRight':
      return { top: `${16 + offset}px`, right: '16px' };
    case 'upperLeft':
      return { top: `${16 + offset}px`, left: '16px' };
    case 'lowerRight':
      return { bottom: `${80 + offset}px`, right: '16px' };
    case 'lowerLeft':
      return { bottom: `${80 + offset}px`, left: '16px' };
    case 'center':
      return {
        top: '50%',
        left: '50%',
        transform: `translate(-50%, calc(-50% + ${offset}px))`,
      };
    default:
      return { top: `${16 + offset}px`, right: '16px' };
  }
}

export default function ToastContainerCatto() {
  const { toasts, removeToast, maxVisible } = useToastStore();

  // Group toasts by placement for proper stacking
  const groupedToasts = toasts.reduce(
    (acc, toast) => {
      const placement = toast.placement || 'upperRight';
      if (!acc[placement]) acc[placement] = [];
      acc[placement].push(toast);
      return acc;
    },
    {} as Record<ToastPlacement, typeof toasts>,
  );

  return (
    <>
      {Object.entries(groupedToasts).map(([placement, placementToasts]) =>
        placementToasts.slice(0, maxVisible).map((toast, index) => (
          <div
            key={toast.id}
            style={{
              position: 'fixed',
              zIndex: 9999,
              ...getPlacementStyle(placement as ToastPlacement, index),
            }}
          >
            <ToastCatto
              header={toast.header}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              body={toast.body as any}
              variant={toast.variant}
              duration={toast.duration}
              onClose={() => removeToast(toast.id)}
            />
          </div>
        )),
      )}
    </>
  );
}
