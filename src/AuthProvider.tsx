import React, { createContext, useEffect, useState } from "react";
import Auth0 from "auth0-js";
import { AuthOptions } from "auth0-js";

import { AuthProviderInterface, AuthContextState } from "./types";
import { useAuth } from "./useAuth";

export const AuthContext = createContext<AuthContextState>({
    auth0: null,
    callback_domain: "http://localhost:8000",
    customPropertyNamespace: "http://localhost:8000",
    navigate: (path: string) => {}
});

export const AuthProvider: AuthProviderInterface = ({
    children,
    navigate,
    auth0_audience_domain,
    auth0_domain,
    auth0_client_id,
    auth0_params,
    customPropertyNamespace
}) => {
    const callbackDomain =
        typeof window !== "undefined"
            ? `${window.location.protocol}//${window.location.host}`
            : "http://localhost:8000";

    const audienceDomain = auth0_audience_domain || auth0_domain;

    const params: AuthOptions = {
        domain: auth0_domain,
        clientID: auth0_client_id,
        redirectUri: `${callbackDomain}/auth0_callback`,
        audience: `https://${audienceDomain}/api/v2/`,
        responseType: "token id_token",
        scope: "openid profile email"
    };

    const { dispatch } = useAuth();

    // Instantiate Auth0 client

    useEffect(() => {
        const auth0 = new Auth0.WebAuth({ ...params, ...auth0_params });
        dispatch("SET_CONFIG", {
            authProvider: auth0,
            navigate,
            customPropertyNamespace,
            callbackDomain
        });
    }, [navigate, customPropertyNamespace, callbackDomain]);

    // Holds authentication state
    // const [state, send] = useMachine(authMachine);
    // hydrateFromLocalStorage(send);

    // const [contextValue, setContextValue] = useState<AuthContextState>({
    //     // state: state.context,
    //     // send,
    //     auth0,
    //     callback_domain: callbackDomain,
    //     customPropertyNamespace,
    //     navigate
    // });

    // Update context value and trigger re-render
    // This patterns avoids unnecessary deep renders
    // https://reactjs.org/docs/context.html#caveats
    // useEffect(() => {
    //     setContextValue((contextValue: AuthContextState) => ({
    //         ...contextValue
    //         // state: state.context
    //     }));
    // }, []);

    // // Verify user is logged-in on AuthProvider mount
    // // Avoids storing sensitive data in local storage
    // useEffect(() => {
    //     send("LOGIN");

    //     auth0.checkSession({}, (err, authResult) => {
    //         console.log(err);
    //         if (err) {
    //             send("ERROR", {
    //                 errorType: "checkSession",
    //                 error: err
    //             });
    //         } else {
    //             handleAuthResult({ send, auth0, authResult });
    //         }
    //     });
    // }, []);

    return <React.Fragment>{children}</React.Fragment>;
};
