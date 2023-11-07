// Pre-entered tasks
let todos = [
    {
      todoID: 0,
      todoText: "Get birthday present for Macy",
      todoComplete: false
    },
    {
      todoID: 1,
      todoText: "Take toilet break",
      todoComplete: false
    },
    {
      todoID: 2,
      todoText: "Prank call mom",
      todoComplete: false
    }
  
];



let inputField = document.querySelector(".inputField input");
let addButton = document.querySelector(".inputField button");
let todoList = document.querySelector(".todoList");
let footer = document.querySelector(".footer span");
let clearButton = document.querySelector(".footer button");

function initializeTodos() {
  todos.forEach((todo) => {
    let li = document.createElement("li");
    li.textContent = todo.todoText;
    if (todo.todoComplete) {
      li.classList.add("done");
    }
    let deleteIcon = document.createElement("span");
    deleteIcon.innerHTML = '<i class="fa fa-trash"></i>';
    deleteIcon.addEventListener("click", () => deleteTodo(todo.todoID));
    li.appendChild(deleteIcon);
    li.addEventListener("click", () => toggleComplete(todo.todoID));
    todoList.appendChild(li);
  });

  updatePendingTasks();
}

// Add a new todo
function addTodo(todoText) {
  let newID = todos.length > 0 ? todos[todos.length - 1].todoID + 1 : 0;
  let newTodo = {
    todoID: newID,
    todoText,
    todoComplete: false
  };
  todos.push(newTodo);


  

  let li = document.createElement("li");
  li.textContent = todoText;
  let deleteIcon = document.createElement("span");
  deleteIcon.innerHTML = '<i class="fa fa-trash"></i>';
  deleteIcon.addEventListener("click", () => deleteTodo(newID));
  li.appendChild(deleteIcon);
  li.addEventListener("click", () => toggleComplete(newID));
  todoList.appendChild(li);

  updatePendingTasks();
}

// Toggle todo completion
function toggleComplete(todoID) {
  let todoIndex = todos.findIndex((todo) => todo.todoID === todoID);
  todos[todoIndex].todoComplete = !todos[todoIndex].todoComplete;
  let li = todoList.children[todoIndex];
  li.classList.toggle("done");

  updatePendingTasks();
}

// Delete a todo
function deleteTodo(todoID) {
  let todoIndex = todos.findIndex((todo) => todo.todoID === todoID);
  todos.splice(todoIndex, 1);
  todoList.removeChild(todoList.children[todoIndex]);

  updatePendingTasks();
}

// Update the pending tasks count
function updatePendingTasks() {
  let pendingCount = todos.filter((todo) => !todo.todoComplete).length;
  footer.textContent = `You have ${pendingCount} pending task${
    pendingCount !== 1 ? "s" : ""
  }.`;
}

// Clear completed todos
function clearDone() {
  todos = todos.filter((todo) => !todo.todoComplete);
  let completedLiElements = Array.from(
    todoList.getElementsByClassName("done")
  );
  completedLiElements.forEach((li) => todoList.removeChild(li));

  updatePendingTasks();
}

// Add new todo with Enter key
inputField.addEventListener("keyup", (event) => {
  if (event.key === "Enter" && inputField.value.trim() !== "") {
    addTodo(inputField.value.trim());
    inputField.value = "";
  }
});

// Add new todo with plus button
addButton.addEventListener("click", () => {
  if (inputField.value.trim() !== "") {
    addTodo(inputField.value.trim());
    inputField.value = "";
  }
});

clearButton.addEventListener("click", clearDone);

initializeTodos();
