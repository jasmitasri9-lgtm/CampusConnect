
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Task = require('./Task');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully!'))
  .catch((error) => console.error('MongoDB connection error:', error.message));

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'CampusConnect backend is running successfully!' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'CampusConnect API is working!' });
});

// GET: Fetch all tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tasks.' });
  }
});

// POST: Create a task
app.post('/api/tasks', async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create task.', error: error.message });
  }
});

// PUT: Update a task
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    res.json(task);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update task.', error: error.message });
  }
});

// DELETE: Delete a task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    res.json({ message: 'Task deleted successfully.' });
  } catch (error) {
    res.status(400).json({ message: 'Failed to delete task.', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`CampusConnect server running at http://localhost:${PORT}`);
});
