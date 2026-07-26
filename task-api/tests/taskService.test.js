const taskService = require("../src/services/taskService");

describe("Task Service", () => {

  beforeEach(() => {
    taskService._reset();
  });

  describe("create()", () => {

    test("should create a new task", () => {
      const task = taskService.create({
        title: "Learn Jest",
        description: "Write unit tests",
        status: "todo",
        priority: "high",
      });

      expect(task).toHaveProperty("id");
      expect(task.title).toBe("Learn Jest");
      expect(task.description).toBe("Write unit tests");
      expect(task.status).toBe("todo");
      expect(task.priority).toBe("high");
      expect(task).toHaveProperty("createdAt");
    });

    test("should use default values when optional fields are missing", () => {
      const task = taskService.create({
        title: "Default Task",
      });

      expect(task.description).toBe("");
      expect(task.status).toBe("todo");
      expect(task.priority).toBe("medium");
      expect(task.dueDate).toBeNull();
      expect(task.completedAt).toBeNull();
    });

  });

});