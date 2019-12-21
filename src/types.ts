import {
    Auth0UserProfile,
    Auth0DecodedHash,
    WebAuth,
    Auth0Error,
    AuthOptions,
    Auth0ParseHashError
} from "auth0-js";
import { ReactNode, Dispatch } from "react";

export type AuthState = {
    user: Auth0UserProfile | { sub?: string };
    authResult?: Auth0DecodedHash | null;
    expiresAt: number | null;
    isAuthenticating: boolean;
    errorType?: string;
    error?: Error | Auth0Error | Auth0ParseHashError;
};

export type AuthAction =
    | {
          type: "login";
          authResult: Auth0DecodedHash;
          user: Auth0UserProfile;
      }
    | { type: "logout" | "stopAuthenticating" | "startAuthenticating" }
    | {
          type: "error";
          errorType: string;
          error: Error | Auth0Error | Auth0ParseHashError;
      };

export interface useAuthInterface {
    (): {
        isAuthenticating: boolean;
        isAuthenticated: () => boolean;
        user: Auth0UserProfile | { sub?: string };
        userId: string | null | undefined;
        authResult: Auth0DecodedHash | undefined | null;
        error?: Error | Auth0Error | Auth0ParseHashError;
        errorType?: string;
        login: () => void;
        logout: () => void;
        handleAuthentication: ({
            postLoginRoute
        }: {
            postLoginRoute?: string;
        }) => void;
    };
}

export type AuthDispatch = Dispatch<AuthAction>;

export type handleAuthResultInterface = ({
    err,
    dispatch,
    auth0,
    authResult
}: {
    err?: Error | Auth0ParseHashError | null;
    dispatch: AuthDispatch;
    auth0: WebAuth;
    authResult: Auth0DecodedHash | null;
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
}) => JSX.Element;

export type AuthContextState = {
    state: AuthState;
    dispatch: AuthDispatch;
    auth0: WebAuth | null;
    callback_domain: string;
    navigate: (path: string) => void;
};
