const request = require("supertest");
const app = require("../src/app");
const taskService = require("../src/services/taskService");

beforeEach(() => {
  taskService._reset();
});

describe("Tasks API", () => {
  //! Get Task
  test("GET /tasks should return 200", async () => {

    const response = await request(app).get("/tasks");

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);

  });

  //! Post task
  test("POST /tasks should create a new task", async () => {
  const response = await request(app)
    .post("/tasks")
    .send({
      title: "Learn Jest",
      description: "Testing API",
      status: "todo",
      priority: "high",
    });

  expect(response.statusCode).toBe(201);
  expect(response.body.title).toBe("Learn Jest");
  expect(response.body.status).toBe("todo");
  expect(response.body).toHaveProperty("id");
  });

  //!Invalid request
  test("POST /tasks should return 400 when title is missing", async () => {
  const response = await request(app)
    .post("/tasks")
    .send({
      status: "todo",
    });

  expect(response.statusCode).toBe(400);
  });

  //! Put cases
  test("PUT /tasks/:id should update an existing task", async () => {
  // Create a task
  const created = await request(app)
    .post("/tasks")
    .send({
      title: "Old Title",
      status: "todo",
    });

  const id = created.body.id;

  // Update the task
  const response = await request(app)
    .put(`/tasks/${id}`)
    .send({
      title: "New Title",
      status: "in_progress",
    });

  expect(response.statusCode).toBe(200);
  expect(response.body.title).toBe("New Title");
  expect(response.body.status).toBe("in_progress");
  });

  test("PUT /tasks/:id should return 404 for invalid id", async () => {
  const response = await request(app)
    .put("/tasks/invalid-id")
    .send({
      title: "Updated Task",
    });

  expect(response.statusCode).toBe(404);
  });

  //!Delete cases
  test("DELETE /tasks/:id should delete an existing task", async () => {
  const created = await request(app)
    .post("/tasks")
    .send({
      title: "Task to Delete",
    });

  const id = created.body.id;

  const response = await request(app).delete(`/tasks/${id}`);

  expect(response.statusCode).toBe(204);
  });

  test("DELETE /tasks/:id should return 404 for invalid id", async () => {
  const response = await request(app).delete("/tasks/invalid-id");

  expect(response.statusCode).toBe(404);
  });


  //! patch cases
  test("PATCH /tasks/:id/complete should mark task as completed", async () => {
  const created = await request(app)
    .post("/tasks")
    .send({
      title: "Complete Me",
      priority: "high",
    });

  const id = created.body.id;

  const response = await request(app).patch(`/tasks/${id}/complete`);

  expect(response.statusCode).toBe(200);
  expect(response.body.status).toBe("done");
  expect(response.body.completedAt).not.toBeNull();
  });

  test("PATCH /tasks/:id/complete should return 404 for invalid id", async () => {
  const response = await request(app)
    .patch("/tasks/invalid-id/complete");

  expect(response.statusCode).toBe(404);
  });

  //! pagination bug fixes
  test("GET /tasks?page=1&limit=2 should return first 2 tasks", async () => {
  await request(app).post("/tasks").send({ title: "Task 1" });
  await request(app).post("/tasks").send({ title: "Task 2" });
  await request(app).post("/tasks").send({ title: "Task 3" });

  const response = await request(app)
    .get("/tasks?page=1&limit=2");

  expect(response.statusCode).toBe(200);
  expect(response.body).toHaveLength(2);
  expect(response.body[0].title).toBe("Task 1");
  expect(response.body[1].title).toBe("Task 2");
  });

  test("PATCH /tasks/:id/assign should assign a task", async () => {
  const created = await request(app)
    .post("/tasks")
    .send({
      title: "API Assignment",
    });

  const response = await request(app)
    .patch(`/tasks/${created.body.id}/assign`)
    .send({
      assignee: "Sachin",
    });

  expect(response.statusCode).toBe(200);
  expect(response.body.assignee).toBe("Sachin");
});

test("PATCH /tasks/:id/assign should return 400 for empty assignee", async () => {
  const created = await request(app)
    .post("/tasks")
    .send({
      title: "API Assignment",
    });

  const response = await request(app)
    .patch(`/tasks/${created.body.id}/assign`)
    .send({
      assignee: "",
    });

  expect(response.statusCode).toBe(400);
});

test("PATCH /tasks/:id/assign should return 404 for invalid id", async () => {
  const response = await request(app)
    .patch("/tasks/invalid-id/assign")
    .send({
      assignee: "Sachin",
    });

  expect(response.statusCode).toBe(404);
});

});