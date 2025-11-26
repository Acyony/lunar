/**
 * @fileoverview Tests for route utility functions.
 */

import { paths, routes } from "../../js/routes.js";

describe("routes (hashbang URLs for href)", () => {
  it("generates functions list URL", () => {
    expect(routes.functions()).toBe("#!/functions");
  });

  it("generates function create URL", () => {
    expect(routes.functionCreate()).toBe("#!/functions/new");
  });

  it("generates function code URL with ID", () => {
    expect(routes.functionCode("abc123")).toBe("#!/functions/abc123");
  });

  it("generates function versions URL", () => {
    expect(routes.functionVersions("fn-1")).toBe("#!/functions/fn-1/versions");
  });

  it("generates function executions URL", () => {
    expect(routes.functionExecutions("fn-1")).toBe(
      "#!/functions/fn-1/executions",
    );
  });

  it("generates function settings URL", () => {
    expect(routes.functionSettings("fn-1")).toBe("#!/functions/fn-1/settings");
  });

  it("generates function test URL", () => {
    expect(routes.functionTest("fn-1")).toBe("#!/functions/fn-1/test");
  });

  it("generates function diff URL with two versions", () => {
    expect(routes.functionDiff("fn-1", 1, 3)).toBe(
      "#!/functions/fn-1/diff/1/3",
    );
  });

  it("generates execution detail URL", () => {
    expect(routes.execution("exec-456")).toBe("#!/executions/exec-456");
  });

  it("generates login URL", () => {
    expect(routes.login()).toBe("#!/login");
  });

  it("generates preview URL", () => {
    expect(routes.preview()).toBe("#!/preview");
  });

  it("generates preview component URL", () => {
    expect(routes.previewComponent("button")).toBe("#!/preview/button");
  });
});

describe("paths (for m.route.set() calls)", () => {
  it("generates functions list path without hash prefix", () => {
    expect(paths.functions()).toBe("/functions");
  });

  it("generates function code path", () => {
    expect(paths.functionCode("abc123")).toBe("/functions/abc123");
  });

  it("generates function versions path", () => {
    expect(paths.functionVersions("fn-1")).toBe("/functions/fn-1/versions");
  });

  it("generates function executions path", () => {
    expect(paths.functionExecutions("fn-1")).toBe("/functions/fn-1/executions");
  });

  it("generates function settings path", () => {
    expect(paths.functionSettings("fn-1")).toBe("/functions/fn-1/settings");
  });

  it("generates function test path", () => {
    expect(paths.functionTest("fn-1")).toBe("/functions/fn-1/test");
  });

  it("generates function diff path", () => {
    expect(paths.functionDiff("fn-1", 2, 5)).toBe("/functions/fn-1/diff/2/5");
  });

  it("generates execution path", () => {
    expect(paths.execution("exec-789")).toBe("/executions/exec-789");
  });

  it("generates login path", () => {
    expect(paths.login()).toBe("/login");
  });
});
