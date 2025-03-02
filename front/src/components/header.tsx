import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import Button from "@mui/material/Button";

export default function MenuAppBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{ color: "#ffffff", backgroundColor: "#9bc0ff", padding: "0 16px" }}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            <Link href="/" passHref>
              <Box
                sx={{ textDecoration: "none", color: "inherit" }}
              >
                BalanceDays
              </Box>
            </Link>
          </Typography>

          <Box>
            <Link href="/signup" passHref>
              <Button
                variant="contained"
                sx={{
                  marginRight: 1,
                  backgroundColor: "#4169e1",
                }}
              >
                新規作成
              </Button>
            </Link>
            <Link href="/signin" passHref>
              <Button
                variant="contained"
                sx={{
                  marginRight: 1,
                  backgroundColor: "#4169e1",
                }}
              >
                ログイン
              </Button>
            </Link>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
