type AuthState = {
    user: Auth0UserProfile;
    expiresAt: integer | null;
    isAuthenticating: boolean;
    errorType?: string;
    error?: Error;
};

type AuthAction = {
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
