# Bug Report

## Bug 1: Incorrect Pagination

### Expected Behaviour
GET /tasks?page=1&limit=2 should return the first two tasks.

### Actual Behaviour
It returns only the third task.

### How I Found It
I wrote an integration test using Jest and Supertest.

### Suggested Fix
Change:

```js
const offset = page * limit;
```

to:

```js
const offset = (page - 1) * limit;

*************************************************************************************************************************************************

## Bug 2: Completing a Task Resets Priority

### Expected Behaviour
Completing a task should only update the task status to `done` and set the `completedAt` timestamp. The existing priority should remain unchanged.

### Actual Behaviour
When a task is marked as complete, its priority is automatically changed to `medium`, even if it was previously `high` or `low`.

### How I Found It
I wrote an integration test using Jest and Supertest that created a task with `priority: "high"` and then called the `PATCH /tasks/:id/complete` endpoint. The response showed that the priority had changed to `medium`.

### Suggested Fix
Remove the hardcoded priority update from the `completeTask()` function.

Change:

```js
const updated = {
  ...task,
  priority: "medium",
  status: "done",
  completedAt: new Date().toISOString(),
};
```

to:

```js
const updated = {
  ...task,
  status: "done",
  completedAt: new Date().toISOString(),
};
```
```