var t = require("firebaseui");
function e(t) {
    return t && "object" == typeof t && "default" in t ? t : { default: t };
}
var r = e(require("firebase"));
exports.FirebaseUI = (function() {
    function e(e) {
        (this.dispatch = e.dispatch),
            (this.ui = new t.auth.AuthUI(r.default.auth()));
    }
    e.addDefaultParams = function(t, e) {
        return {
            signInOptions: [r.default.auth.EmailAuthProvider.PROVIDER_ID]
        };
    };
    var u = e.prototype;
    return (
        (u.authorize = function() {
            this.ui.start("#firebaseui-auth-container", {
                signInOptions: [r.default.auth.EmailAuthProvider.PROVIDER_ID]
            });
        }),
        (u.signup = function() {}),
        (u.logout = function(t) {}),
        (u.userId = function(t) {
            return "";
        }),
        (u.userRoles = function(t) {
            return [];
        }),
        (u.handleLoginCallback = function() {
            return Promise.resolve(!1);
        }),
        (u.checkSession = function() {
            try {
                return Promise.resolve({ user: {}, authResult: {} });
            } catch (t) {
                return Promise.reject(t);
            }
        }),
        e
    );
})();
//# sourceMappingURL=FirebaseUI.js.map
