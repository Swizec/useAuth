import { Auth0DecodedHash, Auth0UserProfile } from "auth0-js";
import { AuthOptions, AuthProviderClass, AuthUser } from "../types";
export declare class Auth0 implements AuthProviderClass {
    private auth0;
    private dispatch;
    constructor(params: AuthOptions);
    authorize(): void;
    signup(): void;
    logout(returnTo?: string): void;
    userId(user: Auth0UserProfile): string;
    userRoles(user: AuthUser, customPropertyNamespace: string): string[] | null;
    handleLoginCallback(): Promise<boolean>;
    checkSession(): Promise<{
        user: Auth0UserProfile;
        authResult: Auth0DecodedHash;
    }>;
    private handleAuthResult;
    private fetchUser;
}
