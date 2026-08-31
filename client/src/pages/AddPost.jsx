import {
  Box,
  TextField,
  Button,
  InputBase,
  Chip,
  Typography,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

import SimpleMdeReact from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import useThinkify from "../hooks/useThinkify";
import axios from "axios";
import Cookies from "js-cookie";
import PostPreviewModal from "../components/post/PostPreviewModal";

const AddPost = ({ editData, onSuccess, onCancel }) => {
  const {
    setLoadingStatus,
    setAlertBoxOpenStatus,
    setAlertMessage,
    setAlertSeverity,
  } = useThinkify();
  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
    clearErrors,
    reset,
    setValue,
    watch,
  } = useForm();
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState([]);
  const [description, setDescription] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const title = watch("title");

  useEffect(() => {
    if (editData) {
      setValue("title", editData.title);
      setTags(editData.tags || []);
      setDescription(editData.description || "");
    }
  }, [editData, setValue]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && tag.trim()) {
      event.preventDefault();
      if (!tags.includes(tag.trim())) {
        setTags([...tags, tag.trim()]);
      }
      setTag("");
      clearErrors("tags");
    }
  };

  const handleRemoveTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    if (tags.length === 0) {
      setError("tags", { message: "At least one tag is required" });
      return;
    }

    if (!description.trim()) {
      setError("description", { message: "Description is required" });
      return;
    }

    try {
      setSubmitting(true);
      setLoadingStatus(true);

      const url = editData
        ? `${import.meta.env.VITE_SERVER_ENDPOINT}/posts/${editData._id}`
        : `${import.meta.env.VITE_SERVER_ENDPOINT}/posts`;

      const method = editData ? "patch" : "post";

      const response = await axios({
        method,
        url,
        data: {
          title: data.title,
          tags,
          description: description.trim(),
        },
        headers: {
          Authorization: `Bearer ${Cookies.get(
            import.meta.env.VITE_TOKEN_KEY
          )}`,
        },
      });

      if (response.data.status) {
        reset();
        setTags([]);
        setDescription("");
        onSuccess && onSuccess(response.data.post);
      }

      setAlertBoxOpenStatus(true);
      setAlertSeverity(response.data.status ? "success" : "error");
      setAlertMessage(response.data.message);
    } catch (error) {
      setAlertBoxOpenStatus(true);
      setAlertSeverity("error");
      setAlertMessage(
        error?.response?.data?.message || error.message || "Unable to save post. Please try again."
      );
    } finally {
      setSubmitting(false);
      setLoadingStatus(false);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Typography fontSize={24} fontWeight="bold">
            {editData ? "Edit Post" : "New Post"}
          </Typography>
          <Button
            type="button"
            variant="outlined"
            startIcon={<VisibilityIcon />}
            onClick={() => setPreviewOpen(true)}
            sx={{
              borderColor: "#59e3a7",
              color: "#1b7a52",
              "&:hover": { borderColor: "#59e3a7", backgroundColor: "#f0fdf6" },
            }}
          >
            Preview
          </Button>
        </Box>

        <Box sx={{ width: "100%" }}>
          <Typography fontSize={18} fontWeight="bold">
            Title
          </Typography>
          <TextField
            fullWidth
            placeholder="Enter Post Title"
            {...register("title", { required: "Title is required" })}
            error={!!errors.title}
            helperText={errors.title?.message}
          />

          <Typography mt={2} fontSize={18} fontWeight="bold">
            Tags
          </Typography>
          <Box
            sx={{
              border: "1px solid #ccc",
              p: 1,
              borderRadius: 1,
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            {tags.map((t, i) => (
              <Chip key={i} label={t} onDelete={() => handleRemoveTag(i)} />
            ))}
            <InputBase
              placeholder="Press Enter to add a tag"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </Box>
          {errors.tags && (
            <Typography color="error" variant="body2">
              {errors.tags.message}
            </Typography>
          )}

          <Typography mt={2} fontSize={18} fontWeight="bold">
            Content
          </Typography>
          <SimpleMdeReact value={description} onChange={setDescription} />
          {errors.description && (
            <Typography color="error" variant="body2">
              {errors.description.message}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
          <Button
            type="submit"
            variant="contained"
            disabled={submitting}
            sx={{
              flex: 1,
              color: "white",
              backgroundColor: "#59e3a7",
              "&:hover": { backgroundColor: "#4bcf95" },
            }}
          >
            {submitting
              ? editData
                ? "Saving..."
                : "Publishing..."
              : editData
              ? "Save Changes"
              : "Publish Post"}
          </Button>
          {editData && (
            <Button
              type="button"
              onClick={onCancel}
              disabled={submitting}
              variant="outlined"
              sx={{ color: "#1b2e35", borderColor: "#ccc" }}
            >
              Cancel
            </Button>
          )}
        </Box>
      </form>

      <PostPreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title={title}
        tags={tags}
        description={description}
      />
    </Box>
  );
};

export default AddPost;
