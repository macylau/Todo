const express = require('express')
const app = express()
const port = 3000

const bodyParser = require('body-parser')

app.use(bodyParser.json());
// in latest body-parser use like below.
app.use(bodyParser.urlencoded({extended: true}));

let todos = [
    {
      todoID: 0,
      todoText: "Get birthday present for Macy",
      todoComplete: false,
      category: "Chore",
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
    }
  
];

let categories = ['General', 'Work', 'School'];

// Get all todos
app.get('/api/todos', (req, res) => {
    res.send(todos)
})

// Post a new todo
app.post('/todos', (req, res) => {
    const newTodo = req.body;
    todos.push(newTodo);
    res.json(newTodo);
  });

// Put (update) a todo
app.put('/todos/:id', (req, res) => {
    const todoID = parseInt(req.params.id);
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
app.delete('/todos/:id', (req, res) => {
    const todoID = parseInt(req.params.id);
  
    // Remove the todo with the specified ID
    todos = todos.filter((todo) => todo.todoID !== todoID);
  
    res.json({ success: true });
  });
  
  // Get all todos for a category
  app.get('/todos/category/:category', (req, res) => {
    const category = req.params.category;
    const categoryTodos = todos.filter((todo) => todo.category === category);
    res.json(categoryTodos);
  });
  
  // Get all categories
  app.get('/categories', (req, res) => {
    res.json(categories);
  });

  // Post a new category
app.post('/categories', (req, res) => {
    const newCategory = req.body;
    categories.push(newCategory);
    res.json(newCategory);
  });
  
  // Put (update) a category
  app.put('/categories/:oldCategory', (req, res) => {
    const oldCategory = req.params.oldCategory;
    const newCategory = req.body;
  
    // Find the index of the category
    const categoryIndex = categories.findIndex((category) => category === oldCategory);
  
    if (categoryIndex !== -1) {
      categories[categoryIndex] = newCategory;
      res.json(categories[categoryIndex]);
    } else {
      res.status(404).json({ error: 'Category not found' });
    }
  });
  
  // Delete category
  app.delete('/categories/:category', (req, res) => {
    const category = req.params.category;
  
    // Remove category
    categories = categories.filter((cat) => cat !== category);
  
    res.json({ success: true });
  });
  
  // Start the server
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });