/**
 * @fileoverview Tests for LogViewer component - focused on critical functionality.
 */

import { LogViewer } from "../../../js/components/log-viewer.js";

/**
 * Recursively flatten all children arrays
 */
function flattenChildren(children, result = []) {
  if (!children) return result;
  if (Array.isArray(children)) {
    children.forEach((c) => {
      if (Array.isArray(c)) {
        flattenChildren(c, result);
      } else if (c) {
        result.push(c);
      }
    });
  } else {
    result.push(children);
  }
  return result;
}

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

describe("LogViewer", () => {
  it("shows empty message when no logs", () => {
    const vnode = { attrs: { logs: [] }, children: [] };
    const result = LogViewer.view(vnode);

    // Find empty message anywhere in the tree
    const emptyDiv = findNode(result, (node) => {
      if (!node || typeof node !== "object") return false;
      const tag = node.tag || "";
      const cls = getVnodeClass(node);
      return tag.includes("log-viewer__empty") ||
        cls.includes("log-viewer__empty");
    });
    expect(emptyDiv).toBeTruthy();
  });

  it("does not show empty message when logs exist", () => {
    const vnode = {
      attrs: { logs: [{ message: "Test log" }] },
      children: [],
    };
    const result = LogViewer.view(vnode);

    const allChildren = flattenChildren(result.children);
    const emptyDiv = allChildren.find((c) => {
      if (!c || typeof c !== "object") return false;
      const tag = c.tag || "";
      return tag.includes("log-viewer__empty");
    });
    expect(emptyDiv).toBeFalsy();
  });

  it("applies max-height style", () => {
    const vnode = { attrs: { maxHeight: "500px" }, children: [] };
    const result = LogViewer.view(vnode);
    expect(result.attrs.style).toContain("max-height: 500px");
  });

  it("renders level with appropriate class", () => {
    const vnode = {
      attrs: { logs: [{ message: "Error!", level: "ERROR" }] },
      children: [],
    };
    const result = LogViewer.view(vnode);

    const levelSpan = findNode(result, (node) => {
      if (!node || typeof node !== "object") return false;
      const tag = node.tag || "";
      const cls = getVnodeClass(node);
      return tag.includes("log-viewer__level") ||
        cls.includes("log-viewer__level");
    });

    expect(levelSpan).toBeTruthy();
    const levelClass = (levelSpan.tag || "") + " " + getVnodeClass(levelSpan);
    expect(levelClass).toContain("log-viewer__level--error");
  });
});
