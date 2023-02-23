import React from "react";
import Router from "next/router";
import { addDoc, collection } from "firebase/firestore";
import { firebaseDatabase, firebaseStorage } from "../../lib/firebase";
import { Backdrop, CircularProgress } from "@mui/material";

const ProductAdd = () => {
  // firebase management
  const productsCollectionRef = collection(firebaseDatabase, "products");
  // get product id
  const createProductId = async () => {
    try {
      const productRef = await addDoc(productsCollectionRef, {
        status: "draft",
      });
      const createdProductId = productRef.id;
      // setProductId(productRef.id);
      if (productRef.id) {
        Router.push(`/products/edit/${productRef.id}`);
      }
      console.log("product id created", createdProductId);
    } catch (err) {
      console.log("product id not created!", err);
    }
  };
  // on load create a product id
  React.useEffect(() => {
    // create product id
    createProductId();
  }, []);

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={true}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default ProductAdd;
