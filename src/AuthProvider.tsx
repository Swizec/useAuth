import React, { createContext, useReducer, useEffect, useState } from "react";
// import Auth0 from "auth0-js";
import { Auth0ClientOptions } from "@auth0/auth0-spa-js";
import createAuth0Client from "@auth0/auth0-spa-js";

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
        isAuthenticating: false
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
    auth0_audience_domain,
    auth0_domain,
    auth0_client_id,
    auth0_params
}) => {
    const callbackDomain =
        typeof window !== "undefined"
            ? `${window.location.protocol}//${window.location.host}`
            : "http://localhost:8000";

    const audienceDomain = auth0_audience_domain || auth0_domain;

    const params: Auth0ClientOptions = {
        domain: auth0_domain,
        client_id: auth0_client_id,
        redirect_uri: `${callbackDomain}/auth0_callback`,
        audience: `https://${audienceDomain}/api/v2/`,
        responseType: "token id_token",
        scope: "openid profile email"
    };

    // Holds authentication state
    const [state, dispatch] = useReducer<React.Reducer<AuthState, AuthAction>>(
        authReducer,
        getDefaultState()
    );

    const [contextValue, setContextValue] = useState<AuthContextState>({
        state,
        dispatch,
        auth0: null,
        callback_domain: callbackDomain,
        navigate
    });

    // Instantiate Auth0 client on component mount
    useEffect(() => {
        async function createClient() {
            const auth0 = await createAuth0Client({
                ...params,
                ...auth0_params
            });

            setContextValue({ ...contextValue, auth0 });
        }

        if (typeof window !== "undefined") {
            createClient();
        }
    }, []);

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
        dispatch({
            type: "startAuthenticating"
        });

        const auth0 = contextValue.auth0;

        // auth0!.checkSession({}, (err, authResult) => {
        //     dispatch({
        //         type: "stopAuthenticating"
        //     });

        //     console.log(err);
        //     if (err) {
        //         dispatch({
        //             type: "error",
        //             errorType: "checkSession",
        //             error: err
        //         });
        //     } else {
        //         handleAuthResult({ dispatch, auth0, authResult });
        //     }
        // });
    }, [contextValue.auth0]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};
