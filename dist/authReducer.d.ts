import { AuthState } from "./types";
export declare const authMachine: import("xstate").StateMachine<AuthState, any, import("xstate").AnyEventObject, {
    value: any;
    context: AuthState;
}>;
export declare const authService: import("xstate").Interpreter<AuthState, any, import("xstate").AnyEventObject, {
    value: any;
    context: AuthState;
}>;
