/**
 * @fileoverview Tests for Button component.
 */

import {
  BackButton,
  Button,
  ButtonSize,
  ButtonVariant,
} from "../../../js/components/button.js";

describe("Button", () => {
  describe("view()", () => {
    it("renders a button element by default", () => {
      const vnode = { attrs: {}, children: ["Click me"] };
      const result = Button.view(vnode);

      expect(result.tag).toBe("button");
      expect(result.attrs.type).toBe("button");
    });

    it("renders an anchor when href is provided", () => {
      const vnode = { attrs: { href: "/test" }, children: ["Link"] };
      const result = Button.view(vnode);

      expect(result.tag).toBe("a");
      expect(result.attrs.href).toBe("/test");
    });

    it("applies primary variant class by default", () => {
      const vnode = { attrs: {}, children: ["Submit"] };
      const result = Button.view(vnode);

      expect(result).toHaveClass("btn--primary");
    });

    it("applies specified variant class", () => {
      const vnode = {
        attrs: { variant: ButtonVariant.DESTRUCTIVE },
        children: ["Delete"],
      };
      const result = Button.view(vnode);

      expect(result).toHaveClass("btn--destructive");
    });

    it("applies default size class by default", () => {
      const vnode = { attrs: {}, children: ["Button"] };
      const result = Button.view(vnode);

      expect(result).toHaveClass("btn--default");
    });

    it("applies specified size class", () => {
      const vnode = { attrs: { size: ButtonSize.SM }, children: ["Small"] };
      const result = Button.view(vnode);

      expect(result).toHaveClass("btn--sm");
    });

    it("applies disabled class when disabled", () => {
      const vnode = { attrs: { disabled: true }, children: ["Disabled"] };
      const result = Button.view(vnode);

      expect(result).toHaveClass("btn--disabled");
      expect(result.attrs.disabled).toBe(true);
    });

    it("applies loading class when loading", () => {
      const vnode = { attrs: { loading: true }, children: ["Loading"] };
      const result = Button.view(vnode);

      expect(result).toHaveClass("btn--loading");
      expect(result.attrs.disabled).toBe(true);
    });

    it("applies full width class when fullWidth is true", () => {
      const vnode = { attrs: { fullWidth: true }, children: ["Full Width"] };
      const result = Button.view(vnode);

      expect(result).toHaveClass("btn--full-width");
    });

    it("sets aria-busy when loading", () => {
      const vnode = { attrs: { loading: true }, children: ["Loading"] };
      const result = Button.view(vnode);

      expect(result.attrs["aria-busy"]).toBe(true);
    });

    it("sets aria-label when provided", () => {
      const vnode = {
        attrs: { ariaLabel: "Submit form" },
        children: ["Submit"],
      };
      const result = Button.view(vnode);

      expect(result.attrs["aria-label"]).toBe("Submit form");
    });

    it("adds noopener noreferrer for external links", () => {
      const vnode = {
        attrs: { href: "https://example.com", target: "_blank" },
        children: ["External"],
      };
      const result = Button.view(vnode);

      expect(result.attrs.rel).toBe("noopener noreferrer");
    });

    it("preserves custom class names", () => {
      const vnode = {
        attrs: { class: "my-custom-class" },
        children: ["Custom"],
      };
      const result = Button.view(vnode);

      expect(result).toHaveClass("my-custom-class");
      expect(result).toHaveClass("btn");
    });
  });
});

describe("ButtonVariant", () => {
  it("exports all expected variants", () => {
    expect(ButtonVariant.PRIMARY).toBe("primary");
    expect(ButtonVariant.DESTRUCTIVE).toBe("destructive");
    expect(ButtonVariant.OUTLINE).toBe("outline");
    expect(ButtonVariant.SECONDARY).toBe("secondary");
    expect(ButtonVariant.GHOST).toBe("ghost");
    expect(ButtonVariant.LINK).toBe("link");
  });
});

describe("ButtonSize", () => {
  it("exports all expected sizes", () => {
    expect(ButtonSize.DEFAULT).toBe("default");
    expect(ButtonSize.SM).toBe("sm");
    expect(ButtonSize.LG).toBe("lg");
    expect(ButtonSize.ICON).toBe("icon");
  });
});

describe("BackButton", () => {
  it("renders an anchor with back-btn class", () => {
    const vnode = { attrs: {} };
    const result = BackButton.view(vnode);

    expect(result.tag).toBe("a");
    expect(result).toHaveClass("back-btn");
  });

  it("uses default href of #!/", () => {
    const vnode = { attrs: {} };
    const result = BackButton.view(vnode);

    expect(result.attrs.href).toBe("#!/");
  });

  it("uses custom href when provided", () => {
    const vnode = { attrs: { href: "#!/functions" } };
    const result = BackButton.view(vnode);

    expect(result.attrs.href).toBe("#!/functions");
  });
});
