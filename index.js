const fs = require('fs')
const { v4: uuidv4 } = require('uuid');
const path = './tasks.json';

const args = process.argv.slice(2);
const command = args[0];

function readTasks() {
    if (!fs.existsSync(path)) return [];
    const data = fs.readFileSync(path);
    return JSON.parse(data);
}

function writeTasks(tasks) {
    fs.writeFileSync(path, JSON.stringify(tasks, null, 2));
}

function addTask(description) {
    const tasks = readTasks();
    const now = new Date().toISOString().slice(0, 10);
    const newTask = {
        id: uuidv4(),
        description,
        status: "todo",
        createdAt: now,
        updatedAt: now
    }
    tasks.push(newTask);
    writeTasks(tasks);
    console.log("Task added Successfully")
}

function updateTask(id, description) {
    const tasks = readTasks();
    const now = new Date().toISOString().slice(0, 10)
    const task = tasks.find(t => t.id === id);
    if (!task) return console.lof("Task not found");
    task.description = description;
    task.updateAt = now;
    writeTasks(tasks);
    console.log("Task updated");
}

function deleteTask(id) {
    const tasks = readTasks();
    const len = tasks.length;
    const filtered = tasks.filter(t => t.id !== id);
    if (len === filtered.length) return console.log("No Task found");
    writeTasks(filtered);
    console.log("Deleted the Task successfully");
}

function setStatus(id, status) {
    const tasks = readTasks();
    const task = tasks.find(t => t.id === id);
    if (!task) return console.log("No task found");
    task.status = status;
    task.updateAt = new Date().toISOString();
    writeTasks(tasks);
    console.log("Status of Task updated");
}

function listTasks(filter = null) {
    const tasks = readTasks();
    const filtered = filter ? tasks.filter(t => t.status === filter) : tasks;
    if (filtered.length === 0) return console.log("No Task found");
    filtered.forEach((task, id) => {
        console.log(
            `\n${id + 1}. ${task.description}\n ${task.id}\n ${task.status}\n ${task.createdAt}\n ${task.updatedAt}\n`
        )
    })
}

switch (command) {
    case "add":
        addTask(args.slice(1).join(" "));
        break;
    case "update":
        updateTask(args[1], args.slice(2).join(" "));
        break;
    case "delete":
        deleteTask(args[1]);
        break;
    case "mark":
        setStatus(args[1], args[2]);
        break;
    case "list":
        listTasks(); break;
    case "list-done":
        listTasks("done"); break;
    case "list-todo":
        listTasks("todo"); break;
    case "list-progress":
        listTasks("in-progress"); break;
    default:
        console.log("Unknown command");
}
