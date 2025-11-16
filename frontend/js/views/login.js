import { API } from "../api.js";

export const Login = {
  apiKey: "",
  error: "",
  loading: false,

  handleSubmit: async (e) => {
    e.preventDefault();
    Login.error = "";
    Login.loading = true;

    try {
      await API.auth.login(Login.apiKey);
      // On success, redirect to functions list
      m.route.set("/functions");
    } catch (err) {
      // Handle different error formats
      if (err.error) {
        Login.error = err.error;
      } else if (err.message) {
        Login.error = err.message;
      } else if (typeof err === "string") {
        Login.error = err;
      } else {
        Login.error = "Invalid API key";
      }
    } finally {
      Login.loading = false;
      m.redraw();
    }
  },

  view: () => {
    return m(".login-container", [
      m(".login-card", [
        m(".login-header", [
          m("h1", "FaaS-Go"),
          m("p", "Enter your API key to continue"),
        ]),

        m(
          "form",
          {
            onsubmit: Login.handleSubmit,
          },
          [
            m(".form-group", [
              m("label", { for: "api-key" }, "API Key"),
              m("input#api-key.form-input", {
                type: "password",
                placeholder: "Enter your API key",
                value: Login.apiKey,
                oninput: (e) => {
                  Login.apiKey = e.target.value;
                },
                required: true,
                disabled: Login.loading,
              }),
            ]),

            Login.error &&
              m(".alert.alert-error", [m("strong", "Error: "), Login.error]),

            m(
              "button.btn.btn-primary.btn-block",
              {
                type: "submit",
                disabled: Login.loading || !Login.apiKey,
              },
              Login.loading ? "Logging in..." : "Login",
            ),
          ],
        ),

        m(".login-footer", [
          m(
            "p.text-muted",
            "Check the server logs for your API key if this is the first run.",
          ),
        ]),
      ]),
    ]);
  },
};
