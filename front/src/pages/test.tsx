import * as React from "react";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Button from "@mui/material/Button";

export default function AlertExample() {
  const [open, setOpen] = React.useState(false);

  // アラートを表示
  const handleClick = () => {
    setOpen(true);
  };

  // 一定時間後に閉じる
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <>
      <Button variant="contained" onClick={handleClick}>
        新規作成
      </Button>

      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }} // 画面中央（上部）に配置
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          新規作成しました！
        </Alert>
      </Snackbar>
    </>
  );
}
