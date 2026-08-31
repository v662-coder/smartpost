import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Skeleton,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import useThinkify from "../hooks/useThinkify";
import axios from "axios";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import { Add, Delete, Edit, Link as LinkIcon } from "@mui/icons-material";
import AddProduct from "./AddProduct";
import ConfirmDialog from "../components/common/ConfirmDialog";

const MyProduct = () => {
  const [data, setData] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [editProduct, setEditProduct] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const {
    setLoadingStatus,
    setAlertBoxOpenStatus,
    setAlertMessage,
    setAlertSeverity,
  } = useThinkify();

  useEffect(() => {
    const fetchData = async () => {
      setFetching(true);
      setLoadingStatus(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_ENDPOINT}/products`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get(
                import.meta.env.VITE_TOKEN_KEY
              )}`,
            },
          }
        );
        if (response.data.status) {
          setData(response.data.products);
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
          error.response?.data?.message || error.message || "Unable to load products."
        );
      } finally {
        setFetching(false);
        setLoadingStatus(false);
      }
    };
    fetchData();
  }, []);

  const confirmDelete = async () => {
    const productId = pendingDeleteId;
    if (!productId) return;
    try {
      setDeleting(true);
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/products/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(
              import.meta.env.VITE_TOKEN_KEY
            )}`,
          },
        }
      );
      if (response.data.status) {
        setData((prev) => prev.filter((item) => item._id !== productId));
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
        error.response?.data?.message || error.message || "Unable to delete product."
      );
    } finally {
      setDeleting(false);
      setPendingDeleteId(null);
    }
  };

  const handleEdit = (product) => {
    setIsCreating(false);
    setEditProduct(product);
  };

  const handleCopyLink = async (productId) => {
    const url = `${window.location.origin}/products/${productId}`;
    try {
      await navigator.clipboard.writeText(url);
      setAlertBoxOpenStatus(true);
      setAlertSeverity("success");
      setAlertMessage("Public link copied — anyone with this link can view this product.");
    } catch {
      setAlertBoxOpenStatus(true);
      setAlertSeverity("error");
      setAlertMessage("Couldn't copy the link. You can copy it manually: " + url);
    }
  };

  const showForm = isCreating || !!editProduct;

  return (
    <Box
      sx={{
        height: "88vh",
        overflowY: "scroll",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h5" fontWeight={700} color="#1b2e35">
          My Products
        </Typography>
        {!showForm && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setIsCreating(true)}
            sx={{ backgroundColor: "#59e3a7", "&:hover": { backgroundColor: "#4bcf95" } }}
          >
            Add Product
          </Button>
        )}
      </Box>

      {showForm && (
        <Box mb={3}>
          <AddProduct
            editData={editProduct}
            onCancel={() => {
              setEditProduct(null);
              setIsCreating(false);
            }}
            onSuccess={(savedProduct) => {
              if (editProduct) {
                if (savedProduct && savedProduct._id) {
                  setData((prev) =>
                    prev.map((p) => (p._id === savedProduct._id ? savedProduct : p))
                  );
                }
                setEditProduct(null);
              } else {
                if (savedProduct && savedProduct._id) {
                  setData((prev) => [savedProduct, ...prev]);
                }
                setIsCreating(false);
              }
            }}
          />
        </Box>
      )}

      {fetching ? (
        <Grid container spacing={3}>
          {[1, 2, 3].map((i) => (
            <Grid item key={i} xs={12} sm={6} md={4}>
              <Skeleton variant="rounded" height={220} />
            </Grid>
          ))}
        </Grid>
      ) : data.length === 0 && !showForm ? (
        <Box textAlign="center" mt={5}>
          <Typography variant="h5" color="#1b2e35" fontWeight={700}>
            No products yet
          </Typography>
          <Typography color="text.secondary" mt={1} mb={2}>
            Add your first product.
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setIsCreating(true)}
            sx={{ backgroundColor: "#59e3a7", "&:hover": { backgroundColor: "#4bcf95" } }}
          >
            Add a Product
          </Button>
        </Box>
      ) : data.length > 0 ? (
        <Grid container spacing={3} paddingBottom={5}>
          {data.map((product) => (
            <Grid item key={product._id} xs={12} sm={6} md={4}>
              <Card>
                <Box sx={{ position: "relative", cursor: "pointer" }}>
                  <CardMedia
                    component="img"
                    height="140"
                    sx={{ objectFit: "cover" }}
                    image={`${import.meta.env.VITE_SERVER_ENDPOINT}/productimage/${product.image}`}
                    alt={product.title}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 10,
                      right: 10,
                      display: "flex",
                      justifyContent: "flex-end",
                      flexDirection: "row",
                    }}
                  >
                    <IconButton
                      sx={{
                        color: "#1b7a52",
                        backgroundColor: "white",
                        marginRight: "5px",
                        "&:hover": { backgroundColor: "white" },
                      }}
                      onClick={() => handleCopyLink(product._id)}
                      aria-label="Copy public link to share this product"
                    >
                      <LinkIcon />
                    </IconButton>
                    <IconButton
                      sx={{
                        color: "green",
                        backgroundColor: "white",
                        marginRight: "5px",
                        "&:hover": { backgroundColor: "white" },
                      }}
                      onClick={() => handleEdit(product)}
                      aria-label="Edit product"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      sx={{
                        color: "red",
                        backgroundColor: "white",
                        "&:hover": { backgroundColor: "white" },
                      }}
                      onClick={() => setPendingDeleteId(product._id)}
                      aria-label="Delete product"
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>
                <Link to={`/products/${product._id}`} style={{ textDecoration: "none" }}>
                  <CardContent sx={{ paddingBottom: "12px !important" }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6" color="#59e3a7">
                        {product.title}
                      </Typography>
                      <Typography variant="body1" fontWeight="bold" color="#59e3a7">
                        ${product.price}
                      </Typography>
                    </Box>
                  </CardContent>
                </Link>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : null}

      <ConfirmDialog
        open={!!pendingDeleteId}
        title="Delete Product?"
        description="This action cannot be undone."
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDeleteId(null)}
      />
    </Box>
  );
};

export default MyProduct;
