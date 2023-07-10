import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import React from "react";
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
export default function SimpleSnackbar({
  snakeBar = { state: false, message: "", type: "" },
  setSnakeBar,
}) {
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnakeBar({
      state: false,
      message: snakeBar.message,
      type: snakeBar.type,
    });
  };

  return (
    <div>
      <Snackbar
        open={snakeBar.state}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={snakeBar.type}
          sx={{ width: "100%" }}
        >
          {snakeBar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
