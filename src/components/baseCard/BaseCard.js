import React from "react";
import NextLink from "next/link";
import {
  Card,
  CardContent,
  Divider,
  Box,
  Typography,
  Chip,
  Button,
} from "@mui/material";

const BaseCard = (props) => {
  return (
    <Card sx={props.sx}>
      <Box
        p={2}
        display="flex"
        alignItems="center"
        gap={"0.5"}
        justifyContent="space-between"
      >
        {props.title && <Typography variant="h4">{props.title}</Typography>}

        {props.button && (
          <Button
            variant="contained"
            color={props.button.color ? props.button.color : "primary"}
            onClick={() => {
              if (props.button.onClick) {
                props.button.onClick();
              }
            }}
          >
            {props.button.label}
          </Button>
        )}

        {props.link && (
          <NextLink href={props.link.href}>
            <Button variant="contained" color="primary">
              {props.link.label}
            </Button>
          </NextLink>
        )}

        {props.rightElement && props.rightElement}
      </Box>
      <CardContent>{props.children}</CardContent>
    </Card>
  );
};

export default BaseCard;
