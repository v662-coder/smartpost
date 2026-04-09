
const { METHOD_NOT_ALLOWED, NOT_FOUND } = require("./http-status.constant");

const OPERATION = {
  ADD: "added successfully",
  UPDATE: "updated successfully",
  DELETE: "deleted successfully",
  REMOVED: "removed successfully",
  CHANGE_STATUS: "status changed successfully",
  IMPORT: "imported successfully",
  EXISTS: "already exists",
  NOT_EXISTS: "not exists",
  SENT: "sent successfully",
  UPLOAD: "uploaded successfully",
  SAVE: "saved successfully",
  COMPLETED: "completed successfully",
  CREATED: "created successfully",
  COPY: "copied successfully",
  NOT_FOUND: "not found",
  INVALID: "Invalid request data",
  DOWNLOAD: "download successfully",
  DEACTIVATED: "deactivated successfully",
  ACTIVATED: "activated successfully"
};

const Toasty = {
  SERVER: {
    INTERNAL_SERVER_ERROR: "Something went wrong.",
  },
};

module.exports = Toasty;
