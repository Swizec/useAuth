import { Auth0DecodedHash, Auth0UserProfile } from "auth0-js";
import { AuthOptions, AuthProviderClass } from "../types";
export declare class Auth0 implements AuthProviderClass {
    private auth0;
    private dispatch;
    constructor(params: AuthOptions);
    authorize(): void;
    signup(): void;
    logout(returnTo?: string): void;
    handleLoginCallback(): Promise<boolean>;
    checkSession(): Promise<{
        user: Auth0UserProfile;
        authResult: Auth0DecodedHash;
    }>;
    private handleAuthResult;
    private fetchUser;
}
