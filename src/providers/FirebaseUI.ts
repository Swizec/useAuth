import { Auth0DecodedHash } from "auth0-js";
import {
    AuthOptions,
    AuthProviderClass,
    AuthUser,
    ProviderOptions
} from "src/types";
import { auth as FirebaseAuthUI } from "firebaseui";
import firebase from "firebase";

// Auth Wrapper for Auth0
export class FirebaseUI implements AuthProviderClass {
    private ui: any;
    private dispatch: (eventName: string, eventData?: any) => void;
    // Auth0 specific, used for roles
    private customPropertyNamespace?: string;
    // Initialize the client and save any custom config
    constructor(params: AuthOptions) {
        // You will almost always need access to dispatch
        this.dispatch = params.dispatch;

        // Init your client
        this.ui = new FirebaseAuthUI.AuthUI(firebase.auth());
    }

    // Makes configuration easier by guessing default options
    static addDefaultParams(params: ProviderOptions, callbackDomain: string) {
        // const vals = params as Auth0Options;
        return {
            signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID]
        };
    }

    public authorize() {
        // Open login dialog
        this.ui.start("#firebaseui-auth-container", {
            signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID]
        });
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
