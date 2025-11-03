import React from 'react';

export const LocationTrackingProvider = ({
  enabled,
  intervalSeconds,
  onStart,
  onStop,
  children,
}: {
  enabled: boolean;
  intervalSeconds: number;
  onStart: () => void;
  onStop: () => void;
  children: React.ReactNode;
}) => {
  React.useEffect(() => {
    if (!enabled) {
      onStop();
      return;
    }

    onStart();

    return onStop;
  }, [enabled, intervalSeconds, onStart, onStop]);

  return <>{children}</>;
};
