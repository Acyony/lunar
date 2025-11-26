/**
 * @fileoverview Tests for TemplateCard components - focused on critical functionality.
 */

import {
  FunctionTemplates,
  TemplateCard,
} from "../../../js/components/template-card.js";

describe("TemplateCard", () => {
  it("applies selected class when selected", () => {
    const vnode = { attrs: { name: "Test", selected: true }, children: [] };
    const result = TemplateCard.view(vnode);
    expect(getVnodeClass(result)).toContain("template-card--selected");
  });

  it("sets aria-pressed based on selected state", () => {
    const selected = { attrs: { name: "Test", selected: true }, children: [] };
    const notSelected = {
      attrs: { name: "Test", selected: false },
      children: [],
    };

    expect(TemplateCard.view(selected).attrs["aria-pressed"]).toBe(true);
    expect(TemplateCard.view(notSelected).attrs["aria-pressed"]).toBe(false);
  });

  it("attaches onclick handler", () => {
    const handler = jasmine.createSpy("onclick");
    const vnode = { attrs: { name: "Test", onclick: handler }, children: [] };
    const result = TemplateCard.view(vnode);
    expect(result.attrs.onclick).toBe(handler);
  });
});

describe("FunctionTemplates", () => {
  it("contains required templates", () => {
    const ids = FunctionTemplates.map((t) => t.id);
    expect(ids).toContain("http");
    expect(ids).toContain("blank");
  });

  it("all templates have valid handler code", () => {
    FunctionTemplates.forEach((template) => {
      expect(template.code).toContain("function handler");
    });
  });
});
