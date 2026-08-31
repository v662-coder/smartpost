import { Box, Button, TextField, IconButton, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useFormContext } from "react-hook-form";
import axios from "axios";
import useThinkify from "../../../hooks/useThinkify";
import Cookies from 'js-cookie'
import { useEffect, useState } from "react";

const AddProductForm = ({ editData, onSuccess, onCancel }) => {
  const {
    setLoadingStatus,
    setAlertBoxOpenStatus,
    setAlertMessage,
    setAlertSeverity,
  } = useThinkify();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useFormContext();
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    if (editData) {
      setValue("title", editData.title);
      setValue("price", editData.price);
      setValue("description", editData.description);
    }
  }, [editData]);

  // const onSubmit = async (data) => {
  //   const formPayload = new FormData();
  //   if (data.productimage && data.productimage[0] instanceof File) {
  //     formPayload.append("productimage", data.productimage[0]);
  //   }
  //   formPayload.append("title", data.title);
  //   formPayload.append("price", data.price);
  //   formPayload.append("description", data.description);

  //   try{
  //     setLoadingStatus(true);
  //     const response = await axios.post(
  //       `${import.meta.env.VITE_SERVER_ENDPOINT}/products`,
  //       formPayload,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${Cookies.get(import.meta.env.VITE_TOKEN_KEY)}`,
  //         },
  //       }
  //     );
  //     if (response.data.status) {
  //       reset();
  //     }
  //     setLoadingStatus(false);
  //     setAlertBoxOpenStatus(true);
  //     setAlertSeverity(response.data.status ? "success" : "error");
  //     setAlertMessage(response.data.message);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //     setLoadingStatus(false);
  //     setAlertBoxOpenStatus(true);
  //     setAlertSeverity("error");
  //     setAlertMessage("Something Went Wrong")
  //     error.response.data.message
  //       ? setAlertMessage(error.response.data.message)
  //       : setAlertMessage(error.message);
  //   } finally {
  //     setLoadingStatus(false);
  //   }

  // };
 const onSubmit = async (data) => {
    const formPayload = new FormData();

    if (data.productimage?.[0] instanceof File) {
      formPayload.append("productimage", data.productimage[0]);
    }

    formPayload.append("title", data.title);
    formPayload.append("price", data.price);
    formPayload.append("description", data.description);

    try {
      setSubmitting(true);
      setLoadingStatus(true);
      const url = editData
        ? `${import.meta.env.VITE_SERVER_ENDPOINT}/products/${editData._id}`
        : `${import.meta.env.VITE_SERVER_ENDPOINT}/products`;

      const method = editData ? "patch" : "post";

      const response = await axios({
        method,
        url,
        data: formPayload,
        headers: {
          Authorization: `Bearer ${Cookies.get(import.meta.env.VITE_TOKEN_KEY)}`,
        },
      });

      if (response.data.status) {
        reset();
        onSuccess && onSuccess(response.data.product);
      }

      setAlertBoxOpenStatus(true);
      setAlertSeverity(response.data.status ? "success" : "error");
      setAlertMessage(response.data.message);
    } catch (err) {
      console.error(err);
      setAlertBoxOpenStatus(true);
      setAlertSeverity("error");
      setAlertMessage(
        err?.response?.data?.message || err.message || "Unable to save product. Please try again."
      );
    } finally {
      setSubmitting(false);
      setLoadingStatus(false);
    }
  };

  const productImage = watch("productimage");

  let productImageUrl = null;
  if (productImage && productImage[0] && productImage[0] instanceof File) {
    try {
      productImageUrl = URL.createObjectURL(productImage[0]);
    } catch (error) {
      console.error("Error creating object URL:", error);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box>
          <TextField
            label="Product Title"
            placeholder="Enter Product Title"
            fullWidth
            sx={{ marginBottom: 1 }}
            {...register("title", {
              required: "Product title is required",
            })}
            error={!!errors.title}
            helperText={errors.title ? errors.title.message : ""}
          />
          <Box>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#59e3a7",
                marginBottom: 1,
              }}
              fullWidth
              onClick={() => {
                document.getElementById("productimage").click();
              }}
            >
              Upload Images
            </Button>
            <input
              id="productimage"
              style={{ display: "none" }}
              type="file"
              {...register("productimage", {
                required: editData ? false : "Product image is required",
                validate: {
                  validFileType: (value) => {
                    if (!value || value.length === 0) {
                      // No new file selected — fine when editing (keeps existing image).
                      return editData ? true : "Product image is required";
                    }
                    return (
                      ["image/jpeg", "image/png", "image/webp"].includes(value[0].type) ||
                      "Only JPEG, PNG, or WEBP files are allowed"
                    );
                  },
                },
              })}
            />
            {errors.productimage && (
              <Typography
                color="error"
                variant="body2"
                sx={{ marginBottom: 1 }}
              >
                {errors.productimage.message}
              </Typography>
            )}
          </Box>
          <Box>
            {productImageUrl && (
              <Box sx={{ position: "relative", display: "inline" }}>
                <img
                  src={productImageUrl}
                  alt="Product preview"
                  width="100"
                  height="50"
                  style={{ border: "1px solid #59e3a7", borderRadius: "5px", objectFit: "cover", display: "block" }}
                />
                <IconButton
                  aria-label="delete"
                  sx={{
                    position: "absolute",
                    right: "-10px",
                    zIndex: "500",
                    bottom: "0",
                    color: "red",
                  }}
                  onClick={() => {
                    setValue("productimage", null);
                    document.getElementById("productimage").value = ""; // Clear the file input
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            )}
          </Box>

          <TextField
            label="Product Price"
            placeholder="Enter Product Price"
            fullWidth
            {...register("price", {
              required: "Product price is required",
            })}
            error={!!errors.price}
            helperText={errors.price ? errors.price.message : ""}
          />

          <TextField
            label="Description"
            multiline
            rows={4}
            variant="outlined"
            fullWidth
            sx={{ marginY: 1 }}
            {...register("description", {
              required: "Description is required",
            })}
            error={!!errors.description}
            helperText={errors.description ? errors.description.message : ""}
          />

          <Button
            variant="contained"
            fullWidth
            disabled={submitting}
            sx={{ backgroundColor: "#59e3a7" }}
            type="submit"
          >
             {submitting
               ? editData
                 ? "Saving..."
                 : "Adding..."
               : editData
               ? "Update Product"
               : "Add Product"}
          </Button>
          {editData && (
            <Button
              type="button"
              fullWidth
              onClick={onCancel}
              disabled={submitting}
              variant="outlined"
              sx={{ mt: 1, color: "#1b2e35", borderColor: "#ccc" }}
            >
              Cancel
            </Button>
          )}
        </Box>
      </form>
    </>
  );
};

export default AddProductForm;
