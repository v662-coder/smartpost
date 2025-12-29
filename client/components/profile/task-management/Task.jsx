import PropTypes from "prop-types";
import { useDrag } from "react-dnd";
import { ListItem, ListItemText, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const Task = ({ text, taskId, taskStatus, handleDelete, handleEdit }) => {
  const [, drag] = useDrag({
    type: "TASK_ITEM",
    item: { taskId },
  });

  return (
    <div ref={drag}>
      <ListItem
        sx={{
          border: "1px solid #ccc",
          borderRadius: "5px",
          mb: "5px",
          cursor: "pointer",
        }}
      >
        <ListItemText
          primary={text}
          secondary={`Status: ${taskStatus}`}
        />

        <IconButton
          color="primary"
          onClick={() => handleEdit(taskId, taskStatus)}
        >
          <EditIcon />
        </IconButton>

        <IconButton
          color="secondary"
          onClick={() => handleDelete(taskId)}
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
  handleDelete: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
};

export default Task;