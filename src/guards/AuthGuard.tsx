'use client';
import { redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react';

type Props = {
  children: React.ReactNode;
};

const AuthGuard = ({ children }: Props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('loggedInUser');
    if (user) {
      setIsAuthenticated(true);
    } else {
      redirect('/login');
    }
  }, []);

  if (!isAuthenticated) {
    return null;
  }

  return <div>{children}</div>;
};

export default AuthGuard;
