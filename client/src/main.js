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

let baseURL = 'http://localhost:3000'

async function fetchData(endpoint, method, data) {
  try {
    const response = await fetch(baseURL + endpoint, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}



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
  const category =
    typeof selectedCategory === 'string' ? selectedCategory : selectedCategory.categoryName;

  const newTodo = {
    todoText: todoText,
    todoComplete: false,
    category: category,
  };

  fetchData('/api/todo', 'POST', newTodo)
    .then(response => {
      // Assuming the server responds with the newly created todo
      const createdTodo = response;

      // Add the new todo to the local todos array
      todos.push(createdTodo);

      // Update the UI or perform other actions as needed
      addTodoToDom(createdTodo);
      updatePendingTasks();
    })
    .catch(error => console.error('Error adding todo:', error));
}


// Toggle todo completion
function toggleComplete(todoID) {
  const todoIndex = todos.findIndex((todo) => todo.todoID === todoID);

  // Ensure the todoID exists in the array
  if (todoIndex !== -1) {
    // Toggle the todoComplete status
    todos[todoIndex].todoComplete = !todos[todoIndex].todoComplete;

    // Update the UI based on the new status
    const li = todoList.children[todoIndex];
    li.classList.toggle("done", todos[todoIndex].todoComplete);

    // Update pending tasks and display todos by category
    updatePendingTasks();
    displayTodosByCategory(categorySelect.value);

    // Make the fetch call to update the server
    fetchData(`/api/todo/${todoID}`, 'PUT', { todoComplete: todos[todoIndex].todoComplete })
      .then(response => {
        // Handle the response if needed
        console.log(response);
      })
      .catch(error => console.error('Error updating todo:', error));
  }
}

// Delete a todo
function deleteTodo(todoID) {
  const todoIndex = todos.findIndex((todo) => todo.todoID === todoID);

  if (todoIndex !== -1) {
    // Remove the todo from the client-side array
    todos.splice(todoIndex, 1);

    // Remove the todo from the UI
    todoList.removeChild(todoList.children[todoIndex]);

    // Update pending tasks and display todos by category
    updatePendingTasks();
    displayTodosByCategory(categorySelect.value);

    // Make the fetch call to delete the todo on the server
    fetchData(`/api/todo/${todoID}`, 'DELETE')
      .then(response => {
        // Handle the response if needed
        console.log(response);
      })
      .catch(error => console.error('Error deleting todo:', error));
  }
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
  // Filter out completed todos on the client side
  todos = todos.filter((todo) => !todo.todoComplete);

  // Remove completed todos from the UI
  const completedLiElements = Array.from(todoList.getElementsByClassName("done"));
  completedLiElements.forEach((li) => todoList.removeChild(li));

  // Update pending tasks
  updatePendingTasks();

  // Make the fetch call to clear completed todos on the server
  fetchData(`/api/todo/${todoID}`, 'DELETE')
    .then(response => {
      // Handle the response if needed
      console.log(response);
    })
    .catch(error => console.error('Error clearing completed todos:', error));
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

// Add new Category
document.querySelector("#addCategoryButton").addEventListener("click", async () => {
  const newCategory = prompt("Enter new category:");

  if (newCategory) {
    const existingCategory = categories.find(category => category === newCategory);

    if (!existingCategory) {
      // Make the fetch call to add the category on the server
      try {
        const response = await fetchData('/api/category', 'POST', { categoryName: newCategory });

        // Assuming the server responds with the newly created category
        const createdCategory = response;

        // Add the new category to the client-side array (only the category name)
        categories.push(createdCategory.categoryName);

        // Sort and update categories in the dropdown
        sortCategories();
      } catch (error) {
        console.error('Error adding category:', error);
      }
    } else {
      alert("Category already exists!");
    }
  }
});


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


  categorySelect.addEventListener("change", () => {
  displayTodosByCategory(categorySelect.value);
});

initializeTodos();