import { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

const DeleteConfirmation = ({ onConfirm }: { onConfirm: () => void }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleConfirm = () => {
    onConfirm();
    handleClose();
  };

  return (
    <>
      <Button variant="contained" color="error" onClick={handleOpen}>
        退会する
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>本当に退会しますか？</DialogTitle>
        <DialogContent>
          <DialogContentText>
            退会すると、アカウントの情報は削除され、元に戻せません。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            キャンセル
          </Button>
          <Button onClick={handleConfirm} color="error">
            退会する
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteConfirmation;
