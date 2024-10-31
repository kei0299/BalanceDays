import * as React from "react";
import { AppBar, Toolbar, Box, CssBaseline, Typography } from "@mui/material";
import Link from "next/link";

export default function BottomAppBar() {
  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar
        position="fixed"
        style={{ color: "#ffffff", backgroundColor: "BFD4F8" }}
        sx={{ top: "auto", bottom: 0 }}
      >
        <Toolbar>
          <Box sx={{ flexGrow: 1 }} />
          <Link href="/" style={{ marginRight: "20px" }}>
            <Typography 
              variant="body2" 
              sx={{ color: "#ffffff", fontSize: { xs: '0.8rem', sm: '1rem' } }}
            >
              利用規約
            </Typography>
          </Link>
          <Link href="/">
            <Typography 
              variant="body2" 
              sx={{ color: "#ffffff", fontSize: { xs: '0.8rem', sm: '1rem' } }}
            >
              プライバシーポリシー
            </Typography>
          </Link>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
}
