import { Grid } from "@mui/material";
import { UserTable } from "../../src/components";

const UsersPage = () => {
  return (
    <Grid container spacing={0}>
      <Grid item xs={12} lg={12}>
        <UserTable />
      </Grid>
    </Grid>
  );
};

export default UsersPage;
