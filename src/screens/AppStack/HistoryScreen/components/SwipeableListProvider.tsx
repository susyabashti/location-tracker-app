import React, { createContext, useContext } from 'react';

const OpenRowContext = createContext<{
  openRowId: string | null;
  setOpenRowId: (id: string | null) => void;
}>({
  openRowId: null,
  setOpenRowId: () => {},
});

export const SwipeableListProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [openRowId, setOpenRowId] = React.useState<string | null>(null);

  return (
    <OpenRowContext.Provider value={{ openRowId, setOpenRowId }}>
      {children}
    </OpenRowContext.Provider>
  );
};

export const useOpenRow = () => useContext(OpenRowContext);
