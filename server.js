const express = require('express');
const app = express();
const port = 3000;

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("client"));

let todos = [
  {
    id: 0,
    todoText: "Get birthday present for Macy",
    todoComplete: false,
    category: 0,
  },
  {
    id: 1,
    todoText: "Take toilet break",
    todoComplete: false,
    category: 2,
  },
  {
    id: 2,
    todoText: "Prank call classmate",
    todoComplete: false,
    category: 1,
  },
];

let categories = [
  {
    id: 0,
    categoryName: "General",
  },
  {
    id: 1,
    categoryName: "School",
  },
  {
    id: 2,
    categoryName: "Work",
  },
];

// Get all todos
app.get('/api/todos', (req, res) => {
    res.send(todos)
})

// Post a new todo
app.post('/api/todo', (req, res) => {
    const newTodo = req.body;
    todos.push(newTodo);
    res.json(newTodo);
  });

// Put (update) a todo
app.put('/api/todo/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const updatedTodo = req.body;
  
    // Find the index of the todo with the specified ID
    const todoIndex = todos.findIndex((todo) => todo.id === id);
  
    // Update the todo if found
    if (todoIndex !== -1) {
      todos[todoIndex] = { ...todos[todoIndex], ...updatedTodo };
      res.json(todos[todoIndex]);
    } else {
      res.status(404).json({ error: 'Todo not found' });
    }
  });


// Delete a todo
app.delete('/api/todo/:id', (req, res) => {
    const id = parseInt(req.params.id);
  
    // Remove the todo with the specified ID
    todos = todos.filter((todo) => todo.id !== id);
  
    res.json({ success: true });
  });
  
  // Get all todos for a category
  app.get('/api/todos/category/:id', (req, res) => {
    const categoryId = parseInt(req.params.id); // Use parseInt to convert id to a number
    const categoryTodos = todos.filter((todo) => todo.category === categoryId);
    res.json(categoryTodos);
});
  
  // Get all categories
  app.get('/api/categories', (req, res) => {
    res.json(categories);
  });

  // Post a new category
app.post('/api/category', (req, res) => {
    const newCategory = req.body;
    categories.push(newCategory);
    res.json(newCategory);
  });
  
  // Put (update) a category
  app.put('/api/category/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const updatedCategory = req.body;
  
    // Find the index of the category with the specified ID
    const categoryIndex = categories.findIndex((category) => category.id === id);
  
    // Update the category if found
    if (categoryIndex !== -1) {
      categories[categoryIndex] = { ...categories[categoryIndex], ...updatedCategory };
      res.json(categories[categoryIndex]);
    } else {
      res.status(404).json({ error: 'Category not found' });
    }
  });
  
  // Delete category
  app.delete('/api/category/:id', (req, res) => {
    const id = parseInt(req.params.id);
  
    // Remove the todo with the specified ID
    categories = categories.filter((category) => category.id !== id);
  
    res.json({ success: true });
  });
  
  // Start the server
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });