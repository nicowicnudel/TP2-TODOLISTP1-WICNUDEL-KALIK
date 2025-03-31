const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const clearCompletedBtn = document.getElementById("clearCompleted");
const showAllBtn = document.getElementById("showAll");
const showPendingBtn = document.getElementById("showPending");
const showCompletedBtn = document.getElementById("showCompleted");
const fastestTaskDisplay = document.getElementById("fastestTask");


let tasks = JSON.parse(localStorage.getItem("tasks")) || [];


const saveTasks = () => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};


const formatDate = (isoString) => {
    return new Date(isoString).toLocaleString("es-ES");
};

const renderTasks = (filter = "all") => {
    taskList.innerHTML = "";

    const filteredTasks = tasks.filter(task => {
        if (filter === "pending") return !task.completed;
        if (filter === "completed") return task.completed;
        return true; 
    });

    filteredTasks.forEach(task => {
        const li = document.createElement("li");
        li.classList.add("task-item");
        if (task.completed) li.classList.add("completed");

        li.innerHTML = `
            <span>${task.text} <small>(${formatDate(task.createdAt)})</small></span>
            <div>
                <button onclick="toggleComplete(${task.id})">✔</button>
                <button onclick="deleteTask(${task.id})">❌</button>
            </div>
        `;
        taskList.appendChild(li);
    });

    calculateFastestTask();
};

const addTask = () => {
    const text = taskInput.value.trim();
    if (!text) return;

    const newTask = {
        id: Date.now(),
        text,
        completed: false,
        createdAt: new Date().toISOString(),
        completedAt: null
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();
    taskInput.value = ""; 
};

const toggleComplete = (taskId) => {
    tasks = tasks.map(task => {
        if (task.id === taskId) {
            task.completed = !task.completed;
            task.completedAt = task.completed ? new Date().toISOString() : null;
        }
        return task;
    });
    saveTasks();
    renderTasks();
};

const deleteTask = (taskId) => {
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasks();
    renderTasks();
};

const clearCompleted = () => {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    renderTasks();
};

const calculateFastestTask = () => {
    const completedTasks = tasks.filter(task => task.completed && task.completedAt);
    if (completedTasks.length === 0) {
        fastestTaskDisplay.textContent = "No hay tareas aún.";
        return;
    }

    let fastest = completedTasks.reduce((fastest, task) => {
        const timeTaken = new Date(task.completedAt) - new Date(task.createdAt);
        return timeTaken < fastest.time ? { task, time: timeTaken } : fastest;
    }, { task: null, time: Infinity });

    const seconds = (fastest.time / 1000).toFixed(2);
    fastestTaskDisplay.textContent = `Tarea completada más rápido: "${fastest.task.text}" en ${seconds} segundos.`;
};

addTaskBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTask();
});

clearCompletedBtn.addEventListener("click", clearCompleted);
showAllBtn.addEventListener("click", () => renderTasks("all"));
showPendingBtn.addEventListener("click", () => renderTasks("pending"));
showCompletedBtn.addEventListener("click", () => renderTasks("completed"));

document.addEventListener("DOMContentLoaded", renderTasks);
