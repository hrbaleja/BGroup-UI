
import PropTypes from 'prop-types';
import { useMemo, useState, useEffect, } from 'react';

import Card from '@mui/material/Card';
// import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import CardHeader from '@mui/material/CardHeader';

import TaskService from 'src/services/overview/TaskService';

import Iconify from 'src/components/iconify';

import TaskItem from './TaskItem';
import TaskForm from './TaskForm';

export default function AnalyticsTasks({ title, ...other }) {
  const [tasks, setTasks] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const fetchedTasks = await TaskService.getTasks();
      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const pendingTasksCount = useMemo(() => tasks.filter(task => !task.status).length, [tasks]);
  const subheader = `You have ${pendingTasksCount} pending tasks`;

  const handleAddTask = async (taskData) => {
    if (!taskData || !taskData.title) {
      console.error('Invalid task data');
      return;
    }

    try {
      await TaskService.createTask(taskData);
      fetchTasks();
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleCompleteTask = async (taskId, status) => {
    try {
      await TaskService.updateTask(taskId, { status });
      fetchTasks();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleUpdateTask = async (taskData) => {

    try {
      await TaskService.updateTask(taskData.id, taskData);
      fetchTasks();
      setEditingTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await TaskService.deleteTask(taskId);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleOpenForm = (task = null) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setEditingTask(null);
    setIsFormOpen(false);
  };
  return (
    <Card {...other}>
      <CardHeader
        title={title}
        subheader={subheader}
        action={
          <Button color="inherit" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => handleOpenForm()}>
            New
          </Button>
        }
      />

      {tasks.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          onEdit={() => handleOpenForm(task, task._id)}
          onDelete={() => handleDeleteTask(task._id)}
          onComplete={handleCompleteTask}
        />
      ))}

      <TaskForm
        open={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={editingTask ? handleUpdateTask : handleAddTask}
        initialData={editingTask}
      />
    </Card>
  );
}

AnalyticsTasks.propTypes = {
  subheader: PropTypes.string,
  title: PropTypes.string,
};