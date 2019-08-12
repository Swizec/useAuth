declare module 'react-use-auth' {
  import { User } from 'auth0';
  import { AuthOptions } from 'auth0-js';
  import { useContext } from 'react';

  export interface IAuthProviderProps {
    auth0_client_id: string;
    auth0_domain: string;
    auth0_params: Partial<AuthOptions>;
    children: React.ReactNode;
    navigate(to: string, ... args: any[]): any;
  }
  
  export interface IUseAuth {
    user: User | {};
    userId: string | null;
    login(): void;
    logout(): void;
    handleAuthentication(): void;
    isAuthenticated(): boolean;
  }

  /**
   * React hook for authentication
   * 
   * ```jsx
   * // src/pages/index.js
   * const Login = () => {
   * const { isAuthenticated, login, logout } = useAuth()
   * 
   * if (isAuthenticated()) {
   *    return <Button onClick={logout}>Logout</Button>
   * } else {
   *    return <Button onClick={login}>Login</Button>
   * }
   * ```
   *
   * @export
   * @returns {IUseAuth}
   */
  export function useAuth(): IUseAuth;

  /**
   * AuthProvider component
   * 
   * ```javascript
   * // gatsby-browser.js
   * 
   * import React from "react"
   * import { navigate } from "gatsby"
   * import { AuthProvider } from "react-use-auth"
   * 
   * export const wrapRootElement = ({ element }) => (
   *    <AuthProvider
   *      navigate={navigate}
   *      auth0_domain="useauth.auth0.com"
   *      auth0_client_id="GjWNFNOHq1ino7lQNJBwEywa1aYtbIzh"
   *    >
   *      {element}
   *    </AuthProvider>
   * )
   * ```
   */
  export const AuthProvider: React.ExoticComponent<IAuthProviderProps>;
}