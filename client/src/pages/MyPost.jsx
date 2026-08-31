import { Box, Typography, Button, Skeleton } from "@mui/material";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import LinkIcon from "@mui/icons-material/Link";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import AddPost from "./AddPost";
import ConfirmDialog from "../components/common/ConfirmDialog";

import useThinkify from "../hooks/useThinkify";

const MyPost = () => {
  const [data, setData] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [editPost, setEditPost] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const {
    setLoadingStatus,
    setAlertBoxOpenStatus,
    setAlertMessage,
    setAlertSeverity,
  } = useThinkify();

  const handleCopyLink = async (postId, visibility) => {
    const url = `${window.location.origin}/posts/${postId}`;
    try {
      await navigator.clipboard.writeText(url);
      setAlertBoxOpenStatus(true);
      setAlertSeverity("success");
      setAlertMessage(
        visibility === "private"
          ? "Link copied. Note: this post is set to Private, so others won't be able to view it until you make it Public."
          : "Public link copied — anyone with this link can view, react to, and comment on this post."
      );
    } catch {
      setAlertBoxOpenStatus(true);
      setAlertSeverity("error");
      setAlertMessage("Couldn't copy the link. You can copy it manually: " + url);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setFetching(true);
      setLoadingStatus(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_ENDPOINT}/posts`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get(
                import.meta.env.VITE_TOKEN_KEY
              )}`,
            },
          }
        );
        if (response.data.status) {
          setData(response.data.posts);
        } else {
          setAlertBoxOpenStatus(true);
          setAlertSeverity("error");
          setAlertMessage(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setAlertBoxOpenStatus(true);
        setAlertSeverity("error");
        setAlertMessage(
          error.response?.data?.message || error.message || "Unable to load posts."
        );
      } finally {
        setFetching(false);
        setLoadingStatus(false);
      }
    };
    fetchData();
  }, []);

  const handleEdit = (post) => {
    setIsCreating(false);
    setEditPost(post);
  };

  const confirmDelete = async () => {
    const postId = pendingDeleteId;
    if (!postId) return;
    try {
      setDeleting(true);
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/posts/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(
              import.meta.env.VITE_TOKEN_KEY
            )}`,
          },
        }
      );
      if (response.data.status) {
        setData((prev) => prev.filter((item) => item._id !== postId));
        setAlertBoxOpenStatus(true);
        setAlertSeverity("success");
        setAlertMessage(response.data.message);
      } else {
        setAlertBoxOpenStatus(true);
        setAlertSeverity("error");
        setAlertMessage(response.data.message);
      }
    } catch (error) {
      setAlertBoxOpenStatus(true);
      setAlertSeverity("error");
      setAlertMessage(
        error.response?.data?.message || error.message || "Unable to delete post."
      );
    } finally {
      setDeleting(false);
      setPendingDeleteId(null);
    }
  };

  const handleVisibility = async (postId) => {
    try {
      setLoadingStatus(true);
      const response = await axios.patch(
        `${
          import.meta.env.VITE_SERVER_ENDPOINT
        }/posts/change-visibility/${postId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(
              import.meta.env.VITE_TOKEN_KEY
            )}`,
          },
        }
      );
      if (response.data.status) {
        setData((prevData) =>
          prevData.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  visibility:
                    post.visibility === "public" ? "private" : "public",
                }
              : post
          )
        );
        setAlertBoxOpenStatus(true);
        setAlertSeverity("success");
        setAlertMessage(response.data.message);
      } else {
        setAlertBoxOpenStatus(true);
        setAlertSeverity("error");
        setAlertMessage(response.data.message);
      }
    } catch (error) {
      setAlertBoxOpenStatus(true);
      setAlertSeverity("error");
      setAlertMessage(
        error.response?.data?.message || error.message || "Unable to update visibility."
      );
    } finally {
      setLoadingStatus(false);
    }
  };

  const showForm = isCreating || !!editPost;

  return (
    <Box
      sx={{
        width: "100%",
        height: "620px",
        overflowY: "scroll",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h5" fontWeight={700} color="#1b2e35">
          My Posts
        </Typography>
        {!showForm && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsCreating(true)}
            sx={{
              backgroundColor: "#59e3a7",
              "&:hover": { backgroundColor: "#4bcf95" },
            }}
          >
            Add Post
          </Button>
        )}
      </Box>

      {showForm && (
        <Box mb={3}>
          <AddPost
            editData={editPost}
            onCancel={() => {
              setEditPost(null);
              setIsCreating(false);
            }}
            onSuccess={(savedPost) => {
              if (editPost) {
                if (savedPost && savedPost._id) {
                  setData((prevData) =>
                    prevData.map((post) =>
                      post._id === savedPost._id ? savedPost : post
                    )
                  );
                }
                setEditPost(null);
              } else {
                if (savedPost && savedPost._id) {
                  setData((prevData) => [savedPost, ...prevData]);
                }
                setIsCreating(false);
              }
            }}
          />
        </Box>
      )}

      {fetching ? (
        <Box>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rounded" height={52} sx={{ mb: 1 }} />
          ))}
        </Box>
      ) : data.length === 0 && !showForm ? (
        <Box textAlign="center" mt={5}>
          <Typography variant="h5" color="#1b2e35" fontWeight={700}>
            No posts yet
          </Typography>
          <Typography color="text.secondary" mt={1} mb={2}>
            Create your first post to get started.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsCreating(true)}
            sx={{ backgroundColor: "#59e3a7", "&:hover": { backgroundColor: "#4bcf95" } }}
          >
            Create a Post
          </Button>
        </Box>
      ) : data.length > 0 ? (
        <TableContainer component={Paper} sx={{ width: "100%" }}>
          <Table aria-label="posts table">
            <TableHead sx={{ backgroundColor: "#59e3a7", position: "sticky" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", color: "white" }}>#</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "white" }}>Title</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "white", textAlign: "center" }}>
                  Reactions
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "white", textAlign: "center" }}>
                  Comments
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "white", textAlign: "center" }}>
                  Visibility
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "white" }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item, index) => (
                <TableRow
                  key={item._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Link style={{ color: "inherit" }} to={`/posts/${item._id}`}>
                      {item.title}
                    </Link>
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {item.reactions?.length ? item.reactions.length : "0"}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {item.comments?.length ? item.comments.length : "0"}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {item.visibility === "private" ? (
                      <VisibilityOffIcon
                        sx={{ cursor: "pointer" }}
                        titleAccess="Private — click to make public"
                        onClick={() => handleVisibility(item._id)}
                      />
                    ) : (
                      <VisibilityIcon
                        sx={{ cursor: "pointer" }}
                        titleAccess="Public — click to make private"
                        onClick={() => handleVisibility(item._id)}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
                      <LinkIcon
                        sx={{
                          border: "1px solid lightgray",
                          borderRadius: "5px",
                          padding: "5px",
                          fontSize: "30px",
                          cursor: "pointer",
                        }}
                        titleAccess="Copy public link to share this post"
                        onClick={() => handleCopyLink(item._id, item.visibility)}
                      />
                      <EditIcon
                        sx={{
                          border: "1px solid lightgray",
                          borderRadius: "5px",
                          padding: "5px",
                          fontSize: "30px",
                          cursor: "pointer",
                        }}
                        titleAccess="Edit post"
                        onClick={() => handleEdit(item)}
                      />
                      <DeleteIcon
                        sx={{
                          border: "1px solid lightgray",
                          borderRadius: "5px",
                          padding: "5px",
                          fontSize: "30px",
                          cursor: "pointer",
                        }}
                        titleAccess="Delete post"
                        onClick={() => setPendingDeleteId(item._id)}
                      />
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : null}

      <ConfirmDialog
        open={!!pendingDeleteId}
        title="Delete Post?"
        description="This action cannot be undone."
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDeleteId(null)}
      />
    </Box>
  );
};

export default MyPost;
