const express = require('express');
const app = express();
const port = 3000;

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("client"));

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

let categories = [
  {
    categoryId: 0,
    categoryName: "General",
  },
  {
    categoryId: 1,
    categoryName: "School",
  },
  {
    categoryId: 2,
    categoryName: "Work",
  },
];

// Get all todos
app.get('/api/todos', (req, res) => {
    res.send(todos)
})

let nextTodoID = 3;
// Post a new todo
app.post('/api/todo', (req, res) => {
  const newTodo = {
    todoID: nextTodoID++, // Assign a unique ID and increment the counter
    ...req.body,
  };

  todos.push(newTodo);
  res.json(newTodo);
});

// Put (update) a todo
app.put('/api/todo/:todoID', (req, res) => {
    const todoID = parseInt(req.params.todoID);
    const updatedTodo = req.body;
  
    // Find the index of the todo with the specified ID
    const todoIndex = todos.findIndex((todo) => todo.todoID === todoID);
  
    // Update the todo if found
    if (todoIndex !== -1) {
      todos[todoIndex] = { ...todos[todoIndex], ...updatedTodo };
      res.json(todos[todoIndex]);
    } else {
      res.status(404).json({ error: 'Todo not found' });
    }
  });


// Delete a todo
app.delete('/api/todo/:todoID', (req, res) => {
    const todoID = parseInt(req.params.todoID);
  
    // Remove the todo with the specified ID
    todos = todos.filter((todo) => todo.todoID !== todoID);
  
    res.json({ success: true });
  });
  
  // Get all todos for a category
  app.get('/api/todos/category/:categoryId', (req, res) => {
    const categoryId = parseInt(req.params.categoryId); // Use parseInt to convert id to a number
    const categoryTodos = todos.filter((todo) => todo.category === categoryId);
    res.json(categoryTodos);
});
  
  // Get all categories
  app.get('/api/categories', (req, res) => {
    res.json(categories);
  });

  let nextCategoryId = 3;
  // Post a new category
  app.post('/api/category', (req, res) => {
    const newCategory = {
      categoryId: nextCategoryId++,
      ...req.body,
    };
    categories.push(newCategory);
    res.json(newCategory);
  });
  
  // Put (update) a category
  app.put('/api/category/:categoryId', (req, res) => {
    const categoryId = parseInt(req.params.categoryId);
    const updatedCategory = req.body;
  
    // Find the index of the category with the specified ID
    const categoryIndex = categories.findIndex((category) => category.categoryId === categoryId);
  
    // Update the category if found
    if (categoryIndex !== -1) {
      categories[categoryIndex] = { ...categories[categoryIndex], ...updatedCategory };
      res.json(categories[categoryIndex]);
    } else {
      res.status(404).json({ error: 'Category not found' });
    }
  });
  
// Delete category
app.delete('/api/category/:categoryId', (req, res) => {
  const categoryId = parseInt(req.params.categoryId);

  // Log the received category ID
  console.log('Received category ID:', categoryId);

  // Remove the category with the specified ID
  categories = categories.filter((category) => category.categoryId !== categoryId);

  res.json({ success: true });
});

  // Start the server
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });