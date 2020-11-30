import Auth0Client, {
    Auth0DecodedHash,
    Auth0Error,
    Auth0ParseHashError,
    Auth0UserProfile,
    AuthOptions
} from "auth0-js";
import { AuthProviderClass } from "../types";

// Wrapper that provides a common interface for different providers
// Modeled after Auth0 because that was first :)
export class Auth0 implements AuthProviderClass {
    private auth0: Auth0Client.WebAuth | null;

    constructor(params: AuthOptions) {
        this.auth0 = new Auth0Client.WebAuth({
            ...params
        });
    }

    // Opens login dialog
    public authorize() {
        this.auth0?.authorize();
    }

    // Opens signup dialog
    public signup() {
        this.auth0?.authorize({
            mode: "signUp",
            screen_hint: "signup"
        });
    }

    // Logs user out on the underlying service
    public logout(returnTo?: string) {
        this.auth0?.logout({ returnTo });
    }

    // Handles login after redirect back from service
    public async handleLoginCallback(dispatch: any): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.auth0?.parseHash(
                async (
                    err: Auth0ParseHashError | null,
                    authResult: Auth0DecodedHash | null
                ) => {
                    if (err) {
                        dispatch("ERROR", {
                            error: err,
                            errorType: "authResult"
                        });
                        resolve(false);
                    }

                    try {
                        const loggedIn = await this.handleAuthResult({
                            authResult,
                            dispatch
                        });

                        resolve(loggedIn);
                    } catch (err) {
                        dispatch("ERROR", {
                            error: err,
                            errorType: "handleAuth"
                        });
                        resolve(false);
                    }
                }
            );
        });
    }

    // verifies session is still valid
    // returns fresh user info
    public async checkSession(): Promise<{
        user: Auth0UserProfile;
        authResult: Auth0DecodedHash;
    }> {
        return new Promise((resolve, reject) => {
            this.auth0?.checkSession(
                {},
                async (err: any, authResult: Auth0DecodedHash) => {
                    if (
                        !err &&
                        authResult &&
                        authResult.accessToken &&
                        authResult.idToken
                    ) {
                        // fetch user data
                        try {
                            const user = await this.fetchUser({
                                authResult
                            });

                            resolve({
                                user,
                                authResult
                            });
                        } catch (e) {
                            reject(e);
                        }
                    } else {
                        reject(err || new Error("Session invalid"));
                    }
                }
            );
        });
    }

    // Parses auth result and dispatches the AUTHENTICATED event
    private async handleAuthResult(args: {
        dispatch: any;
        authResult: Auth0DecodedHash | null;
    }) {
        const { dispatch, authResult } = args;

        if (authResult && authResult.accessToken && authResult.idToken) {
            const user = await this.fetchUser({
                authResult
            });

            dispatch("AUTHENTICATED", {
                authResult,
                user
            });

            return true;
        } else {
            return false;
        }
    }

    // Fetches current user info
    private async fetchUser(args: {
        authResult: Auth0DecodedHash | null;
    }): Promise<Auth0UserProfile> {
        return new Promise((resolve, reject) => {
            this.auth0?.client.userInfo(
                args.authResult?.accessToken || "",
                (err: Auth0Error | null, user: Auth0UserProfile) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(user);
                    }
                }
            );
        });
    }
}
