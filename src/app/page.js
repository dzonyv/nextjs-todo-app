// Enable client-side rendering
"use client";

// Import necessary components and libraries
import Head from 'next/head';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrashIcon } from '@heroicons/react/24/solid';

// Define the Home component
export default function Home() {
  // State to store tasks
  const [tasks, setTasks] = useState([]);
  // State to store the current input value
  const [taskInput, setTaskInput] = useState('');
  // State to track completed tasks by their index
  const [completedTasks, setCompletedTasks] = useState([]);
  // State to track the index of the task being edited
  const [editIndex, setEditIndex] = useState(null);
  // State to store the input value of the task being edited
  const [editInput, setEditInput] = useState('');

  // Function to add a new task
  const handleAddTask = () => {
    // Check if input is not empty
    if (taskInput.trim()) {
      // Add task to the list and clear input
      setTasks([...tasks, taskInput.trim()]);
      setTaskInput('');
    }
  };

  // Function to remove a task
  const handleRemoveTask = (indexToRemove) => {
    // Remove from both tasks and completedTasks
    setTasks(tasks.filter((_, index) => index !== indexToRemove));
    setCompletedTasks(completedTasks.filter((i) => i !== indexToRemove));
  };

  // Function to toggle task completion
  const toggleTaskCompletion = (index) => {
    // Toggle completion status
    setCompletedTasks((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  // Function to handle editing a task
  const handleEditTask = (index) => {
    setEditIndex(index);
    setEditInput(tasks[index]);
  };

  // Function to save edited task
  const saveEditTask = (index) => {
    const updatedTasks = tasks.map((task, i) => (i === index ? editInput : task));
    setTasks(updatedTasks);
    setEditIndex(null);
    setEditInput('');
  };

  return (
    // Container for the entire page
    <div className="min-h-screen bg-primary p-4 flex items-center justify-center">
      <Head>
        <title>To-Do App</title>
        <meta name="description" content="A simple to-do app built with Next.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Main content container */}
      <main className="max-w-md w-full bg-detail p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-primary text-center">To-Do List</h1>

        {/* Input field and add task button */}
        <div className="mb-4">
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-md text-primary focus:outline-none focus:ring-2 focus:ring-secondary"
            placeholder="Add a new task"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)} // Update state on input change
          />
          <button
            className="mt-4 w-full bg-secondary text-detail p-3 rounded-md hover:bg-red-600 transition-colors"
            onClick={handleAddTask} // Add task on click
          >
            Add Task
          </button>
        </div>

        {/* Task list */}
        <ul className="list-disc pl-5">
          {tasks
            .map((task, index) => ({ task, index })) // Map tasks with their index
            .sort((a, b) => completedTasks.includes(a.index) - completedTasks.includes(b.index)) // Sort tasks by completion
            .map(({ task, index }) => (
              // Animated list item
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className={`mb-2 flex justify-between items-center ${completedTasks.includes(index) ? 'line-through italic text-secondary' : 'text-primary'}`}
              >
                {/* Task completion toggle button */}
                <span
                  className={`w-5 h-5 mr-3 rounded-full border-2 cursor-pointer ${completedTasks.includes(index) ? 'bg-secondary border-secondary' : 'border-primary'} transition-colors hover:bg-secondary hover:border-secondary`}
                  onClick={() => toggleTaskCompletion(index)} // Toggle completion on click
                ></span>
                {editIndex === index ? (
                  <input
                    type="text"
                    value={editInput}
                    onChange={(e) => setEditInput(e.target.value)}
                    onBlur={() => saveEditTask(index)}
                    onKeyDown={(e) => e.key === 'Enter' && saveEditTask(index)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                ) : (
                  <span onDoubleClick={() => handleEditTask(index)}>{task}</span>
                )}
                <TrashIcon
                  className="w-5 h-5 text-secondary cursor-pointer hover:text-red-600"
                  onClick={() => handleRemoveTask(index)}
                />
              </motion.li>
            ))}
        </ul>
      </main>
    </div>
  );
}
