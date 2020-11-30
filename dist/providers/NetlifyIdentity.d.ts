import { AuthOptions, AuthProviderClass } from "../types";
export declare class NetlifyIdentity implements AuthProviderClass {
    private netlifyIdentity;
    private dispatch;
    constructor(params: AuthOptions);
    authorize(): void;
    signup(): void;
    logout(returnTo?: string): void;
    handleLoginCallback(dispatch: any): Promise<boolean>;
    checkSession(): Promise<{
        user: any;
        authResult: any;
    }>;
}
