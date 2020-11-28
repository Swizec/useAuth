import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { AuthProvider } from "../AuthProvider";
import { authService } from "../authReducer";
import { AuthState } from "../types";

describe("AuthProvider", () => {
    let container: any = null;
    beforeEach(() => {
        container = document.createElement("div");
        document.body.appendChild(container);
    });

    afterEach(() => {
        unmountComponentAtNode(container);
        container.remove();
        container = null;
    });

    it("sets config from props", () => {
        let savedContext: AuthState | {} = {};

        authService.subscribe(state => {
            savedContext = state.context;
        });

        act(() => {
            render(
                <AuthProvider
                    navigate={() => null}
                    auth0_domain="localhost:8000"
                    auth0_client_id="1234"
                    customPropertyNamespace="testhost:8000"
                >
                    <div>Hai</div>
                </AuthProvider>,
                container
            );
        });

        expect((savedContext as AuthState).config.authProvider).not.toBeNull();
        expect((savedContext as AuthState).config.customPropertyNamespace).toBe(
            "testhost:8000"
        );
        expect((savedContext as AuthState).config.callbackDomain).toBe(
            "http://localhost"
        );
    });
});
