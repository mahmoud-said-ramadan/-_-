// Function to open the edit modal
function openEditModal (listItem) {
    var taskText = listItem.textContent
    var editTaskInput = document.getElementById('editTaskInput')
    editTaskInput.value = taskText.trim()
    document.getElementById('editModal').style.display = 'block'
    listItemToEdit = listItem
  }
  
  // Function to close the edit modal
  function closeEditModal () {
    document.getElementById('editModal').style.display = 'none'
  }
  
  // Function to save edited task
  function saveEditedTask () {
    var editedText = document.getElementById('editTaskInput').value.trim()
    listItemToEdit.textContent = editedText
    closeEditModal()
    saveTasksToLocalStorage()
  }
  
  // Load tasks from local storage when the page loads
  window.onload = function () {
    loadTasksFromLocalStorage()
  }
  
  // Function to load tasks from local storage
  function loadTasksFromLocalStorage () {
    var tasks = JSON.parse(localStorage.getItem('tasks')) || []
    tasks.forEach(function (taskText) {
      addTaskToList(taskText)
    })
  }
  
  // Function to add a task to the list
  function addTaskToList(taskText, listItem = null) {
      var taskList = document.getElementById('taskList');
      var listItem = listItem || document.createElement('li');
  
      // Check if the task is already in the list
      if (!listItem.parentElement) {
          var checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.onclick = function() {
              toggleTaskCompletion(listItem);
          };
          listItem.appendChild(checkbox);
          listItem.appendChild(document.createTextNode(taskText));
  
          // Create edit icon (if not already present)
          if (!listItem.querySelector('.edit-task')) {
              var editIcon = document.createElement('i');
              editIcon.classList.add('fas', 'fa-edit', 'edit-task');
              editIcon.onclick = function() {
                  openEditModal(listItem);
              };
              listItem.appendChild(editIcon);
          }
  
          // Create delete icon (if not already present)
          if (!listItem.querySelector('.delete-task')) {
              var deleteIcon = document.createElement('i');
              deleteIcon.classList.add('fas', 'fa-trash-alt', 'delete-task');
              deleteIcon.onclick = function() {
                  deleteTaskFromList(listItem);
              };
              listItem.appendChild(deleteIcon);
          }
  
          taskList.appendChild(listItem);
      }
  }
  
  function deleteTaskFromList(listItem) {
      listItem.remove();
  
      // Remove task from local storage
      var taskText = listItem.textContent.trim();
      var tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      var index = tasks.indexOf(taskText);
      if (index !== -1) {
          tasks.splice(index, 1);
          localStorage.setItem('tasks', JSON.stringify(tasks));
      }
  }
  
  
  // Function to open the task manager modal
  function openTaskManager () {
    var modal = document.getElementById('modal')
    modal.style.display = 'block'
    loadTasksToManager()
  }
  
  // Function to close the task manager modal
  function closeTaskManager () {
    var modal = document.getElementById('modal')
    modal.style.display = 'none'
  }
  
  // Function to load tasks to the task manager modal
  function loadTasksToManager () {
    var taskManagerList = document.getElementById('taskManagerList')
    taskManagerList.innerHTML = '' // Clear previous tasks
    var taskGroups = document.querySelectorAll('.task-group')
    taskGroups.forEach(function (taskGroup) {
      var taskList = taskGroup.querySelector('ul')
      var taskItems = taskList.getElementsByTagName('li')
      for (var i = 0; i < taskItems.length; i++) {
        var taskText = taskItems[i].getElementsByTagName('span')[0].textContent
        var listItem = document.createElement('li')
        var checkbox = document.createElement('input')
        checkbox.type = 'checkbox'
        checkbox.addEventListener('change', toggleTaskCompletionFromManager)
        listItem.appendChild(checkbox)
        listItem.appendChild(document.createTextNode(taskText))
        var deleteButton = document.createElement('span')
        deleteButton.textContent = '×'
        deleteButton.classList.add('delete-task')
        deleteButton.setAttribute('onclick', 'deleteTaskFromManager(this)')
        listItem.appendChild(deleteButton)
        taskManagerList.appendChild(listItem)
      }
    })
  }
  
  // Function to add a task to the task manager
  function addTaskToManager() {
      var taskManagerInput = document.getElementById('taskManagerInput');
      var taskText = taskManagerInput.value.trim();
  
      if (taskText !== '') {
          var taskManagerList = document.getElementById('taskManagerList');
          var listItem = document.createElement('li');
          var checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.addEventListener('change', function() {
              if (checkbox.checked) {
                  listItem.style.textDecoration = 'line-through';
              } else {
                  listItem.style.textDecoration = 'none';
              }
          });
          listItem.appendChild(checkbox);
          // Append the task text to the list item
          listItem.appendChild(document.createTextNode(taskText));
          taskManagerList.appendChild(listItem);
          taskManagerInput.value = '';
          // Add task text to main list
          addTaskToList(taskText);
          // Save tasks to local storage
          saveTasksToLocalStorage();
      } else {
          alert('Please enter a task!');
      }
  }
  
  // Function to delete a task from the task manager
  function deleteTaskFromManager (element) {
    var listItem = element.parentElement
    listItem.remove()
    saveTasksToLocalStorage()
  }
  
  // Function to delete completed tasks
  function deleteCompletedTasks () {
    var taskManagerList = document.getElementById('taskManagerList')
    var completedTasks = taskManagerList.querySelectorAll(
      "li input[type='checkbox']:checked"
    )
    completedTasks.forEach(function (task) {
      task.parentElement.remove()
    })
    saveTasksToLocalStorage()
  }
  
  // Function to save tasks to local storage
  function saveTasksToLocalStorage() {
      var taskManagerList = document.getElementById('taskManagerList');
      var tasks = [];
      var taskItems = taskManagerList.getElementsByTagName('li');
      for (var i = 0; i < taskItems.length; i++) {
          var taskText = taskItems[i].textContent;
          tasks.push(taskText);
      }
  
      // Retrieve existing tasks from local storage
      var existingTasks = JSON.parse(localStorage.getItem('tasks')) || [];
  
      // Concatenate existing tasks with new tasks
      var allTasks = existingTasks.concat(tasks);
  
      // Remove duplicate tasks (if any)
      var uniqueTasks = allTasks.filter((task, index, self) => {
          return index === self.indexOf(task);
      });
  
      // Save the unique tasks to local storage
      localStorage.setItem('tasks', JSON.stringify(uniqueTasks));
  }
  
  
  // Function to save edited task
  function saveEditedTask() {
      var editedText = document.getElementById("editTaskInput").value.trim();
      listItemToEdit.textContent = editedText;
      addTaskToList(editedText, listItemToEdit); // Add icons to the updated task
      var taskListItems = document.querySelectorAll("#taskList li");
      var tasks = Array.from(taskListItems).map(function (item) {
          return item.textContent.trim();
      });
      localStorage.setItem("tasks", JSON.stringify(tasks));
      closeEditModal();
  }

// Function to toggle task completion
function toggleTaskCompletion(listItem) {
    var checkbox = listItem.querySelector("input[type='checkbox']");
    var taskSpan = listItem.querySelector("span");

    if (checkbox.checked) {
        taskSpan.style.textDecoration = 'line-through';
    } else {
        taskSpan.style.textDecoration = 'none';
    }
}  