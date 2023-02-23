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
  Modal,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import Link from "next/link";
import BaseCard from "../baseCard/BaseCard";
import Image from "next/image";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { firebaseDatabase, firebaseAuth } from "../../../lib/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { toast } from "react-hot-toast";
import AddCircleIcon from "@mui/icons-material/AddCircle";

const UserTable = (props) => {
  const [users, setUsers] = React.useState([]);
  // user collection ref
  const userCollectionRef = collection(firebaseDatabase, "users");

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
    const usersData = await getDocs(userCollectionRef);
    setUsers(
      usersData.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))
    );
  };
  // filter products
  const filterData = (user) => {
    if (user) {
      setUsers([user]);
    } else {
      getData();
    }
  };

  // user add management
  const handleUserModalClose = () => SetUserAddModalOpen(false);
  const [userName, setUserName] = React.useState("");
  const [userEmail, setUserEmail] = React.useState("");
  const [userPassword, setUserPassword] = React.useState("");
  const [userConfirmPassword, setUserConfirmPassword] = React.useState("");
  const [userOrder, setUserOrder] = React.useState(0);
  const [isAddLoading, setIsAddLoading] = React.useState(false);
  const [isUserAddModalOpen, SetUserAddModalOpen] = React.useState(false);
  const handleUserModalOpen = () => {
    // set default value
    setUserName("");
    setUserEmail("");
    setUserPassword("");
    setUserConfirmPassword("");
    setUserOrder(0);
    SetUserAddModalOpen(true);
  };
  const onAddUser = () => {
    // set loading true
    setIsAddLoading(true);
    if (userName.length < 1) {
      toast.error("Name is required");
      // set loading false
      setIsAddLoading(false);
    } else if (userEmail.length < 1) {
      toast.error("email is required");
      // set loading false
      setIsAddLoading(false);
    } else if (userPassword.length < 1) {
      toast.error("password is required");
      // set loading false
      setIsAddLoading(false);
    } else if (userConfirmPassword.length < 1) {
      toast.error("Confirm Password is required");
      // set loading false
      setIsAddLoading(false);
    } else if (userConfirmPassword !== userPassword) {
      toast.error("You Confirm password not match");
      // set loading false
      setIsAddLoading(false);
    } else {
      createUserWithEmailAndPassword(firebaseAuth, userEmail, userPassword)
        .then(async (userCredential) => {
          // Signed in
          const user = userCredential.user;
          const userUid = user.uid;
          await addDoc(userCollectionRef, {
            uid: userUid,
            email: userEmail,
            password: userPassword,
            confirmPassword: userConfirmPassword,
            name: userName,
            order: userOrder,
          })
            .then(() => {
              toast.success("User has been created.");
              // set loading false
              setIsAddLoading(false);
              handleUserModalClose();
              getData();
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              toast.error(errorMessage);
              // set loading false
              setIsAddLoading(false);
            });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          toast.error(errorMessage);
          // set loading false
          setIsAddLoading(false);
        });
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
            options={users}
            sx={{ width: 300 }}
            onChange={(e, v) => filterData(v)}
            getOptionLabel={(user) => (user.name ? user.name : user.uid || "")}
            renderInput={(params) => (
              <TextField {...params} size="small" label="Search Users" />
            )}
          />
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
          ></Typography>
          <Button
            variant="contained"
            endIcon={<AddCircleIcon />}
            onClick={() => {
              handleUserModalOpen();
            }}
          >
            Add
          </Button>
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
                  Order
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
            {users.map((user, index) => (
              <TableRow key={user?.uid}>
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
                      {/* <Box
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
                      </Box> */}
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: "600",
                          }}
                        >
                          {user.name ? user.name : ""}
                        </Typography>
                        <Typography
                          color="textSecondary"
                          display={"flex"}
                          gap="0.2rem"
                          sx={{
                            fontSize: "13px",
                          }}
                        >
                          <Typography>{user.email}</Typography>
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: "600",
                        }}
                      >
                        {user.order ? user.order : 0}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography
                    color="textSecondary"
                    variant="h6"
                    justifyContent="end"
                    display="flex"
                    gap={"0.2rem"}
                  >
                    <Button variant="contained" color="secondary">
                      View
                    </Button>
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
      <Modal
        open={isUserAddModalOpen}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <BaseCard
          sx={{
            width: "100%",
            maxWidth: "700px",
            margin: "auto",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
          title="Add users"
          rightElement={
            <Button
              color="secondary"
              onClick={() => {
                handleUserModalClose();
              }}
              variant="contained"
              disabled={isAddLoading}
            >
              cancel
            </Button>
          }
        >
          <Stack spacing={3}>
            <TextField
              label="User Name"
              variant="outlined"
              onChange={(e) => {
                setUserName(e.target.value);
              }}
              defaultValue={userName}
              value={userName}
              required
            />
            <TextField
              label="User Email"
              variant="outlined"
              onChange={(e) => {
                setUserEmail(e.target.value);
              }}
              defaultValue={userEmail}
              value={userEmail}
              required
            />
            <TextField
              label="Password"
              variant="outlined"
              onChange={(e) => {
                setUserPassword(e.target.value);
              }}
              defaultValue={userPassword}
              value={userPassword}
              required
            />
            <TextField
              label="Confirm Password"
              variant="outlined"
              onChange={(e) => {
                setUserConfirmPassword(e.target.value);
                setIsAddLoading(false);
              }}
              defaultValue={userConfirmPassword}
              value={userConfirmPassword}
              required
            />
          </Stack>
          <br />
          <Stack spacing={2} direction="row">
            <Button
              variant="contained"
              mt={2}
              onClick={() => {
                onAddUser();
              }}
              disabled={isAddLoading}
            >
              {isAddLoading ? "Creating..." : "Create"}
            </Button>
          </Stack>
        </BaseCard>
      </Modal>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isAddLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default UserTable;
