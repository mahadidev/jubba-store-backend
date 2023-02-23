import React from "react";
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Autocomplete,
  Stack,
  TextField,
} from "@mui/material";
import Link from "next/link";
import BaseCard from "../baseCard/BaseCard";
import Image from "next/image";
import { useStateContext } from "../../../context";
import { firebaseDatabase } from "../../../lib/firebase";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { toast } from "react-hot-toast";
import AddCircleIcon from "@mui/icons-material/AddCircle";

const DataTable = (props) => {
  const [products, setProducts] = React.useState([]);

  const onDeleteProduct = async (id) => {
    // product ref
    const productRef = doc(firebaseDatabase, "products", id);
    await deleteDoc(productRef)
      .then(() => {
        toast.error("Product has been deleted.");
        getData();
      })
      .then((error) => {
        console.error(error);
      });
  };
  // get all products
  const getData = async () => {
    const productsCollectionRef = collection(firebaseDatabase, "products");
    const productsData = await getDocs(productsCollectionRef);
    setProducts(
      productsData.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))
    );
  };
  // filter products
  const filterData = (product) => {
    if (product) {
      setProducts([product]);
    } else {
      getData();
    }
  };

  React.useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <BaseCard title={props.title}>
        <Stack direction="row" spacing={2} className="my-2 mb-2">
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={products}
            sx={{ width: 300 }}
            onChange={(e, v) => filterData(v)}
            getOptionLabel={(products) => products.name || ""}
            renderInput={(params) => (
              <TextField {...params} size="small" label="Search Products" />
            )}
          />
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
          ></Typography>
          <Link href="/products/add">
            <Button variant="contained" endIcon={<AddCircleIcon />}>
              Add
            </Button>
          </Link>
        </Stack>
        <Table
          aria-label="simple table"
          sx={{
            mt: 3,
            whiteSpace: "nowrap",
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography color="textSecondary" variant="h6">
                  Id
                </Typography>
              </TableCell>
              <TableCell>
                <Typography color="textSecondary" variant="h6">
                  Name
                </Typography>
              </TableCell>
              <TableCell>
                <Typography color="textSecondary" variant="h6">
                  Price
                </Typography>
              </TableCell>
              <TableCell>
                <Typography color="textSecondary" variant="h6">
                  Sell
                </Typography>
              </TableCell>
              <TableCell>
                <Typography color="textSecondary" variant="h6">
                  Quantity
                </Typography>
              </TableCell>
              <TableCell>
                <Typography color="textSecondary" variant="h6">
                  Size
                </Typography>
              </TableCell>
              <TableCell>
                <Typography color="textSecondary" variant="h6">
                  Code
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography color="textSecondary" variant="h6">
                  Manage
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product, index) => (
              <TableRow key={product?.name}>
                {console.log(product)}
                <TableCell>
                  <Typography
                    sx={{
                      fontSize: "15px",
                      fontWeight: "500",
                    }}
                  >
                    {index + 1}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                      }}
                    >
                      <Box
                        width={"45px"}
                        height={"45px"}
                        borderRadius={"100%"}
                        overflow="hidden"
                        objectFit="cover"
                        objectPosition="top"
                      >
                        {product.images.length > 0 && (
                          <Image
                            width={100}
                            height={100}
                            src={
                              product.thumbnail
                                ? product.thumbnail
                                : product.images[0]
                            }
                            alt="Product Thumbnail"
                          />
                        )}
                      </Box>
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: "600",
                          }}
                        >
                          {product.name ? product.name : ""}
                        </Typography>
                        <Typography
                          color="textSecondary"
                          display={"flex"}
                          gap="0.2rem"
                          sx={{
                            fontSize: "13px",
                          }}
                        >
                          {product.colors?.map((color) => (
                            <Typography key={color}>{color}</Typography>
                          ))}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography color="textSecondary" variant="h6">
                    ৳ {product.price ? product.price : 0}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography color="textSecondary" variant="h6">
                    {product.sell ? product.sell : 0}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography color="textSecondary" variant="h6">
                    {product.qty ? product.qty : 0}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    color="textSecondary"
                    display={"flex"}
                    flexWrap="wrap"
                    gap="0.2rem"
                    maxWidth="200px"
                  >
                    {product.size?.map((size, index) => (
                      <Typography
                        sx={{
                          fontSize: "13px",
                          lineHeight: "1",
                        }}
                        color="textSecondary"
                        key={index}
                      >
                        {size.label},
                      </Typography>
                    ))}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography color="textSecondary" variant="h6">
                    {product.id}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    color="textSecondary"
                    variant="h6"
                    justifyContent="end"
                    display="flex"
                    gap={"0.2rem"}
                  >
                    <Link href={`/products/edit/${product.id}`}>
                      <Button variant="contained" color="secondary">
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="contained"
                      color="warning"
                      onClick={() => {
                        // call delete product function
                        onDeleteProduct(product.id);
                      }}
                    >
                      Delete
                    </Button>
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </BaseCard>
    </>
  );
};

export default DataTable;
