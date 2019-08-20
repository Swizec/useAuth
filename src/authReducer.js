export const authReducer = (state, action) => {
    switch (action.type) {
        case "login":
            const { authResult, user } = action;
            const expiresAt =
                authResult.expiresIn * 1000 + new Date().getTime();

            if (typeof localStorage !== "undefined") {
                localStorage.setItem("expires_at", JSON.stringify(expiresAt));
                localStorage.setItem("user", JSON.stringify(user));
            }

            return {
                ...state,
                user,
                expiresAt,
                authResult
            };
        case "logout":
            if (typeof localStorage !== "undefined") {
                localStorage.removeItem("expires_at");
                localStorage.removeItem("user");
            }

            return {
                ...state,
                user: {},
                expiresAt: null,
                authResult: null
            };
        case "error":
            const { errorType, error } = action;
            return {
                ...state,
                user: {},
                expiresAt: null,
                authResult: null,
                errorType,
                error
            };
        default:
            return state;
    }
};
