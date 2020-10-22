import { AuthState, AuthAction } from "./types";
export declare const authMachine: import("xstate").StateMachine<AuthState, any, import("xstate").AnyEventObject, {
    value: any;
    context: AuthState;
}>;
export declare const authState: import("xstate").Interpreter<AuthState, any, import("xstate").AnyEventObject, {
    value: any;
    context: AuthState;
}>;
export declare const authReducer: (state: AuthState, action: AuthAction) => AuthState;
