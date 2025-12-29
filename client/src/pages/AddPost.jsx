import {
  Box,
  TextField,
  Button,
  InputBase,
  Chip,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

import SimpleMdeReact from "react-simplemde-editor";
import { marked } from "marked";
import DOMPurify from "dompurify";
import "easymde/dist/easymde.min.css";
import useThinkify from "../hooks/useThinkify";
import axios from "axios";
import Cookies from "js-cookie";

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
  } = useForm();
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState([]);
  const [description, setDescription] = useState("");


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


  const renderMarkdown = () => {
    const html = marked(description);
    return { __html: DOMPurify.sanitize(html) };
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
      debugger
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
        error?.response?.data?.message || error.message
      );
    } finally {
      setLoadingStatus(false);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ display: "flex", gap: "15px" }}>
          {/* LEFT */}
          <Box sx={{ flex: 1 }}>
            <Typography fontSize={22} fontWeight="bold">Title</Typography>
            <TextField
              fullWidth
              placeholder="Enter Post Title"
              {...register("title", { required: "Title is required" })}
              error={!!errors.title}
              helperText={errors.title?.message}
            />

            <Typography mt={2} fontSize={22} fontWeight="bold">Tags</Typography>
            <Box sx={{ border: "1px solid #ccc", p: 1, borderRadius: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
              {tags.map((t, i) => (
                <Chip key={i} label={t} onDelete={() => handleRemoveTag(i)} />
              ))}
              <InputBase
                placeholder="Press Enter"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </Box>
            {errors.tags && <Typography color="error">{errors.tags.message}</Typography>}

            <Box mt={2} dangerouslySetInnerHTML={renderMarkdown()} />
          </Box>

          {/* RIGHT */}
          <Box sx={{ flex: 1 }}>
            <Typography fontSize={22} fontWeight="bold">Description</Typography>
            <SimpleMdeReact value={description} onChange={setDescription} />
            {errors.description && (
              <Typography color="error">{errors.description.message}</Typography>
            )}
          </Box>
        </Box>
         <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 2,
              color: "white",
              backgroundColor: "#59e3a7",
              "&:hover": { backgroundColor: "#59e3a7" },
            }}
          >
              {editData ? "Update Post" : "Post"}
          </Button>
          {editData && (
          <Button onClick={onCancel}  sx={{
              mt: 2,
              color: "white",
              backgroundColor: "#59e3a7",
              "&:hover": { backgroundColor: "#59e3a7" },
            }}>
            Cancel Edit
          </Button>
        )}
      </form>
    </Box>
  );
};

export default AddPost;
