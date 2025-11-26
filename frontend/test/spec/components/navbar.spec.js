/**
 * @fileoverview Tests for Navbar components - focused on critical functionality.
 */

import {
  NavbarAction,
  NavbarBrand,
  NavbarBreadcrumb,
  NavbarSearch,
} from "../../../js/components/navbar.js";

describe("NavbarBrand", () => {
  it("uses custom name and href", () => {
    const vnode = { attrs: { name: "My App", href: "/home" }, children: [] };
    const result = NavbarBrand.view(vnode);
    expect(result.attrs.href).toBe("/home");
  });
});

describe("NavbarBreadcrumb", () => {
  it("renders active item with aria-current", () => {
    const vnode = {
      attrs: { items: [{ label: "Home", active: true }] },
      children: [],
    };
    const result = NavbarBreadcrumb.view(vnode);
    const activeSpan = result.children.find(
      (c) =>
        c && c.tag === "span" &&
        getVnodeClass(c).includes("navbar__breadcrumb-current"),
    );
    expect(activeSpan).toBeTruthy();
    expect(activeSpan.attrs["aria-current"]).toBe("page");
  });

  it("renders non-active item as link", () => {
    const vnode = {
      attrs: { items: [{ label: "Home", href: "/" }] },
      children: [],
    };
    const result = NavbarBreadcrumb.view(vnode);
    const link = result.children.find((c) => c && c.tag === "a");
    expect(link).toBeTruthy();
    expect(link.attrs.href).toBe("/");
  });
});

describe("NavbarSearch", () => {
  it("attaches onclick handler", () => {
    const handler = jasmine.createSpy("onclick");
    const vnode = { attrs: { onclick: handler }, children: [] };
    const result = NavbarSearch.view(vnode);
    expect(result.attrs.onclick).toBe(handler);
  });
});

describe("NavbarAction", () => {
  it("renders as button by default", () => {
    const vnode = { attrs: { label: "Click" }, children: [] };
    const result = NavbarAction.view(vnode);
    expect(result.tag).toBe("button");
  });

  it("renders as anchor when href provided", () => {
    const vnode = { attrs: { label: "Link", href: "/page" }, children: [] };
    const result = NavbarAction.view(vnode);
    expect(result.tag).toBe("a");
    expect(result.attrs.href).toBe("/page");
  });
});
