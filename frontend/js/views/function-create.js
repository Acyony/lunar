import { Icons } from "../icons.js";
import { API } from "../api.js";
import { Toast } from "../components/toast.js";
import { FunctionDocs } from "../components/function-docs.js";
import { CodeEditor } from "../components/code-editor.js";

export const FunctionCreate = {
  formData: {
    name: "",
    description: "",
    code: `function handler(ctx, event)
  log.info("Function started")

  return {
    statusCode = 200,
    headers = { ["Content-Type"] = "application/json" },
    body = '{"message": "Hello"}'
  }
end`,
  },
  errors: {},

  oninit: () => {
    FunctionCreate.formData = {
      name: "",
      description: "",
      code: `function handler(ctx, event)
  log.info("Function started")

  return {
    statusCode = 200,
    headers = { ["Content-Type"] = "application/json" },
    body = '{"message": "Hello"}'
  }
end`,
    };
    FunctionCreate.errors = {};
  },

  parseErrorMessage: (message) => {
    // Parse validation error like "name: name cannot be empty"
    const match = message.match(/^(\w+):\s*(.+)$/);
    if (match) {
      return { field: match[1], message: match[2] };
    }
    return null;
  },

  createFunction: async () => {
    FunctionCreate.errors = {};
    try {
      const payload = {
        name: FunctionCreate.formData.name,
        description: FunctionCreate.formData.description,
        code: FunctionCreate.formData.code,
      };

      await API.functions.create(payload);
      m.route.set("/functions");
    } catch (e) {
      const error = FunctionCreate.parseErrorMessage(e.message);
      if (error) {
        FunctionCreate.errors[error.field] = error.message;
        m.redraw();
      } else {
        Toast.show("Failed to create function: " + e.message, "error");
      }
    }
  },

  view: () => {
    return m(".container", [
      m(".page-header", [
        m(".page-title", [
          m("div", [
            m("h1", "Create New Function"),
            m(".page-subtitle", "Define your serverless function"),
          ]),
          m("a.btn", { href: "#!/functions" }, [Icons.arrowLeft(), "  Back"]),
        ]),
      ]),

      m(".layout-with-sidebar", [
        // Main column
        m(".main-column", [
          m(".card.mb-24", [
            m(".card-header", m(".card-title", "Function Details")),
            m("div", { style: "padding: 16px;" }, [
              m(".form-group", [
                m("label.form-label", "Name"),
                m("input.form-input", {
                  class: FunctionCreate.errors.name ? "error" : "",
                  value: FunctionCreate.formData.name,
                  oninput: (e) => {
                    FunctionCreate.formData.name = e.target.value;
                    delete FunctionCreate.errors.name;
                  },
                  placeholder: "my-function",
                }),
                FunctionCreate.errors.name &&
                  m("span.form-error", FunctionCreate.errors.name),
              ]),
              m(".form-group", [
                m("label.form-label", "Description"),
                m("textarea.form-textarea", {
                  class: FunctionCreate.errors.description ? "error" : "",
                  value: FunctionCreate.formData.description,
                  oninput: (e) => {
                    FunctionCreate.formData.description = e.target.value;
                    delete FunctionCreate.errors.description;
                  },
                  placeholder: "What does this function do?",
                  rows: 2,
                }),
                FunctionCreate.errors.description &&
                  m("span.form-error", FunctionCreate.errors.description),
              ]),
            ]),
          ]),

          m(".card.mb-24", [
            m(".card-header", m(".card-title", "Function Code")),
            m("div", { style: "padding: 16px;" }, [
              m(CodeEditor, {
                id: "code-editor",
                value: FunctionCreate.formData.code,
                onChange: (value) => {
                  FunctionCreate.formData.code = value;
                  delete FunctionCreate.errors.code;
                },
              }),
              FunctionCreate.errors.code &&
                m("span.form-error", FunctionCreate.errors.code),
            ]),
          ]),

          m(
            "div",
            {
              style:
                "display: flex; justify-content: flex-end; gap: 12px; margin-bottom: 24px;",
            },
            [
              m("a.btn", { href: "#!/functions" }, "Cancel"),
              m(
                "button.btn.btn-primary",
                {
                  onclick: FunctionCreate.createFunction,
                },
                "Create Function",
              ),
            ],
          ),
        ]),

        // Sidebar
        m(FunctionDocs),
      ]),
    ]);
  },
};
