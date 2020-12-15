import { Auth0DecodedHash, Auth0UserProfile } from "auth0-js";
import { AuthOptions, AuthProviderClass, AuthUser, ProviderOptions } from "../types";
export declare class Auth0 implements AuthProviderClass {
    private auth0;
    private dispatch;
    private customPropertyNamespace?;
    constructor(params: AuthOptions);
    static addDefaultParams(params: ProviderOptions, callbackDomain: string): {
        domain: string;
        clientID: string;
        responseType: string;
        responseMode?: string | undefined;
        redirectUri: string;
        scope: string;
        audience: string;
        maxAge?: number | undefined;
        leeway?: number | undefined;
        jwksURI?: string | undefined;
        overrides?: {
            __tenant?: string | undefined;
            __token_issuer?: string | undefined;
            __jwks_uri?: string | undefined;
        } | undefined;
        plugins?: any;
        popupOrigin?: string | undefined;
        protocol?: string | undefined;
        response_type?: string | undefined;
        state?: string | undefined;
        tenant?: string | undefined;
        universalLoginPage?: boolean | undefined;
        _csrf?: string | undefined;
        _intstate?: string | undefined;
        _timesToRetryFailedRequests?: number | undefined;
        _disableDeprecationWarnings?: boolean | undefined;
        _sendTelemetry?: boolean | undefined;
        _telemetryInfo?: any;
        __tryLocalStorageFirst?: boolean | undefined;
    };
    authorize(): void;
    signup(): void;
    logout(returnTo?: string): void;
    userId(user: Auth0UserProfile): string;
    userRoles(user: AuthUser): string[] | null;
    handleLoginCallback(): Promise<boolean>;
    checkSession(): Promise<{
        user: Auth0UserProfile;
        authResult: Auth0DecodedHash;
    }>;
    private handleAuthResult;
    private fetchUser;
}
