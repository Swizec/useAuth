import { AuthOptions, AuthProviderClass } from "../types";
import NetlifyWidget, { User } from "netlify-identity-widget";
export declare class NetlifyIdentity implements AuthProviderClass {
    private netlifyIdentity;
    private dispatch;
    constructor(params: AuthOptions);
    static addDefaultParams(params: import("auth0-js").AuthOptions | NetlifyWidget.InitOptions | import("./FirebaseUI").FirebaseOptions | undefined, callbackDomain: string): NetlifyWidget.InitOptions;
    authorize(): void;
    signup(): void;
    logout(returnTo?: string): void;
    handleLoginCallback(dispatch: any): Promise<boolean>;
    checkSession(): Promise<{
        user: any;
        authResult: any;
    }>;
    userId(user: User): string | undefined;
    userRoles(user: User): string[] | null;
}
