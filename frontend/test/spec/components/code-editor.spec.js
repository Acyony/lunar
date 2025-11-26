/**
 * @fileoverview Tests for CodeEditor component - focused on critical functionality.
 * Note: Monaco editor integration tests are limited since Monaco requires a DOM.
 */

import { CodeEditor } from "../../../js/components/code-editor.js";

describe("CodeEditor", () => {
  it("renders div with correct id", () => {
    const vnode = { attrs: { id: "my-editor" }, state: {} };
    const result = CodeEditor.view(vnode);

    expect(result.tag).toBe("div");
    expect(result.attrs.id).toBe("my-editor");
  });

  it("uses default id when not specified", () => {
    const vnode = { attrs: {}, state: {} };
    const result = CodeEditor.view(vnode);

    expect(result.attrs.id).toBe("code-editor");
  });

  it("applies height style", () => {
    const vnode = { attrs: { height: "800px" }, state: {} };
    const result = CodeEditor.view(vnode);

    expect(result.attrs.style).toContain("height: 800px");
  });

  it("uses default height when not specified", () => {
    const vnode = { attrs: {}, state: {} };
    const result = CodeEditor.view(vnode);

    expect(result.attrs.style).toContain("height: 500px");
  });

  it("has oncreate lifecycle hook for Monaco initialization", () => {
    const vnode = { attrs: {}, state: {} };
    const result = CodeEditor.view(vnode);

    expect(typeof result.attrs.oncreate).toBe("function");
  });

  it("has onupdate lifecycle hook for value sync", () => {
    const vnode = { attrs: {}, state: {} };
    const result = CodeEditor.view(vnode);

    expect(typeof result.attrs.onupdate).toBe("function");
  });

  it("has onremove lifecycle hook for cleanup", () => {
    const vnode = { attrs: {}, state: {} };
    const result = CodeEditor.view(vnode);

    expect(typeof result.attrs.onremove).toBe("function");
  });
});
