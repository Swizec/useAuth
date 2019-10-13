import {
    Auth0UserProfile,
    Auth0DecodedHash,
    WebAuth,
    Auth0Error,
    AuthOptions
} from "auth0-js";
import { ReactNode } from "react";

export type AuthState = {
    user: Auth0UserProfile | {};
    authResult: Auth0DecodedHash;
    expiresAt: number | null;
    isAuthenticating: boolean;
    errorType?: string;
    error?: Error;
};

export type AuthAction = {
    type:
        | "login"
        | "logout"
        | "startAuthenticating"
        | "stopAuthenticating"
        | "error";
    authResult?: Auth0DecodedHash;
    user?: Auth0UserProfile;
    errorType?: string;
    error?: Error | Auth0Error;
};

export interface useAuthInterface {
    (): {
        isAuthenticating: boolean;
        isAuthenticated: () => boolean;
        user: Auth0UserProfile | {};
        userId: string | null;
        authResult: Auth0DecodedHash;
        login: () => void;
        logout: () => void;
        handleAuthentication: ({
            postLoginRoute
        }: {
            postLoginRoute?: string;
        }) => void;
    };
}

export type AuthDispatch = ({ ...AuthAction }) => void;

export type handleAuthResultInterface = ({
    err,
    dispatch,
    auth0,
    authResult
}: {
    err?: Error;
    dispatch: AuthDispatch;
    auth0: WebAuth;
    authResult: Auth0DecodedHash;
}) => Promise<boolean>;

export type setSessionInterface = ({
    dispatch,
    auth0,
    authResult
}: {
    dispatch: AuthDispatch;
    auth0: WebAuth;
    authResult: Auth0DecodedHash;
}) => Promise<Auth0UserProfile>;

export type AuthProviderInterface = ({
    children,
    navigate,
    auth0_domain,
    auth0_client_id,
    auth0_params
}: {
    children: ReactNode;
    navigate: (path: string) => void;
    auth0_domain: string;
    auth0_client_id: string;
    auth0_params: AuthOptions;
}) => ReactNode;

export type AuthContextState = {
    state: AuthState;
    dispatch: AuthDispatch;
    auth0: WebAuth;
    callback_domain: string;
    navigate: (path: string) => void;
};
