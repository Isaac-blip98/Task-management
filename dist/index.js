"use strict";
class User {
    constructor(id, name, email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }
}
class Task {
    constructor(taskId, title, description) {
        this.taskId = taskId;
        this.title = title;
        this.description = description;
        this.assignedUserId = null;
    }
}
class UserTaskManager {
    constructor() {
        this.users = [];
        this.tasks = [];
        this.uniqueUserId = 1;
        this.uniqueTaskId = 1;
    }
    createUser(name, email) {
        const user = new User(this.uniqueUserId++, name, email);
        this.users.push(user);
        return user;
    }
    getUser(id) {
        return this.users.find(user => user.id === id);
    }
    updateUser(id, name, email) {
        const user = this.getUser(id);
        if (!user)
            return false;
        if (name)
            user.name = name;
        if (email)
            user.email = email;
        return true;
    }
    deleteUser(id) {
        const index = this.users.findIndex(user => user.id === id);
        if (index === -1)
            return false;
        this.users.splice(index, 1);
        this.tasks.forEach(task => {
            if (task.assignedUserId === id)
                task.assignedUserId = null;
        });
        return true;
    }
    createTask(title, description) {
        const task = new Task(this.uniqueTaskId++, title, description);
        this.tasks.push(task);
        return task;
    }
    getTask(taskId) {
        return this.tasks.find(task => task.taskId === taskId);
    }
    updateTask(id, title, description) {
        const task = this.getTask(id);
        if (!task)
            return false;
        if (title)
            task.title = title;
        if (description)
            task.description = description;
        return true;
    }
    deleteTask(id) {
        const index = this.tasks.findIndex(task => task.taskId === id);
        if (index === -1)
            return false;
        this.tasks.splice(index, 1);
        return true;
    }
    assignTaskToUser(taskId, userId) {
        const task = this.getTask(taskId);
        const user = this.getUser(userId);
        if (!task || !user)
            return false;
        task.assignedUserId = userId;
        return true;
    }
    unassignTask(taskId) {
        const task = this.getTask(taskId);
        if (!task || task.assignedUserId === null)
            return false;
        task.assignedUserId = null;
        return true;
    }
    getTasksByUser(userId) {
        return this.tasks.filter(task => task.assignedUserId === userId);
    }
}
const manager = new UserTaskManager();
// const user1 = manager.createUser("Jane", "janedoe@gmail.com");
// const user2 = manager.createUser("John", "johndoe@gmail.com");
// console.log("Created Users:", user1, user2);
// console.log("Get User 1:", manager.getUser(user1.id));
// manager.updateUser(user1.id, "Alice", "alice@yahoomail.com");
// console.log("Updated User 1:", manager.getUser(user1.id));
// manager.deleteUser(user2.id);
// console.log("Users after deleting John:", manager.getUser(user2.id));
// const task1 = manager.createTask("Wash dishes", "Clean all dishes including the hotpot");
// const task2 = manager.createTask("Familiarise myself with generic", "Get to watch videos, visit repos and read documentation bout generics");
// console.log("Created Tasks:", task1, task2);
// console.log("Get Task 1:", manager.getTask(task1.taskId));
// manager.updateTask(task1.taskId, "Fix login bug", "Fix login and registration issues");
// console.log("Updated Task 1:", manager.getTask(task1.taskId));
// manager.assignTaskToUser(task1.taskId, user1.id);
// console.log("Task assigned to Alice:", manager.getTasksByUser(user1.id));
// manager.unassignTask(task1.taskId, user1.id);
// console.log("Task unassigned fromAlice:", manager.getTasksByUser(user1.id));
// manager.deleteTask(task2.taskId);
// console.log("Task 2 after deletion:", manager.getTask(task2.taskId)); 



const $ = id => document.getElementById(id);

function showFeedback(message, isError = false) {
  const feedback = $("feedback");
  feedback.textContent = message;
  feedback.style.color = isError ? "crimson" : "green";
}

function renderUsers() {
  const list = $("userList");
  list.innerHTML = "";
  manager.users.forEach(user => {
    const li = document.createElement("li");
    li.innerHTML = `User ${user.id}: ${user.name} (${user.email})`;
    const btn = document.createElement("button");
    btn.textContent = "Delete";
    btn.onclick = () => {
      manager.deleteUser(user.id);
      renderUsers();
      renderTasks(); 
      showFeedback("User deleted.");
    };
    li.appendChild(btn);
    list.appendChild(li);
  });
}

function renderTasks() {
  const list = $("taskList");
  list.innerHTML = "";
  manager.tasks.forEach(task => {
    const li = document.createElement("li");
    const status = task.assignedUserId !== null
      ? `Assigned to User ${task.assignedUserId}`
      : "Unassigned";
    li.innerHTML = `Task ${task.taskId}: ${task.title} - ${task.description} (${status})`;
    const btn = document.createElement("button");
    btn.textContent = "Delete";
    btn.onclick = () => {
      manager.deleteTask(task.taskId);
      renderTasks();
      showFeedback("Task deleted.");
    };
    li.appendChild(btn);
    list.appendChild(li);
  });
}


$("createUserBtn").addEventListener("click", () => {
  const name = $("userName").value;
  const email = $("userEmail").value;

  if (!name || !email || !email.includes("@")) {
    return showFeedback("Please enter a valid name and email.", true);
  }

  manager.createUser(name, email);
  $("userName").value = "";
  $("userEmail").value = "";
  renderUsers();
  showFeedback("User created successfully.");
});

$("createTaskBtn").addEventListener("click", () => {
  const title = $("taskTitle").value;
  const desc = $("taskDesc").value;

  if (!title || !desc) {
    return showFeedback("Please enter a task title and description.", true);
  }

  manager.createTask(title, desc);
  $("taskTitle").value = "";
  $("taskDesc").value = "";
  renderTasks();
  showFeedback("Task created successfully.");
});

$("assignBtn").addEventListener("click", () => {
  const taskId = parseInt($("assignTaskId").value);
  const userId = parseInt($("assignUserId").value);

  if (isNaN(taskId) || isNaN(userId)) {
    return showFeedback("Enter valid numeric IDs for task and user.", true);
  }

  const success = manager.assignTaskToUser(taskId, userId);
  renderTasks();
  showFeedback(success ? "Task assigned." : "Task or user not found.", !success);
});

$("unassignBtn").addEventListener("click", () => {
  const taskId = parseInt($("assignTaskId").value);

  if (isNaN(taskId)) {
    return showFeedback("Enter a valid task ID to unassign.", true);
  }

  const success = manager.unassignTask(taskId);
  renderTasks();
  showFeedback(success ? "Task unassigned." : "Task not found or already unassigned.", !success);
});

renderUsers();
renderTasks();
