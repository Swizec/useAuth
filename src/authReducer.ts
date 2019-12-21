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
                authResult,
                errorType: undefined,
                error: undefined
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
                authResult: null,
                errorType: undefined,
                error: undefined
            };
        case "stopAuthenticating":
            return {
                ...state,
                isAuthenticating: false
            };
        case "startAuthenticating":
            return {
                ...state,
                isAuthenticating: true,
                errorType: undefined,
                error: undefined
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
