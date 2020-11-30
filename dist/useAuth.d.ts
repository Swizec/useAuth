import { useAuthInterface } from "./types";
/**
 * The main API for useAuth
 *
 * @return {boolean} isAuthenticated is current user authenticated
 * @return {boolean} isAuthenticating currently running authentication
 * @return {function} isAuthorized check if current user is authenticated and matches list of roles
 * @return {object} user current user
 * @return {string} userId current user's identifier
 * @return {object} authResult raw authentication result object from auth provider
 * @return {function} login start the login process
 * @return {function} signup same as login, passes { mode: "signUp", screen_hint: "signup" } to Auth0
 * @return {function} logout start the logout process
 * @return {function} handleAuthentication function to call on your callback page
 */
export declare const useAuth: useAuthInterface;
