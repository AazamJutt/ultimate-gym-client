import React, { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import DefaultLayout from './DefaultLayout';
import AuthLayout from './AuthLayout';

const LayoutWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  const location = useLocation();
  const Layout = !location.pathname.includes('auth')
    ? DefaultLayout
    : AuthLayout;
  return <Layout>{children}</Layout>;
};

export default LayoutWrapper;
