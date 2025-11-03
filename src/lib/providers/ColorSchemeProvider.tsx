import { useColorScheme } from 'nativewind';
import React from 'react';

export const ColorSchemeProvider = ({
  scheme,
  children,
}: {
  scheme: 'light' | 'dark' | 'system';
  children: React.ReactNode;
}) => {
  const { setColorScheme } = useColorScheme();
  React.useEffect(() => {
    setColorScheme(scheme);
  }, [setColorScheme, scheme]);

  return <>{children}</>;
};
