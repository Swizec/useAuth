import { Auth0UserProfile, Auth0DecodedHash, Auth0Error, AuthOptions, Auth0ParseHashError } from "auth0-js";
import { ReactNode } from "react";
import { AnyEventObject, PayloadSender } from "xstate";
export declare type AuthState = {
    user: (Auth0UserProfile & {
        [key: string]: any;
    }) | {
        sub?: string;
        [key: string]: any;
    };
    authResult?: Auth0DecodedHash | null;
    expiresAt: Date | null;
    isAuthenticating: boolean;
    errorType?: string;
    error?: Error | Auth0Error | Auth0ParseHashError;
    config: {
        navigate: Function;
        customPropertyNamespace: string;
        authProvider?: AuthProviderClass;
        callbackDomain: string;
    };
};
export interface useAuthInterface {
    (): {
        isAuthenticating: boolean;
        isAuthenticated: () => boolean;
        isAuthorized: (role: string | string[]) => boolean;
        user: Auth0UserProfile | {
            sub?: string;
        };
        userId: string | null | undefined;
        authResult: Auth0DecodedHash | undefined | null;
        login: () => void;
        signup: () => void;
        logout: () => void;
        handleAuthentication: ({ postLoginRoute }: {
            postLoginRoute?: string;
        }) => void;
        dispatch: (eventName: string, eventData?: any) => void;
    };
}
export declare type AuthProviderInterface = (props: {
    children: ReactNode;
    navigate: (path: string) => void;
    auth0_domain: string;
    auth0_audience_domain?: string;
    auth0_client_id: string;
    auth0_params?: AuthOptions;
    customPropertyNamespace?: string;
}) => JSX.Element;
export interface AuthProviderClass {
    authorize(): void;
    signup(): void;
    logout(returnTo?: string): void;
    handleLoginCallback(dispatch: PayloadSender<AnyEventObject>): Promise<boolean>;
    checkSession(): Promise<{
        user: Auth0UserProfile;
        authResult: Auth0DecodedHash;
    }>;
}
