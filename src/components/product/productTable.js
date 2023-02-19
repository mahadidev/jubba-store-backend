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
} from "@mui/material";
import Link from "next/link";
import BaseCard from "../baseCard/BaseCard";
import Image from "next/image";
import { useStateContext } from "../../../context";
import { firebaseDatabase } from "../../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

const ProductTable = () => {
  const [products, setProducts] = React.useState([]);

  React.useEffect(() => {
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
    getData();
  }, []);

  return (
    <>
      <BaseCard
        title="Product List"
        link={{
          label: "Add new product",
          href: "/products/add",
        }}
      >
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
              <TableCell align="right">
                <Typography color="textSecondary" variant="h6">
                  Manage
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product, index) => (
              <TableRow key={product.name}>
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
                        <Image
                          width={100}
                          height={100}
                          src={product.images[product.thumbnail]}
                          alt="Product Thumbnail"
                        />
                      </Box>
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: "600",
                          }}
                        >
                          {product.name}
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
                    ৳ {product.price}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography color="textSecondary" variant="h6">
                    {product.sell ? product.sell : 0}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography color="textSecondary" variant="h6">
                    {product.qty}
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
                    {product.size.map((size, index) => (
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
                    <Button variant="contained" color="warning">
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

export default ProductTable;
