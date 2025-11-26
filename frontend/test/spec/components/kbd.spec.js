/**
 * @fileoverview Tests for Kbd and Separator components.
 */

import { Kbd, Separator } from "../../../js/components/kbd.js";

describe("Kbd", () => {
  describe("view()", () => {
    it("renders a kbd element", () => {
      const vnode = { attrs: {}, children: ["⌘K"] };
      const result = Kbd.view(vnode);

      expect(result.tag).toBe("kbd");
      expect(result).toHaveClass("kbd");
    });

    it("applies small class when small is true", () => {
      const vnode = { attrs: { small: true }, children: ["Enter"] };
      const result = Kbd.view(vnode);

      expect(result).toHaveClass("kbd--sm");
    });

    it("does not apply small class by default", () => {
      const vnode = { attrs: {}, children: ["Esc"] };
      const result = Kbd.view(vnode);

      expect(getVnodeClass(result)).not.toContain("kbd--sm");
    });

    it("preserves custom class names", () => {
      const vnode = { attrs: { class: "my-kbd" }, children: ["Tab"] };
      const result = Kbd.view(vnode);

      expect(result).toHaveClass("my-kbd");
      expect(result).toHaveClass("kbd");
    });

    it("passes through children", () => {
      const vnode = { attrs: {}, children: ["Ctrl+C"] };
      const result = Kbd.view(vnode);

      // Children may be wrapped as Mithril text nodes
      const children = Array.isArray(result.children)
        ? result.children
        : [result.children];
      const text = children[0];
      const actualText = (text && text.tag === "#") ? text.children : text;
      expect(actualText).toBe("Ctrl+C");
    });
  });
});

describe("Separator", () => {
  describe("view()", () => {
    it("renders a div with separator class", () => {
      const vnode = { attrs: {} };
      const result = Separator.view(vnode);

      expect(result.tag).toBe("div");
      expect(result).toHaveClass("separator");
    });

    it("applies horizontal class by default", () => {
      const vnode = { attrs: {} };
      const result = Separator.view(vnode);

      expect(result).toHaveClass("separator--horizontal");
    });

    it("applies vertical class when vertical is true", () => {
      const vnode = { attrs: { vertical: true } };
      const result = Separator.view(vnode);

      expect(result).toHaveClass("separator--vertical");
      expect(getVnodeClass(result)).not.toContain("separator--horizontal");
    });

    it("applies with-margin class when withMargin is true", () => {
      const vnode = { attrs: { withMargin: true } };
      const result = Separator.view(vnode);

      expect(result).toHaveClass("separator--with-margin");
    });

    it("sets aria-hidden to true", () => {
      const vnode = { attrs: {} };
      const result = Separator.view(vnode);

      expect(result.attrs["aria-hidden"]).toBe("true");
    });

    it("preserves custom class names", () => {
      const vnode = { attrs: { class: "my-separator" } };
      const result = Separator.view(vnode);

      expect(result).toHaveClass("my-separator");
    });
  });
});
