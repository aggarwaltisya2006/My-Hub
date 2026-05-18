document.addEventListener("DOMContentLoaded", renderTasks);

function getTasks() {
    const rawData = localStorage.getItem("myTasks");
    if (rawData) return JSON.parse(rawData);
    return [
        { title: "Finish dashboard project", completed: false },
        { title: "Prepare presentation slides", completed: false }
    ];
}

function saveTasks(tasksArray) {
    localStorage.setItem("myTasks", JSON.stringify(tasksArray));
}

function addTask() {
    const inputField = document.getElementById("todoInput");
    const taskTitle = inputField.value.trim();

    if (!taskTitle) {
        alert("A blank task cannot be added.");
        return;
    }

    const tasks = getTasks();
    tasks.push({ title: taskTitle, completed: false });
    saveTasks(tasks);
    inputField.value = "";
    renderTasks();
}

function toggleTask(index) {
    const tasks = getTasks();
    tasks[index].completed = !tasks[index].completed;
    saveTasks(tasks);
    renderTasks();
}

function deleteTask(index) {
    const tasks = getTasks();
    tasks.splice(index, 1);
    saveTasks(tasks);
    renderTasks();
}

function renderTasks() {
    const taskList = document.getElementById("todoList");
    const tasks = getTasks();

    taskList.innerHTML = "";

    if (tasks.length === 0) {
        taskList.innerHTML = '<p class="empty-state">No tasks yet. Add one above!</p>';
        return;
    }

    tasks.forEach((task, index) => {
        const taskDiv = document.createElement("div");
        taskDiv.className = "task" + (task.completed ? " completed" : "");

        taskDiv.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${index})">
            <span class="${task.completed ? 'done' : ''}">${task.title}</span>
            <button class="delete-task-btn" onclick="deleteTask(${index})" title="Delete task">
                <i class="fa-solid fa-trash"></i>
            </button>
        `;

        taskList.appendChild(taskDiv);
    });
}
