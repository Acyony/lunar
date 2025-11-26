/**
 * @fileoverview Tests for Tabs components.
 */

import { TabContent, Tabs } from "../../../js/components/tabs.js";

describe("Tabs", () => {
  describe("view()", () => {
    it("renders a div with tabs class and tablist role", () => {
      const vnode = { attrs: { tabs: [] } };
      const result = Tabs.view(vnode);

      expect(result.tag).toBe("div");
      expect(result).toHaveClass("tabs");
      expect(result.attrs.role).toBe("tablist");
    });

    it("renders tab items for each tab", () => {
      const vnode = {
        attrs: {
          tabs: [
            { id: "tab1", label: "Tab 1" },
            { id: "tab2", label: "Tab 2" },
            { id: "tab3", label: "Tab 3" },
          ],
        },
      };
      const result = Tabs.view(vnode);

      expect(result.children.length).toBe(3);
    });

    it("renders tabs as anchor elements", () => {
      const vnode = {
        attrs: {
          tabs: [{ id: "tab1", label: "Tab 1" }],
        },
      };
      const result = Tabs.view(vnode);

      const tab = result.children[0];
      expect(tab.tag).toBe("a");
      expect(tab).toHaveClass("tabs__item");
    });

    it("marks active tab with active class", () => {
      const vnode = {
        attrs: {
          tabs: [
            { id: "tab1", label: "Tab 1" },
            { id: "tab2", label: "Tab 2" },
          ],
          activeTab: "tab2",
        },
      };
      const result = Tabs.view(vnode);

      const tab1 = result.children[0];
      const tab2 = result.children[1];

      expect(getVnodeClass(tab1)).not.toContain("tabs__item--active");
      expect(tab2).toHaveClass("tabs__item--active");
    });

    it("marks disabled tab with disabled class", () => {
      const vnode = {
        attrs: {
          tabs: [{ id: "tab1", label: "Tab 1", disabled: true }],
        },
      };
      const result = Tabs.view(vnode);

      const tab = result.children[0];
      expect(tab).toHaveClass("tabs__item--disabled");
      expect(tab.attrs["aria-disabled"]).toBe(true);
    });

    it("sets aria-selected for active tab", () => {
      const vnode = {
        attrs: {
          tabs: [
            { id: "tab1", label: "Tab 1" },
            { id: "tab2", label: "Tab 2" },
          ],
          activeTab: "tab1",
        },
      };
      const result = Tabs.view(vnode);

      const tab1 = result.children[0];
      const tab2 = result.children[1];

      expect(tab1.attrs["aria-selected"]).toBe("true");
      expect(tab2.attrs["aria-selected"]).toBe("false");
    });

    it("uses href when provided", () => {
      const vnode = {
        attrs: {
          tabs: [{ id: "tab1", label: "Tab 1", href: "/page1" }],
        },
      };
      const result = Tabs.view(vnode);

      const tab = result.children[0];
      expect(tab.attrs.href).toBe("/page1");
    });

    it("uses # as default href", () => {
      const vnode = {
        attrs: {
          tabs: [{ id: "tab1", label: "Tab 1" }],
        },
      };
      const result = Tabs.view(vnode);

      const tab = result.children[0];
      expect(tab.attrs.href).toBe("#");
    });

    it("supports name attribute as alias for label", () => {
      const vnode = {
        attrs: {
          tabs: [{ id: "tab1", name: "Tab Name" }],
        },
      };
      const result = Tabs.view(vnode);

      const tab = result.children[0];
      // The label text should be in children (may be wrapped as text node)
      const hasLabel = tab.children.some((c) =>
        c === "Tab Name" || (c && c.tag === "#" && c.children === "Tab Name")
      );
      expect(hasLabel).toBe(true);
    });

    it("renders badge when provided", () => {
      const vnode = {
        attrs: {
          tabs: [{ id: "tab1", label: "Tab 1", badge: "5" }],
        },
      };
      const result = Tabs.view(vnode);

      const tab = result.children[0];
      const badge = tab.children.find(
        (c) =>
          c && c.tag === "span" && getVnodeClass(c).includes("tabs__badge"),
      );
      expect(badge).toBeTruthy();
    });

    it("supports active property on tab definition", () => {
      const vnode = {
        attrs: {
          tabs: [
            { id: "tab1", label: "Tab 1", active: true },
            { id: "tab2", label: "Tab 2" },
          ],
        },
      };
      const result = Tabs.view(vnode);

      const tab1 = result.children[0];
      expect(tab1).toHaveClass("tabs__item--active");
    });

    it("preserves custom class names", () => {
      const vnode = {
        attrs: {
          tabs: [],
          class: "my-tabs",
        },
      };
      const result = Tabs.view(vnode);

      expect(getVnodeClass(result)).toContain("my-tabs");
    });
  });
});

describe("TabContent", () => {
  describe("view()", () => {
    it("renders a div with tab-content class", () => {
      const vnode = { attrs: {}, children: ["Content"] };
      const result = TabContent.view(vnode);

      expect(result.tag).toBe("div");
      expect(result).toHaveClass("tab-content");
    });

    it("renders in container mode when no id provided", () => {
      const vnode = { attrs: {}, children: ["Content"] };
      const result = TabContent.view(vnode);

      // No role or aria attributes in container mode
      expect(result.attrs.role).toBeUndefined();
    });

    it("renders with tabpanel role when id is provided", () => {
      const vnode = { attrs: { id: "panel1" }, children: ["Content"] };
      const result = TabContent.view(vnode);

      expect(result.attrs.role).toBe("tabpanel");
      expect(result.attrs.id).toBe("tab-panel1");
    });

    it("applies active class when active is true", () => {
      const vnode = {
        attrs: { id: "panel1", active: true },
        children: ["Content"],
      };
      const result = TabContent.view(vnode);

      expect(result).toHaveClass("tab-content--active");
    });

    it("sets hidden attribute when not active", () => {
      const vnode = {
        attrs: { id: "panel1", active: false },
        children: ["Content"],
      };
      const result = TabContent.view(vnode);

      expect(result.attrs.hidden).toBe(true);
    });

    it("does not set hidden when active", () => {
      const vnode = {
        attrs: { id: "panel1", active: true },
        children: ["Content"],
      };
      const result = TabContent.view(vnode);

      expect(result.attrs.hidden).toBeUndefined();
    });

    it("sets aria-labelledby to match tab id", () => {
      const vnode = { attrs: { id: "panel1" }, children: ["Content"] };
      const result = TabContent.view(vnode);

      expect(result.attrs["aria-labelledby"]).toBe("tab-panel1");
    });

    it("preserves custom class names", () => {
      const vnode = { attrs: { class: "my-content" }, children: ["Content"] };
      const result = TabContent.view(vnode);

      expect(getVnodeClass(result)).toContain("my-content");
    });
  });
});
