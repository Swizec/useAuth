import { Auth0UserProfile, Auth0DecodedHash } from "auth0-js";

export type AuthState = {
    user: Auth0UserProfile;
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
    error?: Error;
};
