import React, { createContext, useContext } from 'react';

interface DrawerContextData {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const DrawerContext = createContext<DrawerContextData>({} as DrawerContextData);

const DrawerProvider: React.FC = ({ children }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <DrawerContext.Provider
      value={{
        open,
        setOpen,
      }}
    >
      { children }
    </DrawerContext.Provider>
  );
};

export default DrawerProvider;

export const useDrawer = () => {
  const context = useContext(DrawerContext);
  if (!context) throw new Error('useDrawer must be used within a DrawerProvider');
  const { open, setOpen } = context;
  return { open, setOpen };
};
