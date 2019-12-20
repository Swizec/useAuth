import React, { createContext, useReducer, useEffect, useState } from "react";
import Auth0 from "auth0-js";
import { AuthOptions } from "auth0-js";

import { authReducer } from "./authReducer";
import { handleAuthResult } from "./useAuth";
import {
    AuthProviderInterface,
    AuthState,
    AuthAction,
    AuthContextState
} from "./types";

function getDefaultState(): AuthState {
    const DEFAULT_STATE = {
        user: {},
        expiresAt: null,
        isAuthenticating: true
    };

    let stored_state = {};

    if (typeof localStorage !== "undefined") {
        const expiresAt = new Date(
            JSON.parse(localStorage.getItem("useAuth:expires_at") || "0")
        );

        if (expiresAt > new Date()) {
            stored_state = {
                user: JSON.parse(localStorage.getItem("useAuth:user") || "{}"),
                expiresAt: expiresAt
            };
        }
    }

    return {
        ...DEFAULT_STATE,
        ...stored_state
    };
}

export const AuthContext = createContext<AuthContextState>({
    state: getDefaultState(),
    dispatch: () => {},
    auth0: null,
    callback_domain: "http://localhost:8000",
    navigate: (path: string) => {}
});

export const AuthProvider: AuthProviderInterface = ({
    children,
    navigate,
    auth0_domain,
    auth0_client_id,
    auth0_params
}) => {
    const callback_domain =
        typeof window !== "undefined"
            ? `${window.location.protocol}//${window.location.host}`
            : "http://localhost:8000";

    const params: AuthOptions = {
        domain: auth0_domain,
        clientID: auth0_client_id,
        redirectUri: `${callback_domain}/auth0_callback`,
        audience: `https://${auth0_domain}/api/v2/`,
        responseType: "token id_token",
        scope: "openid profile email"
    };

    // Instantiate Auth0 client
    const auth0 = new Auth0.WebAuth({ ...params, ...auth0_params });

    // Holds authentication state
    const [state, dispatch] = useReducer<React.Reducer<AuthState, AuthAction>>(
        authReducer,
        getDefaultState()
    );

    const [contextValue, setContextValue] = useState<AuthContextState>({
        state,
        dispatch,
        auth0,
        callback_domain,
        navigate
    });

    // Update context value and trigger re-render
    // This patterns avoids unnecessary deep renders
    // https://reactjs.org/docs/context.html#caveats
    useEffect(() => {
        setContextValue((contextValue: AuthContextState) => ({
            ...contextValue,
            state
        }));
    }, [state]);

    // Verify user is logged-in on AuthProvider mount
    // Avoids storing sensitive data in local storage
    useEffect(() => {
        auth0.checkSession({}, (err, authResult) => {
            if (err) {
                dispatch({
                    type: "error",
                    errorType: "checkSession",
                    error: err
                });
            } else {
                handleAuthResult({ dispatch, auth0, authResult });
            }
        });
    }, []);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};
