import { Auth0DecodedHash, Auth0UserProfile } from "auth0-js";
import {
    AuthOptions,
    AuthProviderClass,
    AuthUser,
    ProviderOptions
} from "src/types";
import { auth as FirebaseAuthUI } from "firebaseui";
import Firebase from "firebase/app";
import "firebase/auth";

export type FirebaseOptions = {
    signInOptions?: string[];
};

// Auth Wrapper for Auth0
export class FirebaseUI implements AuthProviderClass {
    private ui: any;
    private firebase: any;
    private signInOptions?: string[];
    private dispatch: (eventName: string, eventData?: any) => void;
    // Auth0 specific, used for roles
    private customPropertyNamespace?: string;

    // Initialize the client and save any custom config
    constructor(params: AuthOptions & FirebaseOptions) {
        // You will almost always need access to dispatch
        this.dispatch = params.dispatch;

        this.signInOptions = params.signInOptions;
        this.firebase = Firebase.initializeApp(
            {
                apiKey: "AIzaSyCdtQ6V3qDxpgDO-usa3zWvBhIJKpAd4mM",
                authDomain: "useauth-demo.firebaseapp.com",
                projectId: "useauth-demo",
                storageBucket: "useauth-demo.appspot.com",
                messagingSenderId: "520315046120",
                appId: "1:520315046120:web:4384141e88f49e638c215d"
            },
            "useAuth"
        );

        // Init your client
        this.ui = new FirebaseAuthUI.AuthUI(this.firebase.auth());

        // Auth state observer
        this.firebase.auth().onAuthStateChanged(this.onAuthStateChanged);
    }

    private onAuthStateChanged(user: Firebase.User) {
        console.log("HAI", user);
    }

    // Makes configuration easier by guessing default options
    static addDefaultParams(params: ProviderOptions, callbackDomain: string) {
        const vals = params as FirebaseOptions;
        return {
            signInOptions: [Firebase.auth.EmailAuthProvider.PROVIDER_ID],
            ...vals
        };
    }

    public authorize() {
        // Open login dialog
        this.dispatch("LOGIN");

        this.ui.start("#firebaseui-auth-container", {
            signInOptions: this.signInOptions,
            signInFlow: "popup",
            callbacks: {
                signInSuccessWithAuthResult: (
                    authResult: any,
                    redirectUrl: string
                ) => {
                    console.log({ authResult, redirectUrl });

                    this.dispatch("AUTHENTICATED", {
                        user: this.firebase.auth().currentUser,
                        authResult
                    });

                    return false;
                }
            }
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
        return this.firebase.auth().currentUser?.uid;
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
        authResult: Auth0DecodedHash;
    }> {
        // verify session is still valid
        // return fresh user info
        return {
            user: {},
            authResult: {}
        };
    }
}
