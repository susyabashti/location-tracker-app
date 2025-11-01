import React from 'react';
import { LocationPermissions } from './consts';
import { checkPermissions } from './location';

export const useLocationPermissions = () => {
  const [hasPermissions, setPermissions] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const check = async () => {
      setLoading(true);
      try {
        const status = await checkPermissions(LocationPermissions);
        setPermissions(status);
      } catch (err) {
        // we'd want to add here some sort of a better error tracing
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    check();
  }, []);

  return [hasPermissions, isLoading];
};
