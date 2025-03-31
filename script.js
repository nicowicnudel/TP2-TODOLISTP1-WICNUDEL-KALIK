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