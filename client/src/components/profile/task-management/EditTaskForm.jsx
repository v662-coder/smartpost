import { useEffect } from "react";
import PropTypes from "prop-types";
import {
  Box,
  TextField,
  Button,
  Typography,
  ButtonGroup,
  FormHelperText,
  MenuItem,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { useForm, Controller } from "react-hook-form";
import dayjs from "dayjs";

const PRIORITIES = ["Low", "Moderate", "High", "Critical"];
const STATUSES = [
  { value: "todo", label: "To Do" },
  { value: "ongoing", label: "Ongoing" },
  { value: "completed", label: "Completed" },
];

const EditTaskForm = ({ task, submitting, onSubmit }) => {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: task?.title || "",
      description: task?.description || "",
      priority: task?.priority || "",
      taskStatus: task?.taskStatus || "todo",
      selectedDate: task?.deadline ? dayjs(task.deadline) : dayjs(),
    },
  });

  useEffect(() => {
    if (task) {
      reset({
        title: task.title || "",
        description: task.description || "",
        priority: task.priority || "",
        taskStatus: task.taskStatus || "todo",
        selectedDate: task.deadline ? dayjs(task.deadline) : dayjs(),
      });
    }
  }, [task, reset]);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        backgroundColor: "#1b2e35",
        width: "min(595px, 92vw)",
        borderRadius: "8px",
        border: "2px solid #59e3a7",
        boxShadow: 24,
        p: 4,
      }}
    >
      <Typography variant="h6" sx={{ color: "#59e3a7", mb: 2 }}>
        Edit Task
      </Typography>
      <TextField
        fullWidth
        variant="outlined"
        label="Task Title"
        sx={fieldSx}
        {...register("title", { required: "Task title is required" })}
        error={!!errors.title}
        helperText={errors.title?.message}
      />

      <TextField
        fullWidth
        multiline
        rows={3}
        variant="outlined"
        label="Task Description"
        sx={{ ...fieldSx, mt: 2 }}
        {...register("description", { required: "Task description is required" })}
        error={!!errors.description}
        helperText={errors.description?.message}
      />

      <Box sx={{ display: "flex", gap: 2, mt: 2, flexWrap: "wrap" }}>
        <Box sx={{ flex: 1, minWidth: "180px" }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Controller
              name="selectedDate"
              control={control}
              rules={{ required: "Due date is required" }}
              render={({ field }) => (
                <DesktopDatePicker
                  label="Due Date"
                  value={field.value}
                  onChange={(newDate) => setValue("selectedDate", newDate)}
                  sx={fieldSx}
                />
              )}
            />
          </LocalizationProvider>
        </Box>
        <TextField
          select
          label="Status"
          defaultValue={task?.taskStatus || "todo"}
          sx={{ flex: 1, minWidth: "150px", ...fieldSx }}
          {...register("taskStatus")}
        >
          {STATUSES.map((s) => (
            <MenuItem key={s.value} value={s.value}>
              {s.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Typography variant="body2" sx={{ mt: 2, mb: 1, color: "#59e3a7" }}>
        Priority
      </Typography>
      <Controller
        name="priority"
        control={control}
        rules={{ required: "Please select a priority" }}
        render={({ field }) => (
          <>
            <ButtonGroup variant="outlined" fullWidth>
              {PRIORITIES.map((p) => (
                <Button
                  key={p}
                  type="button"
                  onClick={() => setValue("priority", p)}
                  sx={{
                    backgroundColor: field.value === p ? "#59e3a7" : "transparent",
                    border: "1px solid #59e3a7",
                    color: field.value === p ? "white" : "#59e3a7",
                    "&:hover": {
                      border: "1px solid #59e3a7",
                      backgroundColor: "#59e3a7",
                      color: "white",
                    },
                  }}
                >
                  {p}
                </Button>
              ))}
            </ButtonGroup>
            {errors.priority && (
              <FormHelperText error>{errors.priority.message}</FormHelperText>
            )}
          </>
        )}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={submitting}
        sx={{
          mt: 3,
          color: "white",
          backgroundColor: "#59e3a7",
          "&:hover": { backgroundColor: "#4bcf95" },
        }}
      >
        {submitting ? "Saving..." : "Save Changes"}
      </Button>
    </Box>
  );
};

const fieldSx = {
  input: { color: "#59e3a7" },
  textarea: { color: "#59e3a7" },
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "#59e3a7" },
    "&:hover fieldset": { borderColor: "#59e3a7" },
    "&.Mui-focused fieldset": { borderColor: "#59e3a7" },
  },
  "& .MuiInputLabel-root": { color: "#59e3a7" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#59e3a7" },
  "& .MuiSvgIcon-root": { color: "#59e3a7" },
};

EditTaskForm.propTypes = {
  task: PropTypes.object,
  submitting: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
};

export default EditTaskForm;
