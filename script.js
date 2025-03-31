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
