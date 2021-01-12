import { Auth0DecodedHash } from "auth0-js";
import {
    AuthOptions,
    AuthProviderClass,
    AuthUser,
    ProviderOptions
} from "src/types";

// Auth Wrapper for Auth0
export class FirebaseUI implements AuthProviderClass {
    private client: any;
    private dispatch: (eventName: string, eventData?: any) => void;
    // Auth0 specific, used for roles
    private customPropertyNamespace?: string;
    // Initialize the client and save any custom config
    constructor(params: AuthOptions) {
        // You will almost always need access to dispatch
        this.dispatch = params.dispatch;
        // Auth0 specific, used for roles
        this.customPropertyNamespace = params.customPropertyNamespace;
        // Init your client
        // this.auth0 = new Auth0Client.WebAuth({
        //     ...(params as Auth0Options)
        // });
    }
    // Makes configuration easier by guessing default options
    static addDefaultParams(params: ProviderOptions, callbackDomain: string) {
        // const vals = params as Auth0Options;
        return {
            // redirectUri: `${callbackDomain}/auth0_callback`,
            // audience: `https://${vals.domain}/api/v2/`,
            // responseType: "token id_token",
            // scope: "openid profile email",
            // ...vals
        };
    }
    public authorize() {
        // Open login dialog
    }
    public signup() {
        // Open signup dialog
    }
    public logout(returnTo?: string) {
        // Logs user out of the underlying service
    }
    public userId(user: any): string {
        // Return the userId from Auth0 shape of data
        return "";
    }
    public userRoles(user: AuthUser): string[] | null {
        // Return user roles from Auth0 shape of data
        return [];
    }
    public async handleLoginCallback(): Promise<boolean> {
        // Handle login data after redirect back from service
        // Dispatch ERROR on error
        // Dispatch AUTHENTICATED on success
        // include the user object and authResult with at least an expiresIn value
        return false;
    }
    public async checkSession(): Promise<{
        user: AuthUser;
        authResult: any;
    }> {
        // verify session is still valid
        // return fresh user info
        return {
            user: {},
            authResult: null
        };
    }
}
