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

export type FirebaseUser = Firebase.User;

// Auth Wrapper for Auth0
export class FirebaseUI implements AuthProviderClass {
    private ui: FirebaseAuthUI.AuthUI;
    private firebase: Firebase.app.App;
    private signInOptions?: string[];
    private dispatch: (eventName: string, eventData?: any) => void;

    // Initialize the client and save any custom config
    constructor(params: AuthOptions & FirebaseOptions) {
        // You will almost always need access to dispatch
        this.dispatch = params.dispatch;

        this.signInOptions = params.signInOptions;

        if (params.firebaseConfig) {
            this.firebase = Firebase.initializeApp(
                params.firebaseConfig,
                "useAuth"
            );
        } else if (params.firebaseApp) {
            this.firebase = params.firebaseApp;
        } else {
            throw "Please provide firebaseConfig or initialized firebaseApp";
        }

        // Init your client
        this.ui = new FirebaseAuthUI.AuthUI(this.firebase.auth());

        // Auth state observer
        this.firebase
            .auth()
            .onAuthStateChanged(this.onAuthStateChanged.bind(this));
    }

    private onAuthStateChanged(user: Firebase.User | null) {
        if (user) {
            this.dispatch("LOGIN");
            this.dispatch("AUTHENTICATED", {
                user: this.firebase.auth().currentUser,
                authResult: {
                    // needed for useAuth to work
                    expiresIn: 3600
                }
            });
        }
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
                signInSuccessWithAuthResult: (authResult: any) => {
                    this.dispatch("AUTHENTICATED", {
                        user: this.firebase.auth().currentUser,
                        authResult: {
                            ...authResult,
                            // needed for useAuth itself to work
                            expiresIn: 3600
                        }
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
        this.firebase.auth().signOut();
    }

    public userId(user: any): string | undefined {
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
        const user = this.firebase.auth().currentUser;

        if (user) {
            // throws if user no longer valid
            await user.reload();

            return {
                user,
                authResult: {
                    // needed for useAuth to work
                    expiresIn: 3600
                }
            };
        } else {
            throw new Error("Session invalid");
        }
    }
}
