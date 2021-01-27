import {
    Auth0UserProfile,
    Auth0DecodedHash,
    Auth0Error,
    Auth0ParseHashError,
    AuthOptions as Auth0Options
} from "auth0-js";
import * as NetlifyIdentityWidget from "netlify-identity-widget";
import { ReactNode } from "react";
import { AnyEventObject, PayloadSender } from "xstate";
import { FirebaseOptions, FirebaseUser } from "./providers/FirebaseUI";

import * as Providers from "./providers";

// Type representing all possible params for auth providers
export type AuthOptions = {
    dispatch: (eventName: string, eventData?: any) => void;
    customPropertyNamespace?: string;
} & ProviderOptions;

export type ProviderOptions =
    | Auth0Options
    | NetlifyIdentityWidget.InitOptions
    | FirebaseOptions;

// Type for the auth result coming from your auth provider
// Needs at least `expiresIn` for useAuth internals
export type AuthResult = ({ expiresIn: number } & Auth0DecodedHash) | null;

// Type for every possible user type for auth providers
export type AuthUser = (
    | Auth0UserProfile
    | NetlifyIdentityWidget.User
    | FirebaseUser
    | {}
) & {
    [key: string]: any;
};

export type AuthConfigInterface = (props: {
    // which auth provider to use
    authProvider:
        | typeof Providers.Auth0
        | typeof Providers.NetlifyIdentity
        | typeof Providers.FirebaseUI;
    // params to instantiate auth provider
    params?: Omit<AuthOptions, "dispatch">;
    // your navigation/routing function
    navigate: Function;

    // optional children if you prefer to use this as a wrapper
    children?: ReactNode;
}) => JSX.Element;

// TODO: types are leaking Auth0
export type AuthState = {
    user: AuthUser;
    authResult?: AuthResult;
    expiresAt: Date | null;
    isAuthenticating: boolean;
    errorType?: string;
    error?: Error | Auth0Error | Auth0ParseHashError;
    config: {
        navigate: Function;
        authProvider?: AuthProviderClass;
        callbackDomain?: string;
    };
};

export interface useAuthInterface {
    (): {
        isAuthenticating: boolean;
        isAuthenticated: () => boolean;
        isAuthorized: (role: string | string[]) => boolean;
        user: AuthUser;
        userId?: string | null;
        authResult?: AuthResult;
        login: () => void;
        signup: () => void;
        logout: () => void;
        handleAuthentication: ({
            postLoginRoute
        }: {
            postLoginRoute?: string;
        }) => void;
        dispatch: (eventName: string, eventData?: any) => void;
    };
}

// Deprecated <AuthProvider> type
export type AuthProviderInterface = (props: {
    children: ReactNode;
    navigate: (path: string) => void;
    auth0_domain: string;
    auth0_audience_domain?: string;
    auth0_client_id: string;
    auth0_params?: Auth0Options;
    customPropertyNamespace?: string;
}) => JSX.Element;

// The shape of auth provider wrappers
export interface AuthProviderClass {
    // addDefaultParams: (
    //     props: Omit<AuthOptions, "dispatch">
    // ) => Omit<AuthOptions, "dispatch">;
    authorize(): void;
    signup(): void;
    logout(returnTo?: string): void;
    handleLoginCallback(
        dispatch: PayloadSender<AnyEventObject>
    ): Promise<boolean>;
    checkSession(): Promise<{
        user: AuthUser;
        authResult: Auth0DecodedHash;
    }>;
    userId(user: AuthUser): string | null | undefined;
    userRoles(user: AuthUser): string[] | null;
}
