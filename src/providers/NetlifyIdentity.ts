import { AuthProviderClass } from "../types";
import NetlifyIdentityWidget from "netlify-identity-widget";

// Wrapper for NetlifyIdentity conforming to auth provider interface
export class NetlifyIdentity implements AuthProviderClass {
    private netlifyIdentity: any;

    constructor(params: NetlifyIdentityWidget.InitOptions) {
        this.netlifyIdentity = NetlifyIdentityWidget;
        this.netlifyIdentity.init(params as NetlifyIdentityWidget.InitOptions);
    }

    // Opens login dialog
    public authorize() {
        this.netlifyIdentity.open("login");
    }

    // Opens signup dialog
    public signup() {
        this.netlifyIdentity.open("signup");
    }

    // Logs user out on the underlying service
    public logout(returnTo?: string) {
        this.netlifyIdentity.logout();
    }

    // Handles login after redirect back from service
    public async handleLoginCallback(dispatch: any): Promise<boolean> {
        return true;
        // return new Promise((resolve, reject) => {
        //     this.auth0?.parseHash(
        //         async (
        //             err: Auth0ParseHashError | null,
        //             authResult: Auth0DecodedHash | null
        //         ) => {
        //             if (err) {
        //                 dispatch("ERROR", {
        //                     error: err,
        //                     errorType: "authResult"
        //                 });
        //                 resolve(false);
        //             }
        //             try {
        //                 const loggedIn = await this.handleAuthResult({
        //                     authResult,
        //                     dispatch
        //                 });
        //                 resolve(loggedIn);
        //             } catch (err) {
        //                 dispatch("ERROR", {
        //                     error: err,
        //                     errorType: "handleAuth"
        //                 });
        //                 resolve(false);
        //             }
        //         }
        //     );
        // });
    }

    // verifies session is still valid
    // returns fresh user info
    public async checkSession(): Promise<{
        user: any;
        authResult: any;
    }> {
        await this.netlifyIdentity.refresh();

        return { user: {}, authResult: {} };
        // return new Promise((resolve, reject) => {
        //     this.auth0?.checkSession(
        //         {},
        //         async (err: any, authResult: Auth0DecodedHash) => {
        //             if (
        //                 !err &&
        //                 authResult &&
        //                 authResult.accessToken &&
        //                 authResult.idToken
        //             ) {
        //                 // fetch user data
        //                 try {
        //                     const user = await this.fetchUser({
        //                         authResult
        //                     });
        //                     resolve({
        //                         user,
        //                         authResult
        //                     });
        //                 } catch (e) {
        //                     reject(e);
        //                 }
        //             } else {
        //                 reject(err || new Error("Session invalid"));
        //             }
        //         }
        //     );
        // });
    }

    // // Parses auth result and dispatches the AUTHENTICATED event
    // private async handleAuthResult(args: {
    //     dispatch: any;
    //     authResult: Auth0DecodedHash | null;
    // }) {
    //     const { dispatch, authResult } = args;

    //     if (authResult && authResult.accessToken && authResult.idToken) {
    //         const user = await this.fetchUser({
    //             authResult
    //         });

    //         dispatch("AUTHENTICATED", {
    //             authResult,
    //             user
    //         });

    //         return true;
    //     } else {
    //         return false;
    //     }
    // }

    // // Fetches current user info
    // private async fetchUser(args: {
    //     authResult: Auth0DecodedHash | null;
    // }): Promise<Auth0UserProfile> {
    //     return new Promise((resolve, reject) => {
    //         this.auth0?.client.userInfo(
    //             args.authResult?.accessToken || "",
    //             (err: Auth0Error | null, user: Auth0UserProfile) => {
    //                 if (err) {
    //                     reject(err);
    //                 } else {
    //                     resolve(user);
    //                 }
    //             }
    //         );
    //     });
    // }
}
