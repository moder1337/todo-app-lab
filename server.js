const express = require('express');
const app = express();
const PORT = 3000;

app.set('view engine', 'pug');
app.set('views', './views');

// ОБОВ’ЯЗКОВО — для коректного читання JSON!
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let todoId = 1;
let todoList = [];

// ==== API ====

// Показати всі задачі (GET)
app.get('/api/list', (req, res) => {
  res.json(todoList);
});

// Додати нову задачу (POST)
app.post('/api/list', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Task name missing' });
  const task = { id: todoId++, name, done: false };
  todoList.push(task);
  res.status(201).json(task);
});

// Змінити статус done (PUT)
app.put('/api/list/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const task = todoList.find(item => item.id === id);
  if (!task) return res.status(404).json({ error: 'Not found' });
  task.done = !task.done;
  res.json(task);
});

// Видалити задачу (DELETE)
app.delete('/api/list/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = todoList.findIndex(item => item.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  todoList.splice(idx, 1);
  res.status(204).end();
});

// ==== Веб-інтерфейс ====

// Додати задачу через форму на сторінці
app.post('/add', (req, res) => {
  const { name } = req.body;
  if (!name) return res.redirect('/todos');
  const task = { id: todoId++, name, done: false };
  todoList.push(task);
  res.redirect('/todos');
});

// Відобразити всі задачі у браузері
app.get('/todos', (req, res) => {
  res.render('todos', { todoList });
});

app.listen(PORT, () => console.log('Go to: http://localhost:' + PORT + '/todos'));
