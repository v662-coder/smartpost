import PropTypes from "prop-types";
import { useState } from "react";
import {
  Dialog,
  Box,
  Typography,
  Chip,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DesktopWindowsOutlinedIcon from "@mui/icons-material/DesktopWindowsOutlined";
import PhoneIphoneOutlinedIcon from "@mui/icons-material/PhoneIphoneOutlined";
import { marked } from "marked";
import DOMPurify from "dompurify";

/**
 * Full-screen "how it will actually look when published" preview.
 * Renders the CURRENT (possibly unsaved) editor state that's passed in via props,
 * never a stale copy fetched separately from the server.
 */
const PostPreviewModal = ({ open, onClose, title, tags, description, authorName }) => {
  const [device, setDevice] = useState("desktop");

  const renderMarkdown = () => {
    const html = marked(description || "");
    return { __html: DOMPurify.sanitize(html) };
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen
      aria-labelledby="post-preview-title"
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 3,
          py: 1.5,
          borderBottom: "1px solid #e0e0e0",
          position: "sticky",
          top: 0,
          backgroundColor: "#fff",
          zIndex: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography id="post-preview-title" fontWeight={700} fontSize={18}>
            Preview
          </Typography>
          <ToggleButtonGroup
            size="small"
            value={device}
            exclusive
            onChange={(e, value) => value && setDevice(value)}
            aria-label="preview device"
          >
            <ToggleButton value="desktop" aria-label="desktop preview">
              <DesktopWindowsOutlinedIcon fontSize="small" sx={{ mr: 0.5 }} />
              Desktop
            </ToggleButton>
            <ToggleButton value="mobile" aria-label="mobile preview">
              <PhoneIphoneOutlinedIcon fontSize="small" sx={{ mr: 0.5 }} />
              Mobile
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <IconButton onClick={onClose} aria-label="Close preview and go back to editor">
          <CloseIcon />
        </IconButton>
      </Box>

      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          backgroundColor: "#f5f7f6",
          display: "flex",
          justifyContent: "center",
          py: 4,
          px: 2,
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: device === "mobile" ? "420px" : "760px",
            backgroundColor: "#fff",
            borderRadius: "10px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
            p: device === "mobile" ? 3 : 5,
            transition: "max-width 0.2s ease",
          }}
        >
          {!title && !description ? (
            <Typography color="text.secondary">
              Nothing to preview yet — start writing your post to see it here.
            </Typography>
          ) : (
            <>
              <Typography
                variant="h1"
                sx={{
                  fontSize: device === "mobile" ? "26px" : "36px",
                  fontWeight: 800,
                  color: "#1b2e35",
                  wordBreak: "break-word",
                }}
              >
                {title || "Untitled Post"}
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1.5, flexWrap: "wrap" }}>
                {authorName && (
                  <Typography variant="body2" color="text.secondary">
                    By {authorName} ·{" "}
                  </Typography>
                )}
                <Typography variant="body2" color="text.secondary">
                  {new Date().toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Typography>
              </Box>

              {tags && tags.length > 0 && (
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 2 }}>
                  {tags.map((t, i) => (
                    <Chip key={i} label={t} size="small" sx={{ backgroundColor: "#e6faf1", color: "#1b7a52" }} />
                  ))}
                </Box>
              )}

              <Divider sx={{ my: 3 }} />

              <Box
                sx={{
                  fontSize: device === "mobile" ? "15px" : "17px",
                  lineHeight: 1.75,
                  color: "#2c3e3a",
                  "& img": { maxWidth: "100%", borderRadius: "6px" },
                  "& a": { color: "#1b7a52" },
                }}
                dangerouslySetInnerHTML={renderMarkdown()}
              />
            </>
          )}
        </Box>
      </Box>
    </Dialog>
  );
};

PostPreviewModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
  description: PropTypes.string,
  authorName: PropTypes.string,
};

export default PostPreviewModal;
