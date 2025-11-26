/**
 * @fileoverview Tests for Pagination components.
 */

import {
  Pagination,
  SimplePagination,
} from "../../../js/components/pagination.js";

/**
 * Helper to find pagination info section
 */
function findInfo(result) {
  return result.children.find(
    (child) =>
      child && child.tag === "div" &&
      getVnodeClass(child).includes("pagination__info"),
  );
}

/**
 * Helper to find pagination controls section
 */
function findControls(result) {
  return result.children.find(
    (child) =>
      child && child.tag === "div" &&
      getVnodeClass(child).includes("pagination__controls"),
  );
}

/**
 * Helper to find buttons container
 */
function findButtons(controls) {
  return controls.children.find(
    (child) =>
      child && child.tag === "div" &&
      getVnodeClass(child).includes("pagination__buttons"),
  );
}

describe("Pagination", () => {
  describe("view()", () => {
    it("renders null when total is 0", () => {
      const vnode = {
        attrs: {
          total: 0,
          limit: 10,
          offset: 0,
          onPageChange: () => {},
          onLimitChange: () => {},
        },
      };
      const result = Pagination.view(vnode);

      expect(result).toBeNull();
    });

    it("renders nav element with pagination class", () => {
      const vnode = {
        attrs: {
          total: 50,
          limit: 10,
          offset: 0,
          onPageChange: () => {},
          onLimitChange: () => {},
        },
      };
      const result = Pagination.view(vnode);

      expect(result.tag).toBe("nav");
      expect(result).toHaveClass("pagination");
      expect(result.attrs.role).toBe("navigation");
      expect(result.attrs["aria-label"]).toBe("Pagination");
    });

    it("displays info section", () => {
      const vnode = {
        attrs: {
          total: 50,
          limit: 10,
          offset: 0,
          onPageChange: () => {},
          onLimitChange: () => {},
        },
      };
      const result = Pagination.view(vnode);
      const info = findInfo(result);

      expect(info).toBeTruthy();
    });

    it("disables Previous button on first page", () => {
      const vnode = {
        attrs: {
          total: 50,
          limit: 10,
          offset: 0,
          onPageChange: () => {},
          onLimitChange: () => {},
        },
      };
      const result = Pagination.view(vnode);
      const controls = findControls(result);
      const buttons = findButtons(controls);
      const prevButton = buttons.children[0];

      expect(prevButton.attrs.disabled).toBe(true);
    });

    it("enables Previous button on second page", () => {
      const vnode = {
        attrs: {
          total: 50,
          limit: 10,
          offset: 10,
          onPageChange: () => {},
          onLimitChange: () => {},
        },
      };
      const result = Pagination.view(vnode);
      const controls = findControls(result);
      const buttons = findButtons(controls);
      const prevButton = buttons.children[0];

      expect(prevButton.attrs.disabled).toBe(false);
    });

    it("disables Next button on last page", () => {
      const vnode = {
        attrs: {
          total: 50,
          limit: 10,
          offset: 40,
          onPageChange: () => {},
          onLimitChange: () => {},
        },
      };
      const result = Pagination.view(vnode);
      const controls = findControls(result);
      const buttons = findButtons(controls);
      const nextButton = buttons.children[1];

      expect(nextButton.attrs.disabled).toBe(true);
    });

    it("enables Next button when not on last page", () => {
      const vnode = {
        attrs: {
          total: 50,
          limit: 10,
          offset: 0,
          onPageChange: () => {},
          onLimitChange: () => {},
        },
      };
      const result = Pagination.view(vnode);
      const controls = findControls(result);
      const buttons = findButtons(controls);
      const nextButton = buttons.children[1];

      expect(nextButton.attrs.disabled).toBe(false);
    });

    it("renders per-page select by default", () => {
      const vnode = {
        attrs: {
          total: 50,
          limit: 20,
          offset: 0,
          onPageChange: () => {},
          onLimitChange: () => {},
        },
      };
      const result = Pagination.view(vnode);
      const controls = findControls(result);
      const select = controls.children.find((child) =>
        child && child.tag === "select"
      );

      expect(select).toBeTruthy();
      expect(select.attrs["aria-label"]).toBe("Results per page");
    });

    it("hides per-page select when showPerPage is false", () => {
      const vnode = {
        attrs: {
          total: 50,
          limit: 10,
          offset: 0,
          onPageChange: () => {},
          onLimitChange: () => {},
          showPerPage: false,
        },
      };
      const result = Pagination.view(vnode);
      const controls = findControls(result);
      const select = controls.children.find((child) =>
        child && child.tag === "select"
      );

      expect(select).toBeFalsy();
    });

    it("renders correct per-page options", () => {
      const vnode = {
        attrs: {
          total: 50,
          limit: 20,
          offset: 0,
          onPageChange: () => {},
          onLimitChange: () => {},
        },
      };
      const result = Pagination.view(vnode);
      const controls = findControls(result);
      const select = controls.children.find((child) =>
        child && child.tag === "select"
      );

      expect(select.children.length).toBe(3);
      expect(select.children[0].attrs.value).toBe(10);
      expect(select.children[1].attrs.value).toBe(20);
      expect(select.children[2].attrs.value).toBe(50);
    });
  });
});

describe("SimplePagination", () => {
  describe("view()", () => {
    it("renders pagination controls", () => {
      const vnode = {
        attrs: {
          hasPrev: true,
          hasNext: true,
          onPrev: () => {},
          onNext: () => {},
        },
      };
      const result = SimplePagination.view(vnode);

      expect(result).toHaveClass("pagination__controls");
    });

    it("disables Previous button when hasPrev is false", () => {
      const vnode = {
        attrs: {
          hasPrev: false,
          hasNext: true,
          onPrev: () => {},
          onNext: () => {},
        },
      };
      const result = SimplePagination.view(vnode);

      const buttons = result.children[0];
      const prevButton = buttons.children[0];

      expect(prevButton.attrs.disabled).toBe(true);
    });

    it("enables Previous button when hasPrev is true", () => {
      const vnode = {
        attrs: {
          hasPrev: true,
          hasNext: true,
          onPrev: () => {},
          onNext: () => {},
        },
      };
      const result = SimplePagination.view(vnode);

      const buttons = result.children[0];
      const prevButton = buttons.children[0];

      expect(prevButton.attrs.disabled).toBe(false);
    });

    it("disables Next button when hasNext is false", () => {
      const vnode = {
        attrs: {
          hasPrev: true,
          hasNext: false,
          onPrev: () => {},
          onNext: () => {},
        },
      };
      const result = SimplePagination.view(vnode);

      const buttons = result.children[0];
      const nextButton = buttons.children[1];

      expect(nextButton.attrs.disabled).toBe(true);
    });

    it("enables Next button when hasNext is true", () => {
      const vnode = {
        attrs: {
          hasPrev: true,
          hasNext: true,
          onPrev: () => {},
          onNext: () => {},
        },
      };
      const result = SimplePagination.view(vnode);

      const buttons = result.children[0];
      const nextButton = buttons.children[1];

      expect(nextButton.attrs.disabled).toBe(false);
    });
  });
});
