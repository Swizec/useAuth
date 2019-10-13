import {
    Auth0UserProfile,
    Auth0DecodedHash,
    WebAuth,
    Auth0Error
} from "auth0-js";

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
    err: Error;
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
