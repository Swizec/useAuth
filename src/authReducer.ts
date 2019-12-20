import { AuthState, AuthAction } from "./types";

export const authReducer = (
    state: AuthState,
    action: AuthAction
): AuthState => {
    switch (action.type) {
        case "login":
            const { authResult, user } = action;
            const expiresAt =
                authResult.expiresIn! * 1000 + new Date().getTime();

            if (typeof localStorage !== "undefined") {
                localStorage.setItem(
                    "useAuth:expires_at",
                    JSON.stringify(expiresAt)
                );
                localStorage.setItem("useAuth:user", JSON.stringify(user));
            }

            return {
                ...state,
                user,
                expiresAt,
                authResult
            };
        case "logout":
            if (typeof localStorage !== "undefined") {
                localStorage.removeItem("useAuth:expires_at");
                localStorage.removeItem("useAuth:user");
            }

            return {
                ...state,
                user: {},
                expiresAt: null,
                authResult: null
            };
        case "stopAuthenticating":
            return {
                ...state,
                isAuthenticating: false
            };
        case "startAuthenticating":
            return {
                ...state,
                isAuthenticating: true
            };
        case "error":
            const { errorType, error } = action;
            return {
                ...state,
                user: {},
                expiresAt: null,
                isAuthenticating: false,
                authResult: null,
                errorType,
                error
            };
        default:
            return state;
    }
};
