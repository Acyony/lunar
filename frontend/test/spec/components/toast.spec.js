/**
 * @fileoverview Tests for Toast notification component - focused on critical functionality.
 */

import { Toast } from "../../../js/components/toast.js";

describe("Toast", () => {
  beforeEach(() => {
    Toast.messages = [];
    Toast.nextId = 0;
  });

  it("returns null when no messages", () => {
    expect(Toast.view()).toBeNull();
  });

  it("renders one toast per message", () => {
    Toast.messages = [
      { id: 1, message: "First", type: "success" },
      { id: 2, message: "Second", type: "error" },
    ];
    const result = Toast.view();
    expect(result.children.length).toBe(2);
  });

  it("show() adds message to array", () => {
    Toast.show("Test message", "success", 10000);
    expect(Toast.messages.length).toBe(1);
    expect(Toast.messages[0].message).toBe("Test message");
    expect(Toast.messages[0].type).toBe("success");
  });

  it("remove() removes message by id", () => {
    Toast.messages = [
      { id: 1, message: "First", type: "success" },
      { id: 2, message: "Second", type: "error" },
    ];
    Toast.remove(1);
    expect(Toast.messages.length).toBe(1);
    expect(Toast.messages[0].id).toBe(2);
  });
});
