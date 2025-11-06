/* We disable this because we are dealing with a large list and this would be more perfomant though not a 'react way' */
/* eslint-disable react-hooks/refs */
import React from 'react';
import { useLocationStore, type Location } from '../storage/location';

type UseLocationPaginationHookReturn = {
  locations: Location[];
  loadMore: () => void;
  updateById: (id: string, loc: Partial<Omit<Location, 'id'>>) => void;
  deleteById: (id: string) => void;
  itemsCount: number;
  totalCount: number;
};

export const useLocationPagination = ({
  perPage,
}: {
  perPage: number;
}): UseLocationPaginationHookReturn => {
  // the locations map will allow us to do O(1) update and O(1) delete
  const locationsMapRef = React.useRef(new Map<string, Location>());
  const deletedLocsRef = React.useRef(new Set<string>());
  const locationsRef = React.useRef<Location[]>([]);
  const hasMoreRef = React.useRef<boolean>(true);
  const visibleRef = React.useRef<Location[]>([]);
  const totalCount = React.useRef<number>(0);
  const [, updateUI] = React.useReducer(prev => prev + 1, 0);
  const getLocationPagination = useLocationStore.use.getLocationPagination();

  const recomputeVisible = () => {
    visibleRef.current = locationsRef.current.filter(
      loc => !deletedLocsRef.current.has(loc.id),
    );
  };

  const loadMore = React.useCallback(() => {
    if (!hasMoreRef.current) {
      return;
    }

    const offset = locationsRef.current.length;
    const result = getLocationPagination(offset, perPage);

    for (const loc of result.locations) {
      // now both the array and the map has the same reference to the location object
      locationsRef.current.push(loc);
      locationsMapRef.current.set(loc.id, loc);
    }
    hasMoreRef.current = result.hasMore;
    totalCount.current = result.total - deletedLocsRef.current.size;

    // we will always end up with this so we are in full control of the rendering
    recomputeVisible();
    updateUI();
  }, [getLocationPagination, perPage]);

  const updateById = (id: string, loc: Partial<Omit<Location, 'id'>>) => {
    const target = locationsMapRef.current.get(id);
    if (!target) {
      return;
    }

    // we will use if statements as it is the most efficient way for this case with small amount of parameters
    if (loc.latitude !== undefined) {
      target.latitude = loc.latitude;
    }

    if (loc.longitude !== undefined) {
      target.longitude = loc.longitude;
    }

    if (loc.timestamp !== undefined) {
      target.timestamp = loc.timestamp;
    }

    updateUI();
  };

  const deleteById = (id: string) => {
    const target = locationsMapRef.current.get(id);
    if (!target) {
      return;
    }

    deletedLocsRef.current.add(target.id);
    totalCount.current -= 1;

    recomputeVisible();
    updateUI();
  };

  React.useEffect(() => {
    loadMore();
  }, [loadMore]);

  return {
    locations: visibleRef.current as Location[],
    itemsCount: visibleRef.current.length,
    totalCount: totalCount.current,
    loadMore,
    updateById,
    deleteById,
  };
};
