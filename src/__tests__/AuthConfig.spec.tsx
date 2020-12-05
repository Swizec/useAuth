import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { Providers } from "../index";
import { AuthConfig } from "../AuthConfig";
import { authService } from "../authReducer";
import { AuthState } from "../types";

describe("AuthConfig", () => {
    let container: any = null;
    const navigate = () => null;

    beforeEach(() => {
        container = document.createElement("div");
        document.body.appendChild(container);
    });

    afterEach(() => {
        unmountComponentAtNode(container);
        container.remove();
        container = null;
    });

    it("renders without children", () => {
        act(() => {
            render(
                <AuthConfig
                    navigate={navigate}
                    authProvider={Providers.NetlifyIdentity}
                />,
                container
            );
        });
    });

    it("renders with children", () => {
        act(() => {
            render(
                <AuthConfig
                    navigate={navigate}
                    authProvider={Providers.NetlifyIdentity}
                >
                    <p>hai there</p>
                </AuthConfig>,
                container
            );
        });
        expect(container.textContent).toBe("hai there");
    });

    it("sets config from props", () => {
        let savedContext: AuthState | {} = {};

        authService.subscribe(state => {
            savedContext = state.context;
        });

        act(() => {
            render(
                <AuthConfig
                    navigate={navigate}
                    authProvider={Providers.NetlifyIdentity}
                />,
                container
            );
        });

        expect((savedContext as AuthState).config.authProvider).toBeInstanceOf(
            Providers.NetlifyIdentity
        );
        expect((savedContext as AuthState).config.callbackDomain).toBe(
            "http://localhost"
        );
    });
});
