// Pre-entered tasks
let todos = [
  {
    todoID: 0,
    todoText: "Get birthday present for Macy",
    todoComplete: false,
    category: "General",
  },
  {
    todoID: 1,
    todoText: "Take toilet break",
    todoComplete: false,
    category: "Work",
  },
  {
    todoID: 2,
    todoText: "Prank call classmate",
    todoComplete: false,
    category: "School",
  },
];

let categories = ["General", "School", "Work"];

let inputField = document.querySelector(".inputField input");
let categorySelect = document.querySelector("#categorySelect");
let addButton = document.querySelector("#addTodoButton");
let todoList = document.querySelector(".todoList");
let footer = document.querySelector(".footer span");
let clearButton = document.querySelector(".footer button");

function initializeTodos() {
  populateCategories();

  todos.forEach((todo) => {
    addTodoToDom(todo);
  });
  updatePendingTasks();
}

function addTodoToDom(todo) {
  let li = document.createElement("li");
  li.textContent = `${todo.todoText} - ${todo.category}`;
  if (todo.todoComplete) {
    li.classList.add("done");
  }
  let deleteIcon = document.createElement("span");
  deleteIcon.innerHTML = '<i class="fa fa-trash"></i>';
  deleteIcon.addEventListener("click", () => deleteTodo(todo.todoID));
  li.appendChild(deleteIcon);
  li.addEventListener("click", () => toggleComplete(todo.todoID));
  todoList.appendChild(li);
}

// Sort categories alphabetically
function sortCategories() {
  categories.sort();

  // Clear existing options
  categorySelect.innerHTML = "";

  // Add 'All' option to display all todos
  let allOption = document.createElement("option");
  allOption.value = "All";
  allOption.text = "All";
  categorySelect.add(allOption);

  // Add sorted categories to the dropdown
  categories.forEach((category) => {
    let option = document.createElement("option");
    option.value = category;
    option.text = category;
    categorySelect.add(option);
  });
}

function displayTodosByCategory(selectedCategory) {
  todoList.innerHTML = ""; // Clear existing todos

  todos
    .filter(
      (todo) => selectedCategory === "All" || todo.category === selectedCategory
    )
    .sort((a, b) => a.todoText.localeCompare(b.todoText))
    .forEach((todo) => {
      addTodoToDom(todo);
    });
}

function populateCategories() {
  sortCategories();

  // Add 'All' option to display all todos
  let allOption = document.createElement("option");
  allOption.value = "All";
  allOption.text = "All";
  categorySelect.add(allOption);

  sortCategories();
}

// Add a new todo
function addTodo(todoText, selectedCategory) {
  let newID = todos.length > 0 ? todos[todos.length - 1].todoID + 1 : 0;
  let newTodo = {
    todoID: newID,
    todoText,
    todoComplete: false,
    category: selectedCategory,
  };
  todos.push(newTodo);

  addTodoToDom(newTodo);
  updatePendingTasks();
}

// Toggle todo completion
function toggleComplete(todoID) {
  let todoIndex = todos.findIndex((todo) => todo.todoID === todoID);
  todos[todoIndex].todoComplete = !todos[todoIndex].todoComplete;
  let li = todoList.children[todoIndex];
  li.classList.toggle("done");

  updatePendingTasks();
  displayTodosByCategory(categorySelect.value);
}

// Delete a todo
function deleteTodo(todoID) {
  let todoIndex = todos.findIndex((todo) => todo.todoID === todoID);
  todos.splice(todoIndex, 1);
  todoList.removeChild(todoList.children[todoIndex]);

  updatePendingTasks();
  displayTodosByCategory(categorySelect.value);
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
  let completedLiElements = Array.from(todoList.getElementsByClassName("done"));
  completedLiElements.forEach((li) => todoList.removeChild(li));

  updatePendingTasks();
}

// Add new todo with Enter key
inputField.addEventListener("keyup", (event) => {
  if (event.key === "Enter" && inputField.value.trim() !== "") {
    let selectedCategory = categorySelect.value;
    addTodo(inputField.value.trim(), selectedCategory);
    inputField.value = "";
  }
});

// Add new todo with plus button
addButton.addEventListener("click", () => {
  if (inputField.value.trim() !== "") {
    let selectedCategory = categorySelect.value;
    addTodo(inputField.value.trim(), selectedCategory);
    inputField.value = "";

    displayTodosByCategory(selectedCategory);
  }
});

clearButton.addEventListener("click", clearDone);

document.querySelector("#addCategoryButton").addEventListener("click", () => {
  let newCategory = prompt("Enter new category:");
  if (newCategory) {
    let existingCategory = Array.from(categorySelect.options).find(
      (option) => option.value === newCategory
    );

    if (!existingCategory) {
      // Add the new category to the categories array
      categories.push(newCategory);
      categories.sort();

      // Clear existing options
      categorySelect.innerHTML = "";

      // Add 'All' option to display all todos
      let allOption = document.createElement("option");
      allOption.value = "All";
      allOption.text = "All";
      categorySelect.add(allOption);

      // Add sorted categories to the dropdown
      categories.forEach((category) => {
        let option = document.createElement("option");
        option.value = category;
        option.text = category;
        categorySelect.add(option);
      });
    } else {
      alert("Category already exists!");
    }
  }
});

categorySelect.addEventListener("change", () => {
  displayTodosByCategory(categorySelect.value);
});

initializeTodos();

// Edit Category
document.querySelector("#editCategoryButton").addEventListener("click", () => {
  let selectedCategory = categorySelect.value;
  let editedCategory = prompt("Enter the new category name:", selectedCategory);

  if (editedCategory && editedCategory !== selectedCategory) {
    // Update the categories array
    categories[categories.indexOf(selectedCategory)] = editedCategory;

    sortCategories();

    todos.forEach((todo) => {
      if (todo.category === selectedCategory) {
        todo.category = editedCategory;
      }
    });

    displayTodosByCategory(editedCategory);
  }
});

// Delete Category
document
  .querySelector("#deleteCategoryButton")
  .addEventListener("click", () => {
    let selectedCategory = categorySelect.value;

    if (selectedCategory !== "All") {
      // Remove the category from the categories array
      categories = categories.filter(
        (category) => category !== selectedCategory
      );

      sortCategories();

      todos.forEach((todo) => {
        if (todo.category === selectedCategory) {
          todo.category = "All";
        }
      });

      displayTodosByCategory("All");
    }
  });