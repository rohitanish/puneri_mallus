"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';
import TribeAlert from '@/components/TribeAlert';

type AlertType = 'success' | 'error' | 'info';

interface AlertContextType {
  showAlert: (message: string, type?: AlertType) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alert, setAlert] = useState<{ message: string; type: AlertType; isVisible: boolean }>({
    message: '',
    type: 'success',
    isVisible: false,
  });

  const showAlert = (message: string, type: AlertType = 'success') => {
    setAlert({ message, type, isVisible: true });
  };

  const hideAlert = () => setAlert((prev) => ({ ...prev, isVisible: false }));

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <TribeAlert 
        message={alert.message} 
        type={alert.type} 
        isVisible={alert.isVisible} 
        onClose={hideAlert} 
      />
    </AlertContext.Provider>
  );
}

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) throw new Error('useAlert must be used within an AlertProvider');
  return context;
};