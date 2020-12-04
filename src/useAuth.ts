import { useCallback } from "react";

import { useAuthInterface } from "./types";
import { useService } from "@xstate/react";
import { authService } from "./authReducer";
import { isAfter } from "date-fns";

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
export const useAuth: useAuthInterface = () => {
    const [state, dispatch] = useService(authService);

    const { authProvider, navigate, callbackDomain } = state.context.config;

    const login = () => {
        authProvider?.authorize();
    };

    const signup = () => {
        authProvider?.signup();
    };

    const logout = (postLogoutRoute?: string) => {
        // React sends a click event by default, we don't care
        if (typeof postLogoutRoute === "string") {
            authProvider?.logout(`${callbackDomain}${postLogoutRoute}`);
        } else {
            authProvider?.logout();
        }

        dispatch("LOGOUT");

        // Return to the homepage after logout.
        navigate(typeof postLogoutRoute === "string" ? postLogoutRoute : "/");
    };

    const handleAuthentication = useCallback(
        async ({ postLoginRoute = "/" } = {}) => {
            if (!authProvider || !navigate) {
                console.warn("authProvider not configured yet");
                return;
            }

            if (typeof window !== "undefined") {
                dispatch("LOGIN");

                const loggedIn = await authProvider.handleLoginCallback(
                    dispatch
                );

                if (loggedIn) {
                    navigate(postLoginRoute);
                }
            }
        },
        [authProvider, navigate]
    );

    const isAuthenticated = () => {
        return !!(
            state.context.expiresAt &&
            isAfter(state.context.expiresAt, new Date())
        );
    };

    const isAuthorized = (roles: string | string[]) => {
        const _roles = Array.isArray(roles) ? roles : [roles];
        const userRoles = authProvider?.userRoles(state.context.user);

        if (!isAuthenticated() || !userRoles) {
            return false;
        } else {
            return _roles.some(role => userRoles.includes(role));
        }
    };

    return {
        isAuthenticating: state.context.isAuthenticating,
        isAuthenticated,
        isAuthorized,
        user: state.context.user,
        userId: authProvider?.userId(state.context.user),
        authResult: state.context.authResult,
        login,
        signup,
        logout,
        handleAuthentication,
        dispatch
    };
};
