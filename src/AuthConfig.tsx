import * as React from "react";
import { AuthConfigInterface, ProviderOptions } from "./types";
import { useAuth } from "./useAuth";

export const AuthConfig: AuthConfigInterface = ({
    authProvider,
    params,
    navigate,
    children
}) => {
    const { dispatch } = useAuth();

    const callbackDomain =
        typeof window !== "undefined"
            ? `${window.location.protocol}//${window.location.host}`
            : "http://localhost:8000";

    React.useEffect(() => {
        // instantiate auth provider on page load
        const authInstance = new authProvider({
            dispatch,
            ...authProvider.addDefaultParams(
                params as ProviderOptions,
                callbackDomain
            )
        });

        // set config in XState
        dispatch("SET_CONFIG", {
            authProvider: authInstance,
            navigate,
            callbackDomain
        });

        dispatch("CHECK_SESSION");
    }, [dispatch, authProvider, params, navigate]);

    return <>{children}</>;
};
