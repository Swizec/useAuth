import { ReactNode, Dispatch } from "react";
import { Auth0Client, Auth0ClientOptions } from "@auth0/auth0-spa-js";
export declare type AuthState = {
    user: any | {
        sub?: string;
    };
    authResult?: any | null;
    expiresAt: number | null;
    isAuthenticating: boolean;
    errorType?: string;
    error?: Error | any | any;
};
export declare type AuthAction = {
    type: "login";
    authResult: any;
    user: any;
} | {
    type: "logout" | "stopAuthenticating" | "startAuthenticating";
} | {
    type: "error";
    errorType: string;
    error: Error | any | any;
};
export interface useAuthInterface {
    (): {
        isAuthenticating: boolean;
        isAuthenticated: () => boolean;
        user: any | {
            sub?: string;
        };
        userId: string | null | undefined;
        authResult: any | undefined | null;
        login: () => void;
        logout: () => void;
        handleAuthentication: ({ postLoginRoute }: {
            postLoginRoute?: string;
        }) => void;
    };
}
export declare type AuthDispatch = Dispatch<AuthAction>;
export declare type handleAuthResultInterface = ({ err, dispatch, auth0, authResult }: {
    err?: Error | any | null;
    dispatch: AuthDispatch;
    auth0: Auth0Client;
    authResult: any | null;
}) => Promise<boolean>;
export declare type setSessionInterface = ({ dispatch, auth0, authResult }: {
    dispatch: AuthDispatch;
    auth0: Auth0Client;
    authResult: any;
}) => Promise<any>;
export declare type AuthProviderInterface = ({ children, navigate, auth0_domain, auth0_audience_domain, auth0_client_id, auth0_params }: {
    children: ReactNode;
    navigate: (path: string) => void;
    auth0_domain: string;
    auth0_audience_domain: string;
    auth0_client_id: string;
    auth0_params: Auth0ClientOptions;
}) => JSX.Element;
export declare type AuthContextState = {
    state: AuthState;
    dispatch: AuthDispatch;
    auth0: Auth0Client | null;
    callback_domain: string;
    navigate: (path: string) => void;
};
