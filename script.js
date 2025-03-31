document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("taskInput");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const taskList = document.getElementById("taskList");
    const clearCompletedBtn = document.getElementById("clearCompleted");
    const showAllBtn = document.getElementById("showAll");
    const showPendingBtn = document.getElementById("showPending");
    const showCompletedBtn = document.getElementById("showCompleted");
    const fastestTaskDisplay = document.getElementById("fastestTask");

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    renderTasks();

    addTaskBtn.addEventListener("click", addTask);
    taskInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") addTask();
    });
});

showAllBtn.addEventListener("click", () => renderTasks("all"));
showPendingBtn.addEventListener("click", () => renderTasks("pending"));
showCompletedBtn.addEventListener("click", () => renderTasks("completed"));
clearCompletedBtn.addEventListener("click", clearCompletedTasks);

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === "") return;

    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false,
        createdAt: new Date().toISOString(),
        completedAt: null
    };
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    taskInput.value = "";
}

function renderTasks(filter = "all") {
    taskList.innerHTML = "";
    let filteredTasks = tasks.filter(task => {
        if (filter === "pending") return !task.completed;
        if (filter === "completed") return task.completed;
        return true;
    });
    
    filteredTasks.forEach(task => {
        const li = document.createElement("li");
        li.className = task.completed ? "completed" : "";
        li.innerHTML = `
            <span>${task.text} <small>(${formatDate(task.createdAt)})</small></span>
            <div>
                <button onclick="toggleComplete(${task.id})">✔</button>
                <button onclick="deleteTask(${task.id})">❌</button>
            </div>
        `;
        taskList.appendChild(li);
    });
    displayFastestTask();
}


function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
window.toggleComplete = (id) => {
    tasks = tasks.map(task => {
        if (task.id === id) {
            task.completed = !task.completed;
            task.completedAt = task.completed ? new Date().toISOString() : null;
        }
        return task;
    });
    saveTasks();
    renderTasks();
};
window.deleteTask = (id) => {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
};

function clearCompletedTasks() {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    renderTasks();
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString();
}

function displayFastestTask() {
    const completedTasks = tasks.filter(task => task.completed && task.completedAt);
    if (completedTasks.length === 0) {
        fastestTaskDisplay.textContent = "";
        return;
    }
    
    let fastest = completedTasks.reduce((fastest, task) => {
        const timeTaken = new Date(task.completedAt) - new Date(task.createdAt);
        return timeTaken < fastest.timeTaken ? { task, timeTaken } : fastest;
    }, { task: null, timeTaken: Infinity });
    
    fastestTaskDisplay.textContent = `Tarea completada más rápido: "${fastest.task.text}" en ${fastest.timeTaken / 1000} segundos.`;
}

