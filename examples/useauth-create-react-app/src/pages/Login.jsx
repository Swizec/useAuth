import { FC, useEffect } from 'react';
import { useAuth } from 'react-use-auth';

export const LoginPage: FC = () => {
  let { login } = useAuth();

  useEffect(() => {
    login();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};
