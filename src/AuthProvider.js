import React, { createContext, useReducer, useEffect, useState } from "react";
import PropTypes from "prop-types";
import Auth0 from "auth0-js";

import { authReducer } from "./authReducer";
import { handleAuthResult } from "./useAuth";

export const AuthContext = createContext(null);

export const AuthProvider = ({
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

    const params = {
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
    const [state, dispatch] = useReducer(authReducer, {
        user: {},
        expiresAt: null,
        isAuthenticating: false
    });

    const [contextValue, setContextValue] = useState({
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
        setContextValue({ ...contextValue, state });
    }, [state]);

    // Verify user is logged-in on AuthProvider mount
    // Avoids storing sensitive data in local storage
    useEffect(() => {
        dispatch({
            type: "toggleAuthenticating"
        });
        auth0.checkSession({}, (err, authResult) => {
            dispatch({
                type: "toggleAuthenticating"
            });
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

AuthProvider.propTypes = {
    children: PropTypes.element,
    navigate: PropTypes.func,
    auth0_domain: PropTypes.string,
    auth0_client_id: PropTypes.string,
    auth0_params: PropTypes.object
};
