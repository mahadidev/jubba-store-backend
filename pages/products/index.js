import { Grid } from "@mui/material";
import { ProductTable } from "../../src/components";

const ProductPage = () => {
  return (
    <Grid container spacing={0}>
      <Grid item xs={12} lg={12}>
        <ProductTable />
      </Grid>
    </Grid>
  );
};

export default ProductPage;
