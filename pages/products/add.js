import React from "react";
import { BaseCard } from "../../src/components";
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
  updateDoc,
} from "firebase/firestore";
import { firebaseDatabase, firebaseStorage } from "../../lib/firebase";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import { toast } from "react-hot-toast";

const ProductAdd = () => {
  // product details
  const [productName, setProductName] = React.useState();
  const [price, setPrice] = React.useState();
  const [quantity, setQuantity] = React.useState();
  const [description, setDescription] = React.useState();
  // image management
  const [images, setImages] = React.useState([]);
  const [thumbnail, setThumbnail] = React.useState();
  const maxNumber = 69;
  const onChangeThumbnail = (imageList, addUpdateIndex) => {
    // data for submit
    console.log(imageList, addUpdateIndex);
    setImages(imageList);
  };
  const onMakeThumbnail = (index) => {
    setThumbnail({
      data_url: images[index],
      index: index,
    });
  };

  // size management
  const [size, setSize] = React.useState([]);
  const [sizeOptions, setSizeOptions] = React.useState([
    { label: "Small", value: "sm", id: 1 },
    { label: "Medium", className: "md", id: 2 },
    { label: "Large", className: "lg", id: 3 },
    { label: "Extra Large", className: "xl", id: 3 },
  ]);
  const onChangeSize = (val) => {
    setSize(val);
  };
  // colors management
  const [colors, setColors] = React.useState([]);
  const [colorVal, setColorVal] = React.useState();
  const [colorOptions, setColorOptions] = React.useState([
    "Black",
    "White",
    "SkyBlue",
  ]);
  const onChangeColor = (val) => {
    setColors(val);
  };
  // firebase management
  const productsCollectionRef = collection(firebaseDatabase, "products");
  // product upload
  const [isLoading, setLoading] = React.useState(false);
  const [isUploaded, setUploaded] = React.useState(false);

  const onUploadProduct = async () => {
    // set loading true
    setLoading(true);
    // uploaded images list
    const uploadedImages = [];
    const uploadImage = images?.map(
      (imageItem, index) =>
        new Promise(async (resolve, reject) => {
          // compress image
          const imageCompressOption = {
            maxSizeMB: 0.25,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
          };
          try {
            const compressImage = await imageCompression(
              imageItem.file,
              imageCompressOption
            );

            // upload image
            const metadata = {
              contentType: "image/jpeg",
            };
            const storageRef = ref(
              firebaseStorage,
              `product_thumbnail_${productName.replace(/ /g, "_")}_${index}.png`
            );
            const uploadTask = uploadBytesResumable(
              storageRef,
              compressImage,
              metadata
            );
            uploadTask.on(
              "state_changed",
              (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress =
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log("Upload is " + progress + "% done");

                switch (snapshot.state) {
                  case "paused":
                    console.log("Upload is paused");
                    break;
                  case "running":
                    console.log("Upload is running");
                    break;
                }
              },
              (error) => {
                switch (error.code) {
                  case "storage/unauthorized":
                    resolve(null);
                    break;
                  case "storage/canceled":
                    resolve(null);
                    break;
                  case "storage/unknown":
                    resolve(null);
                    break;
                }
              },
              () => {
                // Upload completed successfully, now we can get the download URL
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                  console.log("File available at", downloadURL);
                  uploadedImages.push(downloadURL);
                  resolve(true);
                });
              }
            );
          } catch (error) {
            console.log(error);
            setLoading(false);
            toast.error("Something went wrong!");
          }
        })
    );

    //need to call this function after loop is done
    Promise.all(uploadImage).then(async () => {
      const productData = {
        name: productName,
        price: price,
        qty: quantity,
        description: description,
        colors: colorOptions,
        size: sizeOptions,
        images: uploadedImages,
        thumbnail: thumbnail ? thumbnail.index : 0,
      };
      try {
        const productRef = await addDoc(productsCollectionRef, productData);
        const createdProductId = productRef.id;

        setLoading(false);
        toast.success("Product has been created.");
        setUploaded(true);
        Router.push(`/products`);
      } catch (e) {
        console.error("Error adding document: ", e);
        setLoading(false);
        toast.error("Something went wrong!", e);
      }
    });
  };

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
            onChange={onChangeThumbnail}
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
                  {imageList.map((image, index) => (
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
                        {thumbnail && thumbnail.index === index && (
                          <Tooltip title="Selected Thumbnail">
                            <IconButton onClick={() => onMakeThumbnail(index)}>
                              <VrpanoIcon
                                sx={{
                                  fontSize: "3rem",
                                  color: "#00c292",
                                  background: "#fff",
                                  padding: "0.5rem",
                                  borderRadius: "5px",
                                }}
                                title="Make it thumbnail"
                              />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Make it thumbnail">
                          <IconButton onClick={() => onMakeThumbnail(index)}>
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
                        <Tooltip title="Remove image">
                          <IconButton onClick={() => onImageRemove(index)}>
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
                        src={image.data_url}
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
              setProductName(e.target.value);
            }}
            value={productName}
          />
          <TextField
            label="Price"
            variant="outlined"
            onChange={(e) => {
              setPrice(e.target.value);
            }}
            value={price}
          />
          <TextField
            label="Quantity"
            variant="outlined"
            onChange={(e) => {
              setQuantity(e.target.value);
            }}
            value={quantity}
          />
          <TextField
            label="Product Description"
            multiline
            rows={4}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
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
          />
        </Stack>
        <br />
        <Stack spacing={2} direction="row">
          <Button
            variant="contained"
            mt={2}
            onClick={() => {
              onUploadProduct();
            }}
          >
            {isLoading && "Uploading..."}
            {isUploaded && "Uploaded"}

            {!isUploaded && !isLoading && "Upload"}
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

export default ProductAdd;
