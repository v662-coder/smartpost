import PropTypes from "prop-types";
import { useDrag } from "react-dnd";
import { ListItem, ListItemText, IconButton, Box, Chip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

const PRIORITY_COLORS = {
  Low: "#8ecae6",
  Moderate: "#ffb703",
  High: "#fb8500",
  Critical: "#e63946",
};

const formatDate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (isNaN(date)) return null;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

const Task = ({ text, taskId, taskStatus, priority, deadline, handleDelete, handleEdit }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "TASK_ITEM",
    item: { taskId },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const dueLabel = formatDate(deadline);
  const isOverdue =
    deadline && taskStatus !== "completed" && new Date(deadline) < new Date(new Date().toDateString());

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.4 : 1 }}>
      <ListItem
        sx={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          mb: "8px",
          cursor: "grab",
          backgroundColor: "white",
          alignItems: "flex-start",
        }}
      >
        <DragIndicatorIcon sx={{ color: "#bbb", mr: 1, mt: "10px" }} fontSize="small" />
        <ListItemText
          primary={text}
          secondary={
            <Box sx={{ display: "flex", gap: "6px", flexWrap: "wrap", mt: "6px" }}>
              {priority && (
                <Chip
                  label={priority}
                  size="small"
                  sx={{
                    backgroundColor: PRIORITY_COLORS[priority] || "#ccc",
                    color: "white",
                    fontWeight: 600,
                  }}
                />
              )}
              {dueLabel && (
                <Chip
                  label={isOverdue ? `Overdue — ${dueLabel}` : `Due ${dueLabel}`}
                  size="small"
                  sx={{
                    backgroundColor: isOverdue ? "#e63946" : "#eee",
                    color: isOverdue ? "white" : "#444",
                  }}
                />
              )}
            </Box>
          }
        />

        <IconButton
          color="primary"
          onClick={() => handleEdit(taskId, taskStatus)}
          aria-label="Edit task"
        >
          <EditIcon />
        </IconButton>

        <IconButton
          color="secondary"
          onClick={() => handleDelete(taskId)}
          aria-label="Delete task"
        >
          <DeleteIcon />
        </IconButton>
      </ListItem>
    </div>
  );
};

Task.propTypes = {
  text: PropTypes.string.isRequired,
  taskId: PropTypes.string.isRequired,
  taskStatus: PropTypes.oneOf(["todo", "ongoing", "completed"]).isRequired,
  priority: PropTypes.string,
  deadline: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  handleDelete: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
};

export default Task;
