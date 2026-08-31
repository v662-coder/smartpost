import { Box, Typography } from "@mui/material";

import AddProductFrom from "../components/profile/product/AddProductFrom";
import PreviewProduct from "../components/profile/product/PreviewProduct";

import { useForm, FormProvider } from "react-hook-form";

const AddProduct = ({ editData, onSuccess, onCancel }) => {
  const methods = useForm({
    defaultValues: editData || {},
  });

  const existingImageUrl = editData?.image
    ? `${import.meta.env.VITE_SERVER_ENDPOINT}/productimage/${editData.image}`
    : null;

  return (
    <FormProvider {...methods}>
      <Typography fontSize={24} fontWeight="bold" mb={1}>
        {editData ? "Edit Product" : "New Product"}
      </Typography>
      <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
        <Box sx={{ flex: 1, minWidth: "280px" }}>
          <AddProductFrom
            editData={editData}
            onSuccess={onSuccess}
            onCancel={onCancel}
          />
        </Box>
        <Box sx={{ flex: 1, minWidth: "280px" }}>
          <PreviewProduct existingImageUrl={existingImageUrl} />
        </Box>
      </Box>
    </FormProvider>
  );
};

export default AddProduct;
