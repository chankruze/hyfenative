import type { ReactNode } from 'react';
import { ToastContainer } from './toast-container';

type Props = {
  children: ReactNode;
};

export const ToastProvider = ({ children }: Props) => {
  return (
    <>
      {children}
      <ToastContainer />
    </>
  );
};
