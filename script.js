const taskInput = document.getElementById("taskInput");
const dueDateInput = document.getElementById("dueDate");
const filterSelect = document.getElementById("filter");
const sortOrderSelect = document.getElementById("sortOrder");
const taskList = document.getElementById("taskList");
const installBtn = document.getElementById("installBtn");
let searchQuery = "";

function getTasks() {
  return JSON.parse(localStorage.getItem("tasks") || "[]");
}

function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
  const text = taskInput.value.trim();
  const date = dueDateInput.value;

  if (!text) return alert("Enter a task");
  if (!date) return alert("Select a due date");

  const tasks = getTasks();
  tasks.push({ text, done: false, date });
  saveTasks(tasks);
  renderTasks(tasks);
  taskInput.value = "";
  dueDateInput.value = "";
}

function toggleDone(index) {
  const tasks = getTasks();
  tasks[index].done = !tasks[index].done;
  saveTasks(tasks);
  renderTasks(tasks);
}

function deleteTask(index) {
  const taskItems = document.querySelectorAll("#taskList li");
  const taskElement = taskItems[index];
  if (taskElement) {
    taskElement.classList.add("fade-out");
    taskElement.addEventListener("animationend", () => {
      const tasks = getTasks();
      tasks.splice(index, 1);
      saveTasks(tasks);
      renderTasks(tasks);
    });
  }
}

function clearCompleted() {
  const tasks = getTasks().filter(task => !task.done);
  saveTasks(tasks);
  renderTasks(tasks);
}

function renderTasks(tasks) {
  taskList.innerHTML = "";
  const filter = filterSelect.value;
  const sortOrder = sortOrderSelect.value;

  const sorted = tasks.sort((a, b) =>
    sortOrder === "newest"
      ? new Date(b.date) - new Date(a.date)
      : new Date(a.date) - new Date(b.date)
  );

  const filtered = sorted.filter(task => {
    const matchesFilter =
      filter === "all" ||
      (filter === "active" && !task.done) ||
      (filter === "completed" && task.done);

    const matchesSearch = task.text.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  filtered.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded flex justify-between items-center fade-in";

    li.innerHTML = `
      <div class="flex flex-col flex-1 cursor-pointer ${task.done ? "line-through text-gray-500" : ""}" onclick="toggleDone(${index})">
        <span>${task.text}</span>
        <small class="text-xs text-gray-500 dark:text-gray-300">Due: ${task.date}</small>
      </div>
      <button class="bg-red-500 text-white px-3 py-1 rounded ml-4" onclick="deleteTask(${index})">Delete</button>
    `;
    taskList.appendChild(li);
  });
}

function toggleDarkMode() {
  document.documentElement.classList.toggle("dark");
}

document.getElementById("searchInput").addEventListener("input", e => {
  searchQuery = e.target.value;
  renderTasks(getTasks());
});

window.onload = () => renderTasks(getTasks());

// PWA install button
let deferredPrompt;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.classList.remove("hidden");
  installBtn.addEventListener("click", () => {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(choice => {
      if (choice.outcome === "accepted") console.log("App installed");
      installBtn.classList.add("hidden");
    });
  });
});

