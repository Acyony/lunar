/**
 * @fileoverview Tests for EnvEditor component - focused on critical functionality.
 */

import { EnvEditor } from "../../../js/components/env-editor.js";

/**
 * Deep search for a vnode matching a predicate
 */
function findVnode(node, predicate) {
  if (!node) return null;
  if (typeof node !== "object") return null;
  if (Array.isArray(node)) {
    for (const child of node) {
      const found = findVnode(child, predicate);
      if (found) return found;
    }
    return null;
  }
  if (predicate(node)) return node;
  if (node.children) return findVnode(node.children, predicate);
  return null;
}

/**
 * Deep search for all vnodes matching a predicate
 */
function findAllVnodes(node, predicate, results = []) {
  if (!node) return results;
  if (typeof node !== "object") return results;
  if (Array.isArray(node)) {
    node.forEach((child) => findAllVnodes(child, predicate, results));
    return results;
  }
  if (predicate(node)) results.push(node);
  if (node.children) findAllVnodes(node.children, predicate, results);
  return results;
}

function vnodeContains(vnode, str) {
  if (!vnode) return false;
  const tag = vnode.tag;
  const cls = getVnodeClass(vnode);
  const tagStr = typeof tag === "string" ? tag : "";
  return tagStr.includes(str) || cls.includes(str);
}

describe("EnvEditor", () => {
  it("shows empty message when no envVars", () => {
    const vnode = {
      attrs: {
        envVars: [],
        onAdd: () => {},
        onToggleRemove: () => {},
        onChange: () => {},
      },
    };
    const result = EnvEditor.view(vnode);
    const emptyMessage = findVnode(
      result,
      (n) => vnodeContains(n, "env-editor__empty"),
    );
    expect(emptyMessage).toBeTruthy();
  });

  it("renders a row for each envVar", () => {
    const vnode = {
      attrs: {
        envVars: [
          { key: "API_KEY", value: "secret1" },
          { key: "DB_URL", value: "postgres://..." },
        ],
        onAdd: () => {},
        onToggleRemove: () => {},
        onChange: () => {},
      },
    };
    const result = EnvEditor.view(vnode);
    const rows = findAllVnodes(
      result,
      (n) => n && n.attrs && n.attrs.envVar !== undefined,
    );
    expect(rows.length).toBe(2);
  });

  it("calls onAdd when Add Variable button clicked", () => {
    const onAdd = jasmine.createSpy("onAdd");
    const vnode = {
      attrs: {
        envVars: [],
        onAdd,
        onToggleRemove: () => {},
        onChange: () => {},
      },
    };
    const result = EnvEditor.view(vnode);
    const button = findVnode(
      result,
      (n) => n && n.attrs && n.attrs.onclick && n.attrs.icon === "plus",
    );
    expect(button.attrs.onclick).toBe(onAdd);
  });

  it("calls onToggleRemove with correct index", () => {
    const onToggleRemove = jasmine.createSpy("onToggleRemove");
    const vnode = {
      attrs: {
        envVars: [
          { key: "KEY1", value: "val1" },
          { key: "KEY2", value: "val2" },
        ],
        onAdd: () => {},
        onToggleRemove,
        onChange: () => {},
      },
    };
    const result = EnvEditor.view(vnode);
    const rows = findAllVnodes(result, (n) => n && n.attrs && n.attrs.envVar);

    rows[0].attrs.onToggleRemove();
    expect(onToggleRemove).toHaveBeenCalledWith(0);

    rows[1].attrs.onToggleRemove();
    expect(onToggleRemove).toHaveBeenCalledWith(1);
  });

  it("calls onChange with correct index and values", () => {
    const onChange = jasmine.createSpy("onChange");
    const vnode = {
      attrs: {
        envVars: [{ key: "KEY", value: "val" }],
        onAdd: () => {},
        onToggleRemove: () => {},
        onChange,
      },
    };
    const result = EnvEditor.view(vnode);
    const row = findVnode(result, (n) => n && n.attrs && n.attrs.envVar);

    row.attrs.onChange("NEW_KEY", "new_value");
    expect(onChange).toHaveBeenCalledWith(0, "NEW_KEY", "new_value");
  });
});
