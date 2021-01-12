import { Auth0DecodedHash } from "auth0-js";
import { AuthOptions, AuthProviderClass, AuthUser, ProviderOptions } from "src/types";
export declare class FirebaseUI implements AuthProviderClass {
    private ui;
    private dispatch;
    private customPropertyNamespace?;
    constructor(params: AuthOptions);
    static addDefaultParams(params: ProviderOptions, callbackDomain: string): {
        signInOptions: string[];
    };
    authorize(): void;
    signup(): void;
    logout(returnTo?: string): void;
    userId(user: any): string;
    userRoles(user: AuthUser): string[] | null;
    handleLoginCallback(): Promise<boolean>;
    checkSession(): Promise<{
        user: AuthUser;
        authResult: Auth0DecodedHash;
    }>;
}
