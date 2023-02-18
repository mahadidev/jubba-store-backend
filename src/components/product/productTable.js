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
import BaseCard from "../baseCard/BaseCard";
import Image from "next/image";
import { useStateContext } from "../../../context";

const products = [
  {
    id: 1,
    name: "সেমি-লং সৌদিয়া সাদা জুব্বা",
    thumbnail: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/images/product_1.jpg`,
    price: 350,
    qty: 10,
    sell: 5,
    options: {
      colors: [
        {
          label: "White",
          className: "bg-white",
        },
        {
          label: "Black",
          className: "bg-black",
        },
        {
          label: "SkyBlue",
          className: "bg-blue",
        },
      ],
    },
  },
];

const ProductTable = () => {
  // context
  const { modalController } = useStateContext();

  return (
    <>
      <BaseCard
        title="Product List"
        link={{
          label: "Add new product",
          href: "/admin/product/add",
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
              <TableCell align="right">
                <Typography color="textSecondary" variant="h6">
                  Manage
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.name}>
                <TableCell>
                  <Typography
                    sx={{
                      fontSize: "15px",
                      fontWeight: "500",
                    }}
                  >
                    {product.id}
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
                          src={product.thumbnail}
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
                          {product.options.colors?.map((color) => (
                            <Typography key={color.label}>
                              {color.label}
                            </Typography>
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
                    {product.sell}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography color="textSecondary" variant="h6">
                    {product.qty}
                  </Typography>
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    display: "flex",
                    gap: "0.5rem",
                  }}
                >
                  <Button variant="contained" color="secondary">
                    Edit
                  </Button>
                  <Button variant="contained" color="warning">
                    Delete
                  </Button>
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
