const express = require('express')
const app = express()
const port = 3000

const bodyParser = require('body-parser')

app.use(bodyParser.json());
// in latest body-parser use like below.
app.use(bodyParser.urlencoded({extended: true}));

let todos = [
    {
        id: 0,
        todo: 'do this thing',
        done: false
    },
    {
        id: 1,
        todo: 'do that thing',
        done: true
    },
    {
        id: 2,
        todo: 'do those things',
        done: false
    },
]

app.get('/api/todos', (req, res) => {
    res.send(todos)
})

//add new todo
app.post('/api/todo', (req, res) => {
    todos.push({
        id: todos.length + 1,
        todo: req.body.todo,
        done: false
    })
})