class User {
    constructor (
        public id: number,
        public name: string,
        public email:string,
){}
}

class Task{
    public assignedUserId: number |null = null;

    constructor(
        public taskId: number,
        public title: string,
        public description: string,
    ){}
}

class UserTaskManager {
    private users: User[] = [];
    private tasks: Task[] = [];
    private uniqueUserId = 1;
    private uniqueTaskId = 1;
    
   createUser(name: string, email: string): User{
    const user = new User(this.uniqueUserId++, name, email);
    this.users.push(user);
    return user;
   }

   getUser(id: number): User | undefined{
    return this.users.find(user => user.id === id);
   }

   updateUser(id: number, name?: string, email?: string): boolean {
  const user = this.getUser(id);
  if (!user) return false;
  if (name) user.name = name;
  if (email) user.email = email;
  return true;
}

deleteUser(id: number): boolean {
  const index = this.users.findIndex(user => user.id === id);
  if (index === -1) return false;
  this.users.splice(index, 1);
  
  this.tasks.forEach(task => {
    if (task.assignedUserId === id) task.assignedUserId = null;
  });

  return true;
}

   createTask(title: string, description: string): Task{
    const task = new Task(this.uniqueTaskId++, title, description);
    this.tasks.push(task);
    return task;
   }

   getTask(taskId: number): Task | undefined{
    return this.tasks.find(task => task.taskId === taskId);
   }

   updateTask(id: number, title?: string, description?: string): boolean {
  const task = this.getTask(id);
  if (!task) return false;
  if (title) task.title = title;
  if (description) task.description = description;
  return true;
}

deleteTask(id: number): boolean {
  const index = this.tasks.findIndex(task => task.taskId === id);
  if (index === -1) return false;
  this.tasks.splice(index, 1);
  return true;
}


   assignTaskToUser(taskId: number, userId: number): boolean{
    const task = this.getTask(taskId);
    const user = this.getUser(userId);
    if (!task || !user) return false;

    task.assignedUserId = userId;
    return true;
}

unassignTask(taskId: number): boolean {
  const task = this.getTask(taskId);
  if (!task || task.assignedUserId === null) return false;
  task.assignedUserId = null;
  return true;
}


getTasksByUser(userId: number): Task[] {
  return this.tasks.filter(task => task.assignedUserId === userId);
}

}


const manager = new UserTaskManager();

const user1 = manager.createUser("Jane", "janedoe@gmail.com");
const user2 = manager.createUser("John", "johndoe@gmail.com");
// console.log("Created Users:", user1, user2);

console.log("Get User 1:", manager.getUser(user1.id));

manager.updateUser(user1.id, "Alice", "alice@yahoomail.com");
console.log("Updated User 1:", manager.getUser(user1.id));

manager.deleteUser(user2.id);
console.log("Users after deleting John:", manager.getUser(user2.id));

const task1 = manager.createTask("Wash dishes", "Clean all dishes including the hotpot");
const task2 = manager.createTask("Familiarise myself with generic", "Get to watch videos, visit repos and read documentation bout generics");
// console.log("Created Tasks:", task1, task2);

console.log("Get Task 1:", manager.getTask(task1.taskId));

manager.updateTask(task1.taskId, "Fix login bug", "Fix login and registration issues");
console.log("Updated Task 1:", manager.getTask(task1.taskId));

manager.assignTaskToUser(task1.taskId, user1.id);
console.log("Task assigned to Alice:", manager.getTasksByUser(user1.id));

// manager.unassignTask(task1.taskId, user1.id);
// console.log("Task unassigned fromAlice:", manager.getTasksByUser(user1.id));

// manager.deleteTask(task2.taskId);
// console.log("Task 2 after deletion:", manager.getTask(task2.taskId)); 
