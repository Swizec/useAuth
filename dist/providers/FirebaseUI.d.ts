import { Auth0DecodedHash } from "auth0-js";
import { AuthOptions, AuthProviderClass, AuthUser, ProviderOptions } from "src/types";
import Firebase from "firebase/app";
import "firebase/auth";
export declare type FirebaseOptions = {
    signInOptions?: string[];
    firebaseConfig?: {
        apiKey: string;
        authDomain: string;
        projectId: string;
        storageBucket: string;
        messagingSenderId: string;
        appId: string;
    };
    firebaseApp?: Firebase.app.App;
};
export declare type FirebaseUser = Firebase.User;
export declare class FirebaseUI implements AuthProviderClass {
    private ui;
    private firebase;
    private signInOptions?;
    private dispatch;
    constructor(params: AuthOptions & FirebaseOptions);
    private onAuthStateChanged;
    static addDefaultParams(params: ProviderOptions, callbackDomain: string): {
        signInOptions: string[];
        firebaseConfig?: {
            apiKey: string;
            authDomain: string;
            projectId: string;
            storageBucket: string;
            messagingSenderId: string;
            appId: string;
        } | undefined;
        firebaseApp?: Firebase.app.App | undefined;
    };
    authorize(): void;
    signup(): void;
    logout(returnTo?: string): void;
    userId(user: any): string | undefined;
    userRoles(user: AuthUser): string[] | null;
    handleLoginCallback(): Promise<boolean>;
    checkSession(): Promise<{
        user: AuthUser;
        authResult: Auth0DecodedHash;
    }>;
}
