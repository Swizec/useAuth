import { Auth0DecodedHash, Auth0UserProfile, AuthOptions } from "auth0-js";
import { AuthProviderClass } from "../types";
export declare class Auth0 implements AuthProviderClass {
    private auth0;
    constructor(params: AuthOptions);
    authorize(): void;
    signup(): void;
    logout(args: {
        returnTo?: string;
    }): void;
    handleLoginCallback(args: {
        dispatch: any;
    }): Promise<boolean>;
    checkSession(): Promise<{
        user: Auth0UserProfile;
        authResult: Auth0DecodedHash;
    }>;
    private handleAuthResult;
    private fetchUser;
}
