        const taskInput = document.getElementById('taskInput');
        const dueDateInput = document.getElementById('dueDate');
        const taskList = document.getElementById('taskList');

        let filter = 'all';
        let sortOrder = 'asc';

        window.onload = () => {
        if (localStorage.getItem('theme') === 'dark') {
            document.documentElement.classList.add('dark');
        }
        renderTasks(getTasks());
        };

        function getTasks() {
        return JSON.parse(localStorage.getItem('tasks')) || [];
        }

        function saveTasks(tasks) {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        }

        function addTask() {
        const text = taskInput.value.trim();
        const date = dueDateInput.value;
        if (!text || !date) return alert('Please enter both task and due date');

        const tasks = getTasks();
        tasks.push({ text, date, done: false });
        saveTasks(tasks);
        renderTasks(tasks);
        taskInput.value = '';
        dueDateInput.value = '';
        }

        function deleteTask(index) {
        const tasks = getTasks();
        tasks.splice(index, 1);
        saveTasks(tasks);
        renderTasks(tasks);
        }

        function toggleDone(index) {
        const tasks = getTasks();
        tasks[index].done = !tasks[index].done;
        saveTasks(tasks);
        renderTasks(tasks);
        }

        function renderTasks(tasks) {
        taskList.innerHTML = '';
        const sorted = [...tasks].sort((a, b) => {
            return sortOrder === 'asc'
            ? new Date(a.date) - new Date(b.date)
            : new Date(b.date) - new Date(a.date);
        });

        sorted.forEach((task, index) => {
            if (
            (filter === 'active' && task.done) ||
            (filter === 'completed' && !task.done)
            ) return;

            const li = document.createElement('li');
            li.className = 'bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded flex justify-between items-center';

            li.innerHTML = `
            <div class="flex flex-col flex-1 cursor-pointer ${task.done ? 'line-through text-gray-500' : ''}" onclick="toggleDone(${index})">
                <span>${task.text}</span>
                <small class="text-xs text-gray-500 dark:text-gray-300">Due: ${task.date}</small>
            </div>
            <button class="bg-red-500 text-white px-3 py-1 rounded ml-4" onclick="deleteTask(${index})">Delete</button>
            `;
            taskList.appendChild(li);
        });
        }

        function filterTasks(type) {
        filter = type;
        renderTasks(getTasks());
        }

        function sortTasks(order) {
        sortOrder = order;
        renderTasks(getTasks());
        }

        function clearCompleted() {
        let tasks = getTasks();
        tasks = tasks.filter(task => !task.done);
        saveTasks(tasks);
        renderTasks(tasks);
        }

        function toggleDarkMode() {
        document.documentElement.classList.toggle('dark');
        const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
        }
