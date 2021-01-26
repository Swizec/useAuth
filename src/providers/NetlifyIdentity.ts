import { AuthOptions, AuthProviderClass, ProviderOptions } from "../types";
import NetlifyWidget, { User, InitOptions } from "netlify-identity-widget";

// Wrapper for NetlifyIdentity conforming to auth provider interface
export class NetlifyIdentity implements AuthProviderClass {
    private netlifyIdentity: any;
    private dispatch: (eventName: string, eventData?: any) => void;

    constructor(params: AuthOptions) {
        this.dispatch = params.dispatch;

        this.netlifyIdentity = NetlifyWidget;

        this.netlifyIdentity.init(params as InitOptions);

        this.netlifyIdentity.on("error", (error: Error) => {
            this.dispatch("ERROR", {
                error,
                errorType: "netlifyError"
            });
        });
        this.netlifyIdentity.on("login", (user: User) => {
            this.dispatch("AUTHENTICATED", {
                user,
                authResult: {
                    expiresIn: user.token?.expires_in
                }
            });
        });
        this.netlifyIdentity.on("init", (user: User) => {
            if (user) {
                this.dispatch("LOGIN");
                this.dispatch("AUTHENTICATED", {
                    user,
                    authResult: {
                        expiresIn: user.token?.expires_in
                    }
                });
            }
        });
    }

    static addDefaultParams(
        params: ProviderOptions = {},
        callbackDomain: string
    ) {
        const vals = params as InitOptions;
        return vals;
    }

    // Opens login dialog
    public authorize() {
        this.dispatch("LOGIN");
        this.netlifyIdentity.open("login");
    }

    // Opens signup dialog
    public signup() {
        this.dispatch("LOGIN");
        this.netlifyIdentity.open("signup");
    }

    // Logs user out on the underlying service
    public logout(returnTo?: string) {
        this.netlifyIdentity.logout();
    }

    // Handles login after redirect back from service
    public async handleLoginCallback(dispatch: any): Promise<boolean> {
        console.warn(
            "handleLoginCallback is unnecessary with Netlify Identity Widget"
        );
        return true;
    }

    // verifies session is still valid
    // returns fresh user info
    public async checkSession(): Promise<{
        user: any;
        authResult: any;
    }> {
        try {
            await this.netlifyIdentity.refresh();
        } catch (e) {
            throw new Error("Session invalid");
        }

        const user = this.netlifyIdentity.currentUser();

        if (user) {
            return {
                user,
                authResult: {
                    expiresIn: user.token?.expires_in
                }
            };
        } else {
            throw new Error("Session invalid");
        }
    }

    // Returns the userId from NetlifyIdentity shape of data
    public userId(user: User): string | undefined {
        return user.id;
    }

    // Returns user roles from NetlifyIdentity shape of data
    public userRoles(user: User): string[] | null {
        return user.app_metadata.roles;
    }
}
