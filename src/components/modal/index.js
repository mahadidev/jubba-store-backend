import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Button, Card, CardContent } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useStateContext } from "../../../context";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  maxWidth: "700px",
  margin: 0,
};

const ModalProvider = (props) => {
  // context
  const { modalTitle, modalContent, isModalOpen, modalController } =
    useStateContext();

  return (
    <>
      <Modal
        open={isModalOpen}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Card
          style={style}
          sx={{
            borderRadius: { xs: "0", sm: "20px" },
          }}
        >
          <Box
            p={0.2}
            display="flex"
            alignItems="center"
            gap={"0.5"}
            justifyContent="space-between"
          >
            <Typography variant="h4">{modalTitle}</Typography>

            <CloseIcon
              sx={{
                cursor: "pointer",
              }}
              color="primary"
              onClick={() => {
                modalController({ isModalClose: true });
              }}
            />
          </Box>
          <CardContent>{modalContent}</CardContent>
        </Card>
      </Modal>
    </>
  );
};

export default ModalProvider;
