const express = require("express");
const userauth = require("../middlewares/auth");

const taskRouter = express.Router();

const Task = require("../model/tasks");

taskRouter.post("/createtasks", userauth, async (req, res) => {
  try {
    const { title, description, priority } = req.body;

    const newTask = new Task({
      title,
      description,
      priority,
      userId: req.user._id,
    });

    if (newTask) {
      await newTask.save();
      res.json({ message: "Task added successfully", data: newTask });
    } else {
      res.status(404).send("not a valid details");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

taskRouter.get("/viewtasks", userauth, async (req, res) => {
  try {
    const userId = req.user._id;

    const tasks = await Task.find({ userId: userId });

    if (tasks.length === 0) {
      return res.status(404).json({ message: "No task to do" });
    }

    res.json({ message: "Tasks  list:", data: tasks });
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

taskRouter.patch("/markcomplete/:taskId", userauth, async (req, res) => {
  try {
    const { taskId } = req.params;

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { status: "completed" },
      { new: true }
    );

    res.json({ message: "Task is complete", data: updatedTask });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

taskRouter.delete("/deletetask/:taskId", userauth, async (req, res) => {
  try {
    const { taskId } = req.params;

    const deletedTask = await Task.findByIdAndDelete(taskId);

    res.json({ message: "Task  has  been deleted", data: deletedTask });
  } catch (error) {
    res.status(400).send(error.message);
  }
});


taskRouter.get("/filtertasks/:status", userauth, async (req, res) => {
    try {
      const { status } = req.params; 
      const userId = req.user._id; 
  
      let filter = { userId }; 
  
      if (status !== 'all') {
        filter.status = status; 
      }
  
      const tasks = await Task.find(filter);
      res.json({ message: "tasks:", data: tasks });
  
    } catch (error) {
      res.status(400).send(error.message);
    }
  });
    

module.exports = taskRouter;
