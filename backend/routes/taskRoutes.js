const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth');

// 1. GET ALL TASKS: Fetches tasks belonging only to the logged-in user
router.get('/', auth, async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.userId });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 2. CREATE A TASK
router.post('/', auth, async (req, res) => {
    const task = new Task({
        title: req.body.title,
        category: req.body.category || 'General', // Now saves the category!
        userId: req.user.userId
    });

    try {
        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 4. UPDATE A TASK (Toggle Complete)
router.put('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: "Task not found" });
        if (task.userId.toString() !== req.user.userId) return res.status(401).json({ message: "Not authorized" });

        task.completed = !task.completed; // Flip the status
        await task.save();
        res.json(task);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 3. DELETE A TASK
router.delete('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: "Task not found" });

        // Make sure the user owns the task they are trying to delete
        if (task.userId.toString() !== req.user.userId) {
            return res.status(401).json({ message: "Not authorized" });
        }

        await task.deleteOne();
        res.json({ message: "Task removed" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;