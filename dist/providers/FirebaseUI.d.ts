import { Auth0DecodedHash } from "auth0-js";
import { AuthOptions, AuthProviderClass, AuthUser, ProviderOptions } from "src/types";
import "firebase/auth";
export declare type FirebaseOptions = {
    signInOptions?: string[];
};
export declare class FirebaseUI implements AuthProviderClass {
    private ui;
    private firebase;
    private signInOptions?;
    private dispatch;
    private customPropertyNamespace?;
    constructor(params: AuthOptions & FirebaseOptions);
    private onAuthStateChanged;
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
