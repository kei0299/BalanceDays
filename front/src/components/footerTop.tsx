import * as React from "react";
import { AppBar, Toolbar, Box, CssBaseline } from "@mui/material";
import Link from "next/link";

export default function BottomAppBar() {
  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar
        position="fixed"
        style={{ color: "#ffffff", backgroundColor: "#9bc0ff" }}
        sx={{ top: "auto", bottom: 0 }}
      >
        <Toolbar>
          <Box sx={{ flexGrow: 1 }} />
          <Link href="/" style={{ color: "#ffffff", marginRight: "20px" }}>
            利用規約
          </Link>
          <Link href="/" style={{ color: "#ffffff" }}>
            プライバシーポリシー
          </Link>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
}
