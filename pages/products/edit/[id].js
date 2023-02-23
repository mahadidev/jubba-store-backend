import React from "react";
import { BaseCard } from "../../../src/components";
import imageCompression from "browser-image-compression";
import {
  Grid,
  Stack,
  TextField,
  Button,
  Typography,
  Autocomplete,
  IconButton,
  Tooltip,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { Box } from "@mui/system";
import Chip from "@mui/material/Chip";
import ImageIcon from "@mui/icons-material/Image";
import ImageUploading from "react-images-uploading";
import PhotoSizeSelectLargeIcon from "@mui/icons-material/PhotoSizeSelectLarge";
import ClearIcon from "@mui/icons-material/Clear";
import VrpanoIcon from "@mui/icons-material/Vrpano";
import Router from "next/router";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { firebaseDatabase, firebaseStorage } from "../../../lib/firebase";
import { toast } from "react-hot-toast";
import { imageUploader } from "../../../lib";
import { deleteObject, ref } from "firebase/storage";
import { useRouter } from "next/router";

const ProductEdit = () => {
  // product details
  const [productId, setProductId] = React.useState();
  const [name, setName] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [qty, setQty] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [imagesUrl, setImagesUrl] = React.useState([]);
  const [thumbnailUrl, setThumbnailUrl] = React.useState(null);
  const [isLoading, setLoading] = React.useState(false);
  // images management
  const [images, setImages] = React.useState([]);
  const maxNumber = 69;
  const onChangeImage = async (imageList, addUpdateIndex) => {
    // uploaded images url
    const uploadedImagesUrl = [];
    // get uploaded image
    const uploadImage = imageList?.map(
      (image, index) =>
        new Promise(async (resolve, reject) => {
          imageUploader({
            image: image.file,
            imageName: `product_thumbnail_${productId}__${
              index * Math.floor(Math.random() * 1000000000)
            }__.png`,
            onUploaded: (uploadedImageUrl) => {
              uploadedImagesUrl.push(uploadedImageUrl);
              resolve(true);
            },
            onError: (error) => {
              console.log("image is not uploaded!", error);
              resolve(false);
            },
          });
        })
    );
    // will be called this after finished the loop.
    Promise.all(uploadImage).then(async () => {
      setImagesUrl((prevImages) => [...prevImages, ...uploadedImagesUrl]);
    });
  };
  const onRemoveImage = async (url) => {
    const imageName = url.split("product_thumbnail_")[1];
    imageName = imageName.split(".png")[0];
    imageName = `product_thumbnail_${imageName}.png`;
    const newImagesUrl = imagesUrl.filter((imageUrl) => imageUrl !== url);
    setImagesUrl(newImagesUrl);

    // delete image from firebase
    const firebaseImageRef = ref(firebaseStorage, imageName);
    await deleteObject(firebaseImageRef)
      .then(async () => {
        console.log("Image deleted successfully");
      })
      .catch((error) => {
        console.log("Image is not deleted!", error);
      });
  };
  const onMakeThumbnail = async (url) => {
    setThumbnailUrl(url);
  };
  // size management
  const [size, setSize] = React.useState([]);
  const [sizeOptions] = React.useState([
    { label: "Small", value: "sm", id: 1 },
    { label: "Medium", value: "md", id: 2 },
    { label: "Large", value: "lg", id: 3 },
    { label: "Extra Large", value: "xl", id: 3 },
  ]);
  const onChangeSize = (val) => {
    setSize(val);
  };
  // colors management
  const [colors, setColors] = React.useState([]);
  const [colorOptions] = React.useState(["Black", "White", "SkyBlue"]);
  const onChangeColor = (val) => {
    setColors(val);
  };
  // get product id
  const setProductData = async (id) => {
    // set product id
    setProductId(id);
    // product ref
    const productRef = doc(firebaseDatabase, "products", id);
    // get product data
    const selectedProduct = await getDoc(productRef);
    selectedProduct = selectedProduct.data();
    // set product data
    setName(selectedProduct.name ? selectedProduct.name : "");
    setPrice(selectedProduct.price ? selectedProduct.price : "");
    setQty(selectedProduct.qty ? selectedProduct.qty : "");
    setDescription(
      selectedProduct.description ? selectedProduct.description : ""
    );
    setColors(selectedProduct.colors ? selectedProduct.colors : []);
    setSize(selectedProduct.size ? selectedProduct.size : []);
    setImagesUrl(selectedProduct.images ? selectedProduct.images : []);
    setThumbnailUrl(
      selectedProduct.thumbnail ? selectedProduct.thumbnail : null
    );
  };
  // update product
  const onUpdate = async () => {
    // set loading true
    setLoading(true);
    // product ref
    const productRef = doc(firebaseDatabase, "products", productId);
    await updateDoc(productRef, {
      name: name ? name : "",
      price: price ? price : 0,
      qty: qty ? qty : 0,
      description: description ? description : "",
      images: imagesUrl,
      thumbnail: thumbnailUrl,
      size: size ? size : [],
      colors: colors ? colors : [],
    })
      .then(() => {
        setLoading(false);
        toast.success("Product has been updated.");
      })
      .catch((error) => {
        console.log("Product is not updated.", error);
      });
  };
  // on load create a product id
  const router = useRouter();
  const { id } = router.query;
  React.useEffect(() => {
    // get product id
    if (router.isReady) {
      setProductData(id);
    }

    // ask before reload
    const unloadCallback = (event) => {
      event.preventDefault();
      event.returnValue = "";
      return "";
    };

    window.addEventListener("beforeunload", unloadCallback);
    return () => window.removeEventListener("beforeunload", unloadCallback);
  }, [router.isReady]);

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <BaseCard title="Enter product details">
        <Stack spacing={3}>
          <ImageUploading
            multiple
            value={images}
            onChange={onChangeImage}
            maxNumber={maxNumber}
            dataURLKey="data_url"
            acceptType={["jpg"]}
          >
            {({
              imageList,
              onImageUpload,
              onImageRemoveAll,
              onImageUpdate,
              onImageRemove,
              isDragging,
              dragProps,
            }) => (
              // write your building UI
              <div className="upload__image-wrapper">
                <Box
                  onClick={onImageUpload}
                  {...dragProps}
                  sx={{
                    width: "100%",
                    maxWidth: "500px",
                    margin: "0 auto",
                    padding: "3rem",
                    border: "1px solid rgba(0, 0, 0, 0.23)",
                    borderStyle: "dashed",
                    cursor: "pointer",
                  }}
                >
                  <ImageIcon
                    sx={{
                      fontSize: "5rem",
                      color: "#03c9d7",
                      margin: "auto",
                      display: "block",
                    }}
                  />
                  <Typography
                    fontWeight={"bold"}
                    color="#b9b9b9"
                    textAlign={"center"}
                  >
                    Drag & Drop
                  </Typography>
                  <Typography
                    fontWeight={"bold"}
                    color="#b9b9b9"
                    textAlign={"center"}
                    display="flex"
                    gap="0.3rem"
                    justifyContent={"center"}
                  >
                    or
                    <Typography fontWeight={"bold"} color="#03c9d7">
                      Browser
                    </Typography>
                  </Typography>
                </Box>
                <Grid container spacing={2} mt={2}>
                  {imagesUrl.map((image, index) => (
                    <Grid
                      item
                      xs={6}
                      md={4}
                      lg={3}
                      xl={2}
                      key={index}
                      sx={{
                        width: "100%",
                        height: {
                          sm: "300px",
                          xl: "300px",
                        },
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 10,
                          left: "16px",
                          right: 0,
                          width: "calc(100% - 16px)",
                          display: "flex",
                          padding: "5px",
                          justifyContent: "center",
                        }}
                      >
                        {thumbnailUrl && thumbnailUrl === image ? (
                          ""
                        ) : (
                          <Tooltip title="Make it thumbnail">
                            <IconButton onClick={() => onMakeThumbnail(image)}>
                              <PhotoSizeSelectLargeIcon
                                sx={{
                                  fontSize: "3rem",
                                  color: "#03c9d7",
                                  background: "#fff",
                                  padding: "0.5rem",
                                  borderRadius: "5px",
                                }}
                                title="Make it thumbnail"
                              />
                            </IconButton>
                          </Tooltip>
                        )}

                        <Tooltip title="Remove image">
                          <IconButton onClick={() => onRemoveImage(image)}>
                            <ClearIcon
                              sx={{
                                fontSize: "3rem",
                                color: "#e46a76",
                                background: "#fff",
                                padding: "0.5rem",
                                borderRadius: "5px",
                              }}
                              title="Remove Image"
                            />
                          </IconButton>
                        </Tooltip>
                      </Box>
                      <img
                        src={image}
                        alt="Product Thumbnail"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          objectPosition: "top",
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </div>
            )}
          </ImageUploading>

          <TextField
            label="Product Name"
            variant="outlined"
            onChange={(e) => {
              setName(e.target.value);
            }}
            defaultValue={name}
            value={name}
          />
          <TextField
            label="Price"
            variant="outlined"
            onChange={(e) => {
              setPrice(e.target.value);
            }}
            defaultValue={price}
            value={price}
          />
          <TextField
            label="Quantity"
            variant="outlined"
            onChange={(e) => {
              setQty(e.target.value);
            }}
            defaultValue={qty}
            value={qty}
          />
          <TextField
            label="Product Description"
            multiline
            rows={4}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            defaultValue={description}
            value={description}
          />
          <Autocomplete
            multiple
            options={sizeOptions.map((option) => option)}
            freeSolo
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={option.label}
                  {...getTagProps({ index })}
                />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} label="Select Size" />
            )}
            onChange={(event, newValue) => {
              onChangeSize(newValue);
            }}
            value={size}
          />
          <Autocomplete
            multiple
            options={colorOptions.map((option) => option)}
            freeSolo
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={option}
                  {...getTagProps({ index })}
                />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} label="Select color" />
            )}
            onChange={(event, newValue) => {
              onChangeColor(newValue);
            }}
            value={colors}
          />
        </Stack>
        <br />
        <Stack spacing={2} direction="row">
          <Button
            variant="contained"
            mt={2}
            onClick={() => {
              onUpdate();
            }}
          >
            {isLoading ? "Updating..." : "Update"}
          </Button>
          <Button
            variant="contained"
            color="error"
            mt={2}
            onClick={() => {
              Router.push(`/products`);
            }}
          >
            Cancel
          </Button>
        </Stack>
      </BaseCard>
    </>
  );
};

export default ProductEdit;
