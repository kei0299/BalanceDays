import * as React from "react";
import { AppBar, Toolbar, Box, CssBaseline, Typography } from "@mui/material";
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
          <Link href="/terms/terms" style={{ marginRight: "20px" }}>
            <Typography 
              variant="body2" 
              sx={{ color: "#ffffff", fontSize: { xs: '0.8rem', sm: '1rem' } }}
            >
              利用規約
            </Typography>
          </Link>
          <Link href="/terms/privacyPolicy" style={{ marginRight: "20px" }}>
            <Typography 
              variant="body2" 
              sx={{ color: "#ffffff", fontSize: { xs: '0.8rem', sm: '1rem' } }}
            >
              プライバシーポリシー
            </Typography>
          </Link>
          <Link href="https://docs.google.com/forms/d/e/1FAIpQLSeOHpYIQ8qItHvE5J4raMXjFZzbcCsH3RjSQ8iJRcPrsnFY7Q/viewform?usp=header">
            <Typography 
              variant="body2" 
              sx={{ color: "#ffffff", fontSize: { xs: '0.8rem', sm: '1rem' } }}
            >
              お問い合わせ
            </Typography>
          </Link>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
}
