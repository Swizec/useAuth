export const authReducer = (state, action) => {
    console.log('got me some local', localStorage)
    switch (action.type) {
        case "login":
            const {
                authResult, user
            } = action;
            const expiresAt =
                authResult.expiresIn * 1000 + new Date().getTime();

            if (typeof localStorage !== "undefined") {
                localStorage.setItem("access_token", authResult.accessToken);
                localStorage.setItem("id_token", authResult.idToken);
                localStorage.setItem("expires_at", JSON.stringify(expiresAt));
                localStorage.setItem("user", JSON.stringify(user));
            }

            return {
                user,
                expiresAt
            };
        case "logout":
            if (typeof localStorage !== "undefined") {
                localStorage.removeItem("access_token");
                localStorage.removeItem("id_token");
                localStorage.removeItem("expires_at");
                localStorage.removeItem("user");
            }

            return {
                user: {},
                    expiresAt: null
            };
        default:
            return state;
    }
};