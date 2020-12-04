import {
    AuthOptions,
    AuthProviderClass,
    AuthUser,
    ProviderOptions
} from "../types";
import NetlifyIdentityWidget, { User } from "netlify-identity-widget";

// Wrapper for NetlifyIdentity conforming to auth provider interface
export class NetlifyIdentity implements AuthProviderClass {
    private netlifyIdentity: any;
    private dispatch: (eventName: string, eventData?: any) => void;

    public checkSessionOnLoad = false;

    constructor(params: AuthOptions) {
        this.netlifyIdentity = NetlifyIdentityWidget;

        this.netlifyIdentity.init(params as NetlifyIdentityWidget.InitOptions);
        this.dispatch = params.dispatch;

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
        const vals = params as NetlifyIdentityWidget.InitOptions;
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
        console.warn(
            "checkSession is unnecessary with Netlify Identity Widget"
        );
        return {
            user: {},
            authResult: {}
        };
    }

    // Returns the userId from NetlifyIdentity shape of data
    public userId(user: NetlifyIdentityWidget.User): string {
        return user.id;
    }

    // Returns user roles from NetlifyIdentity shape of data
    public userRoles(user: NetlifyIdentityWidget.User): string[] | null {
        return [user.role] || null;
    }
}
