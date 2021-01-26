import {
    Auth0DecodedHash,
    Auth0Error,
    Auth0ParseHashError,
    Auth0UserProfile,
    AuthOptions as Auth0Options,
    WebAuth
} from "auth0-js";
import {
    AuthOptions,
    AuthProviderClass,
    AuthUser,
    ProviderOptions
} from "../types";

// Wrapper that provides a common interface for different providers
// Modeled after Auth0 because that was first :)
export class Auth0 implements AuthProviderClass {
    private auth0: WebAuth;
    private dispatch: (eventName: string, eventData?: any) => void;
    private customPropertyNamespace?: string;

    constructor(params: AuthOptions) {
        this.dispatch = params.dispatch;
        this.customPropertyNamespace = params.customPropertyNamespace;

        this.auth0 = new WebAuth({
            ...(params as Auth0Options)
        });
    }

    // Makes configuration easier by guessing default options
    static addDefaultParams(params: ProviderOptions, callbackDomain: string) {
        const vals = params as Auth0Options;

        return {
            redirectUri: `${callbackDomain}/auth0_callback`,
            audience: `https://${vals.domain}/api/v2/`,
            responseType: "token id_token",
            scope: "openid profile email",
            ...vals
        };
    }

    // Opens login dialog
    public authorize() {
        this.auth0.authorize();
    }

    // Opens signup dialog
    public signup() {
        this.auth0.authorize({
            mode: "signUp",
            screen_hint: "signup"
        });
    }

    // Logs user out on the underlying service
    public logout(returnTo?: string) {
        this.auth0.logout({ returnTo });
    }

    // Returns the userId from Auth0 shape of data
    public userId(user: Auth0UserProfile): string | undefined {
        return user.sub;
    }

    // Returns user roles from Auth0 shape of data
    public userRoles(user: AuthUser): string[] | null {
        const metadata =
            user[
                // make this friendlier to use if you leave a trailing slash in config
                `${this.customPropertyNamespace}/user_metadata`.replace(
                    /\/+user_metadata/,
                    "/user_metadata"
                )
            ];

        return metadata?.roles || null;
    }

    // Handles login after redirect back from service
    public async handleLoginCallback(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.auth0.parseHash(
                async (
                    err: Auth0ParseHashError | null,
                    authResult: Auth0DecodedHash | null
                ) => {
                    if (err) {
                        this.dispatch("ERROR", {
                            error: err,
                            errorType: "authResult"
                        });
                        resolve(false);
                    }

                    try {
                        const loggedIn = await this.handleAuthResult(
                            authResult
                        );

                        resolve(loggedIn);
                    } catch (err) {
                        this.dispatch("ERROR", {
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
            this.auth0.checkSession(
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
                            const user = await this.fetchUser(authResult);

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
    private async handleAuthResult(authResult: Auth0DecodedHash | null) {
        if (authResult && authResult.accessToken && authResult.idToken) {
            const user = await this.fetchUser(authResult);

            this.dispatch("AUTHENTICATED", {
                authResult,
                user
            });

            return true;
        } else {
            return false;
        }
    }

    // Fetches current user info
    private async fetchUser(
        authResult: Auth0DecodedHash | null
    ): Promise<Auth0UserProfile> {
        return new Promise((resolve, reject) => {
            this.auth0.client.userInfo(
                authResult?.accessToken || "",
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
