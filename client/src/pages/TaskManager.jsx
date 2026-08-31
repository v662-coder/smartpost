import { Grid, Box, List, Fab, Modal, Typography, Skeleton } from "@mui/material";
import TaskStatus from "../components/profile/task-management/TaskStatus";
import Task from "../components/profile/task-management/Task";

import AddIcon from "@mui/icons-material/Add";
import AddTask from "../components/profile/task-management/AddTask";
import EditTaskForm from "../components/profile/task-management/EditTaskForm";
import ConfirmDialog from "../components/common/ConfirmDialog";
import { useEffect, useState } from "react";
import axios from "axios";
import useThinkify from "../hooks/useThinkify";
import dayjs from "dayjs";
import { useForm, FormProvider } from "react-hook-form";
import Cookies from "js-cookie";

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${Cookies.get(import.meta.env.VITE_TOKEN_KEY)}`,
  },
});

const TaskManager = () => {
  const [allTask, setAllTask] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [todo, setTodo] = useState([]);
  const [ongoing, setOngoing] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const {
    setLoadingStatus,
    setAlertBoxOpenStatus,
    setAlertMessage,
    setAlertSeverity,
  } = useThinkify();
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const methods = useForm({
    defaultValues: {
      title: "",
      description: "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      setFetching(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_ENDPOINT}/tasks`,
          authHeaders()
        );
        if (response.data.status) {
          setAllTask(response.data.tasks);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setAlertBoxOpenStatus(true);
        setAlertSeverity("error");
        setAlertMessage(
          error.response?.data?.message || error.message || "Unable to load tasks."
        );
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setTodo(allTask.filter((task) => task.taskStatus === "todo"));
    setOngoing(allTask.filter((task) => task.taskStatus === "ongoing"));
    setCompleted(allTask.filter((task) => task.taskStatus === "completed"));
  }, [allTask]);

  // CREATE — only ever updates local state once the server has confirmed success,
  // and only ever inserts the real record (with its real _id) returned by the API.
  const onSubmit = async (data) => {
    try {
      setCreating(true);
      setLoadingStatus(true);
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/tasks`,
        { ...data, selectedDate },
        authHeaders()
      );

      if (response.data.status && response.data.task) {
        setAllTask((prevTasks) => [...prevTasks, response.data.task]);
        setOpenModal(false);
        methods.reset();
        setSelectedDate(dayjs());
      }

      setAlertBoxOpenStatus(true);
      setAlertSeverity(response.data.status ? "success" : "error");
      setAlertMessage(response.data.message);
    } catch (error) {
      console.error("Error creating task:", error);
      setAlertBoxOpenStatus(true);
      setAlertSeverity("error");
      setAlertMessage(
        error.response?.data?.message || error.message || "Unable to create task."
      );
    } finally {
      setCreating(false);
      setLoadingStatus(false);
    }
  };

  // Quick status change via drag-and-drop between columns.
  const handleDrop = async (taskId, status) => {
    const previous = allTask;
    try {
      setAllTask((prev) =>
        prev.map((task) => (task._id === taskId ? { ...task, taskStatus: status } : task))
      );
      const response = await axios.patch(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/tasks/${taskId}/status/${status}`,
        {},
        authHeaders()
      );
      if (!response.data.status) {
        setAllTask(previous); // roll back optimistic update since it failed
      }
      setAlertBoxOpenStatus(true);
      setAlertSeverity(response.data.status ? "success" : "error");
      setAlertMessage(response.data.message);
    } catch (error) {
      console.error("Error updating task status:", error);
      setAllTask(previous); // roll back
      setAlertBoxOpenStatus(true);
      setAlertSeverity("error");
      setAlertMessage(
        error.response?.data?.message || error.message || "Unable to update task status."
      );
    }
  };

  const confirmDelete = async () => {
    const taskId = pendingDeleteId;
    if (!taskId) return;
    try {
      setDeleting(true);
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/tasks/${taskId}`,
        authHeaders()
      );
      if (response.data.status) {
        setAllTask((prev) => prev.filter((item) => item._id !== taskId));
        setAlertBoxOpenStatus(true);
        setAlertSeverity("success");
        setAlertMessage(response.data.message);
      } else {
        setAlertBoxOpenStatus(true);
        setAlertSeverity("error");
        setAlertMessage(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      setAlertBoxOpenStatus(true);
      setAlertSeverity("error");
      setAlertMessage(
        error.response?.data?.message || error.message || "Unable to delete task."
      );
    } finally {
      setDeleting(false);
      setPendingDeleteId(null);
    }
  };

  // Full task edit (title/description/priority/due date/status) via the Edit Task modal.
  const handleEditSubmit = async (formData) => {
    if (!editingTask) return;
    try {
      setSavingEdit(true);
      const response = await axios.patch(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/tasks/${editingTask._id}`,
        {
          title: formData.title,
          description: formData.description,
          priority: formData.priority,
          taskStatus: formData.taskStatus,
          selectedDate: formData.selectedDate,
        },
        authHeaders()
      );

      if (response.data.status && response.data.task) {
        setAllTask((prev) =>
          prev.map((task) => (task._id === editingTask._id ? response.data.task : task))
        );
        setEditingTask(null);
      }

      setAlertBoxOpenStatus(true);
      setAlertSeverity(response.data.status ? "success" : "error");
      setAlertMessage(response.data.message);
    } catch (error) {
      console.error("Error updating task:", error);
      setAlertBoxOpenStatus(true);
      setAlertSeverity("error");
      setAlertMessage(
        error.response?.data?.message || error.message || "Unable to update task."
      );
    } finally {
      setSavingEdit(false);
    }
  };

  const columns = [
    { status: "todo", label: "To Do", items: todo, bg: "#59e3a7" },
    { status: "ongoing", label: "Ongoing", items: ongoing, bg: "#00844b" },
    { status: "completed", label: "Completed", items: completed, bg: "#28483a" },
  ];

  return (
    <>
      <Box sx={{ position: "relative" }}>
        <Grid container spacing={3}>
          {columns.map((col) => (
            <Grid item xs={12} md={4} key={col.status}>
              <Box sx={{ borderRadius: "5px", p: 2, backgroundColor: col.bg }}>
                <TaskStatus status={col.status} onDrop={handleDrop} count={col.items.length} />
              </Box>
            </Grid>
          ))}
        </Grid>

        <Grid container sx={{ minHeight: "70vh" }} spacing={3}>
          {columns.map((col) => (
            <Grid item xs={12} md={4} key={col.status}>
              {fetching ? (
                <Box>
                  {[1, 2].map((i) => (
                    <Skeleton key={i} variant="rounded" height={64} sx={{ mb: 1 }} />
                  ))}
                </Box>
              ) : col.items.length === 0 ? (
                <Typography color="text.secondary" textAlign="center" mt={2}>
                  {col.status === "todo" ? "You're all caught up!" : "Nothing here yet"}
                </Typography>
              ) : (
                <List>
                  {col.items.map((item) => (
                    <Task
                      key={item._id}
                      text={item.title}
                      taskId={item._id}
                      taskStatus={item.taskStatus}
                      priority={item.priority}
                      deadline={item.deadline}
                      handleDelete={(taskId) => setPendingDeleteId(taskId)}
                      handleEdit={() => setEditingTask(item)}
                    />
                  ))}
                </List>
              )}
            </Grid>
          ))}
        </Grid>

        <Fab
          aria-label="add task"
          sx={{
            position: "fixed",
            bottom: "50px",
            right: "70px",
            borderRadius: "50%",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            backgroundColor: "#59e3a7",
            color: "white",
            "&:hover": { backgroundColor: "#4bcf95" },
          }}
          onClick={() => setOpenModal(true)}
        >
          <AddIcon />
        </Fab>

        <Modal
          open={openModal}
          onClose={() => setOpenModal(false)}
          aria-labelledby="add-task-modal"
          sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <Box>
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)}>
                <AddTask
                  setSelectedDate={setSelectedDate}
                  selectedDate={selectedDate}
                  submitting={creating}
                />
              </form>
            </FormProvider>
          </Box>
        </Modal>

        <Modal
          open={!!editingTask}
          onClose={() => setEditingTask(null)}
          aria-labelledby="edit-task-modal"
          sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <Box>
            {editingTask && (
              <EditTaskForm
                task={editingTask}
                submitting={savingEdit}
                onSubmit={handleEditSubmit}
              />
            )}
          </Box>
        </Modal>

        <ConfirmDialog
          open={!!pendingDeleteId}
          title="Delete Task?"
          description="This action cannot be undone."
          loading={deleting}
          onConfirm={confirmDelete}
          onCancel={() => setPendingDeleteId(null)}
        />
      </Box>
    </>
  );
};

export default TaskManager;
