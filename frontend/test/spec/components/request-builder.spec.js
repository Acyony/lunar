/**
 * @fileoverview Tests for RequestBuilder component - focused on critical functionality.
 */

import {
  generateCodeExamples,
  RequestBuilder,
} from "../../../js/components/request-builder.js";

/**
 * Deep search for a node matching predicate
 */
function findNode(node, predicate) {
  if (!node) return null;
  if (typeof node !== "object") return null;
  if (Array.isArray(node)) {
    for (const child of node) {
      const found = findNode(child, predicate);
      if (found) return found;
    }
    return null;
  }
  if (predicate(node)) return node;
  if (node.children) return findNode(node.children, predicate);
  return null;
}

describe("RequestBuilder", () => {
  it("calls onMethodChange when method selector changes", () => {
    const onMethodChange = jasmine.createSpy("onMethodChange");
    const vnode = {
      attrs: { url: "http://test.com", onMethodChange },
      children: [],
    };
    const result = RequestBuilder.view(vnode);

    // Find the FormSelect component
    const select = findNode(result, (n) => {
      if (!n || typeof n !== "object") return false;
      return n.tag && n.tag.view && n.attrs && n.attrs.options;
    });

    expect(select).toBeTruthy();
    // Simulate change event
    select.attrs.onchange({ target: { value: "POST" } });
    expect(onMethodChange).toHaveBeenCalledWith("POST");
  });

  it("calls onQueryChange when query input changes", () => {
    const onQueryChange = jasmine.createSpy("onQueryChange");
    const vnode = {
      attrs: { url: "http://test.com", onQueryChange },
      children: [],
    };
    const result = RequestBuilder.view(vnode);

    // Find FormInput with query placeholder
    const input = findNode(result, (n) => {
      if (!n || typeof n !== "object") return false;
      return n.attrs && n.attrs.placeholder === "key=value&other=value";
    });

    expect(input).toBeTruthy();
    input.attrs.oninput({ target: { value: "foo=bar" } });
    expect(onQueryChange).toHaveBeenCalledWith("foo=bar");
  });

  it("calls onExecute when execute button is clicked", () => {
    const onExecute = jasmine.createSpy("onExecute");
    const vnode = {
      attrs: { url: "http://test.com", onExecute },
      children: [],
    };
    const result = RequestBuilder.view(vnode);

    // Find the Button component with onclick
    const button = findNode(result, (n) => {
      if (!n || typeof n !== "object") return false;
      return n.tag && n.tag.view && n.attrs && n.attrs.onclick === onExecute;
    });

    expect(button).toBeTruthy();
    button.attrs.onclick();
    expect(onExecute).toHaveBeenCalled();
  });

  it("disables execute button when loading", () => {
    const vnode = {
      attrs: { url: "http://test.com", loading: true },
      children: [],
    };
    const result = RequestBuilder.view(vnode);

    // Find the Button component
    const button = findNode(result, (n) => {
      if (!n || typeof n !== "object") return false;
      return n.tag && n.tag.view && n.attrs && n.attrs.disabled === true;
    });

    expect(button).toBeTruthy();
    expect(button.attrs.loading).toBe(true);
  });
});

describe("generateCodeExamples", () => {
  it("generates correct URL with query params", () => {
    const examples = generateCodeExamples(
      "http://api.test.com/fn",
      "GET",
      "key=value",
      "",
      "",
    );

    expect(examples.curl).toContain("http://api.test.com/fn?key=value");
    expect(examples.javascript).toContain("http://api.test.com/fn?key=value");
    expect(examples.python).toContain("http://api.test.com/fn?key=value");
    expect(examples.go).toContain("http://api.test.com/fn?key=value");
  });

  it("generates URL without query when empty", () => {
    const examples = generateCodeExamples(
      "http://api.test.com/fn",
      "GET",
      "",
      "",
      "",
    );

    // Should not have the ? query separator
    expect(examples.curl).not.toContain("?");
    expect(examples.javascript).not.toContain("?");
  });

  it("includes body for POST requests", () => {
    const examples = generateCodeExamples(
      "http://api.test.com/fn",
      "POST",
      "",
      "",
      '{"data": "test"}',
    );

    expect(examples.curl).toContain("-d");
    expect(examples.curl).toContain('{"data": "test"}');
    expect(examples.javascript).toContain("body:");
    expect(examples.python).toContain("data=");
    expect(examples.go).toContain("strings.NewReader");
  });

  it("excludes body for GET requests", () => {
    const examples = generateCodeExamples(
      "http://api.test.com/fn",
      "GET",
      "",
      "",
      '{"data": "test"}',
    );

    // GET should not include body even if provided
    expect(examples.curl).not.toContain("-d");
    expect(examples.javascript).not.toContain("body:");
  });

  it("parses and includes headers", () => {
    const examples = generateCodeExamples(
      "http://api.test.com/fn",
      "GET",
      "",
      '{"Authorization": "Bearer token123"}',
      "",
    );

    expect(examples.curl).toContain("Authorization: Bearer token123");
    expect(examples.javascript).toContain("'Authorization': 'Bearer token123'");
    expect(examples.python).toContain("'Authorization': 'Bearer token123'");
    expect(examples.go).toContain(
      'req.Header.Set("Authorization", "Bearer token123")',
    );
  });

  it("handles invalid headers JSON gracefully", () => {
    // Should not throw
    const examples = generateCodeExamples(
      "http://api.test.com/fn",
      "GET",
      "",
      "invalid json {{{",
      "",
    );

    expect(examples.curl).toContain("http://api.test.com/fn");
    expect(examples.javascript).toBeDefined();
  });

  it("uses correct HTTP method in all examples", () => {
    const examples = generateCodeExamples(
      "http://api.test.com/fn",
      "DELETE",
      "",
      "",
      "",
    );

    expect(examples.curl).toContain("curl -X DELETE");
    expect(examples.python).toContain("requests.delete");
    expect(examples.go).toContain('"DELETE"');
  });
});
