      
      // 🌐 Global Variables
      const taskInput = document.getElementById('taskInput');
      const dueDateInput = document.getElementById('dueDate');
      const taskList = document.getElementById('taskList');

      let filter = 'all';
      let sortOrder = 'asc';
      let searchQuery = '';

      // 🚀 On Page Load
      window.onload = () => {
        if (localStorage.getItem('theme') === 'dark') {
          document.documentElement.classList.add('dark');
        }
        renderTasks(getTasks());
        requestNotificationPermission();

        // 🔍 Search Input Listener
        document.getElementById('searchInput').addEventListener('input', (e) => {
          searchQuery = e.target.value;
          renderTasks(getTasks());
        });
      };

      // ✅ Task Management
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
        const newTask = { text, date, done: false };
        tasks.push(newTask);
        saveTasks(tasks);
        renderTasks(tasks);
        scheduleReminder(newTask);
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

      function updateTaskText(event, index) {
        const tasks = getTasks();
        const updatedText = event.target.value.trim();

        if (updatedText === '') {
          alert("Task can't be empty.");
          renderTasks(tasks); // re-render to restore original text
          return;
        }

        tasks[index].text = updatedText;
        saveTasks(tasks);
        renderTasks(tasks);
      }


      function clearCompleted() {
        let tasks = getTasks();
        tasks = tasks.filter(task => !task.done);
        saveTasks(tasks);
        renderTasks(tasks);
      }

      function filterTasks(type) {
        filter = type;
        renderTasks(getTasks());
      }

      function sortTasks(order) {
        sortOrder = order;
        renderTasks(getTasks());
      }

      function renderTasks(tasks) {
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = '';

        const sort = document.getElementById('sortSelect')?.value || 'newest';
        const filter = document.getElementById('filterSelect')?.value || 'all';

        // 🧠 Sort tasks
        const sorted = [...tasks].sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return sort === 'newest' ? dateB - dateA : dateA - dateB;
        });

        // 🔍 Filter + Search
        const filtered = sorted.filter(task => {
          const matchesFilter =
            filter === 'all' ||
            (filter === 'active' && !task.done) ||
            (filter === 'completed' && task.done);

          const matchesSearch = task.text.toLowerCase().includes(searchQuery.toLowerCase());

          return matchesFilter && matchesSearch;
      });

        // 🎨 Render UI
        filtered.forEach((task, index) => {
          const li = document.createElement('li');
          li.className = 'bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded flex justify-between items-center fade-in';

          li.innerHTML = `
            <div class="flex flex-col flex-1 cursor-pointer ${task.done ? 'line-through text-gray-500' : ''}">
              <input 
                type="text"
                value="${task.text}"
                class="task-text-input bg-transparent border-none focus:outline-none ${task.done ? 'line-through text-gray-500' : ''}"
                data-index="${index}"
                onblur="updateTaskText(event, ${index})"
                onkeydown="if(event.key === 'Enter') this.blur();"
              >
              <small class="text-xs text-gray-500 dark:text-gray-300">Due: ${task.date}</small>
            </div>
            <button class="bg-red-500 text-white px-3 py-1 rounded ml-4" onclick="deleteTask(${index})">Delete</button>
          `;

          taskList.appendChild(li);
        });
      }

      // 🌙 Dark,Light Mode Toggle
      function toggleDarkMode() {
        document.documentElement.classList.toggle('dark , light');
        const theme = document.documentElement.classList.contains('dark , light') ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
        console.log('Theme changed to:', theme);
      }

      // 🔔 Notification System
      function scheduleReminder(task) {
        const delay = new Date(task.date).getTime() - Date.now();
        if (delay > 0 && delay < 24 * 60 * 60 * 1000) {
          setTimeout(() => {
            showNotification(`Reminder: ${task.text}`, `Due at ${new Date(task.date).toLocaleTimeString()}`);
          }, delay);
        }
      }

      function showNotification(title, body) {
        if (Notification.permission === 'granted') {
          new Notification(title, { body });
        }
      }

      function requestNotificationPermission() {
        if ('Notification' in window) {
          Notification.requestPermission().then(permission => {
            console.log('Notification permission:', permission);
          });
        }
      }



      



