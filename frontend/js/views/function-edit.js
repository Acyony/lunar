import { Icons } from "../icons.js";
import { API } from "../api.js";
import { Toast } from "../components/toast.js";
import { FunctionDocs } from "../components/function-docs.js";
import { CodeEditor } from "../components/code-editor.js";

export const FunctionEdit = {
  func: null,
  loading: true,
  formData: {
    name: "",
    description: "",
    code: "",
  },
  errors: {},

  oninit: (vnode) => {
    FunctionEdit.loadFunction(vnode.attrs.id);
  },

  loadFunction: async (id) => {
    FunctionEdit.loading = true;
    FunctionEdit.errors = {};
    try {
      const func = await API.functions.get(id);
      FunctionEdit.func = func;
      FunctionEdit.formData = {
        name: func.name,
        description: func.description || "",
        code: func.active_version.code,
      };
    } catch (e) {
      console.error("Failed to load function:", e);
    } finally {
      FunctionEdit.loading = false;
      m.redraw();
    }
  },

  parseErrorMessage: (message) => {
    // Parse validation error like "name: name cannot be empty"
    const match = message.match(/^(\w+):\s*(.+)$/);
    if (match) {
      return { field: match[1], message: match[2] };
    }
    return null;
  },

  saveFunction: async () => {
    FunctionEdit.errors = {};
    try {
      await API.functions.update(FunctionEdit.func.id, FunctionEdit.formData);
      m.route.set(`/functions/${FunctionEdit.func.id}`);
    } catch (e) {
      const error = FunctionEdit.parseErrorMessage(e.message);
      if (error) {
        FunctionEdit.errors[error.field] = error.message;
        m.redraw();
      } else {
        Toast.show("Failed to save function: " + e.message, "error");
      }
    }
  },

  view: (vnode) => {
    if (FunctionEdit.loading) {
      return m(".loading", "Loading...");
    }

    if (!FunctionEdit.func) {
      return m(".container", m(".card", "Function not found"));
    }

    return m(".container", [
      m(".page-header", [
        m(".page-title", [
          m("div", [
            m("h1", FunctionEdit.func.name),
            m(".page-subtitle", "Edit function code and details"),
          ]),
          m("a.btn", { href: `#!/functions/${FunctionEdit.func.id}` }, [
            Icons.arrowLeft(),
            "  Back",
          ]),
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
                  class: FunctionEdit.errors.name ? "error" : "",
                  value: FunctionEdit.formData.name,
                  oninput: (e) => {
                    FunctionEdit.formData.name = e.target.value;
                    delete FunctionEdit.errors.name;
                  },
                }),
                FunctionEdit.errors.name &&
                  m("span.form-error", FunctionEdit.errors.name),
              ]),
              m(".form-group", [
                m("label.form-label", "Description"),
                m("textarea.form-textarea", {
                  class: FunctionEdit.errors.description ? "error" : "",
                  value: FunctionEdit.formData.description,
                  oninput: (e) => {
                    FunctionEdit.formData.description = e.target.value;
                    delete FunctionEdit.errors.description;
                  },
                  rows: 2,
                }),
                FunctionEdit.errors.description &&
                  m("span.form-error", FunctionEdit.errors.description),
              ]),
            ]),
          ]),

          m(".card.mb-24", [
            m(".card-header", m(".card-title", "Function Code")),
            m("div", { style: "padding: 16px;" }, [
              m(CodeEditor, {
                id: "code-editor",
                value: FunctionEdit.formData.code,
                onChange: (value) => {
                  FunctionEdit.formData.code = value;
                  delete FunctionEdit.errors.code;
                },
              }),
              FunctionEdit.errors.code &&
                m("span.form-error", FunctionEdit.errors.code),
            ]),
          ]),

          m(
            "div",
            {
              style:
                "display: flex; justify-content: flex-end; gap: 12px; margin-bottom: 24px;",
            },
            [
              m(
                "a.btn",
                { href: `#!/functions/${FunctionEdit.func.id}` },
                "Cancel",
              ),
              m(
                "button.btn.btn-primary",
                {
                  onclick: FunctionEdit.saveFunction,
                },
                "Save Changes",
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
