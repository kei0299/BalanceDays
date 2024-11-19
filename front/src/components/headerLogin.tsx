import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

export default function MenuAppBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" elevation={0} style={{ color: "#ffffff", backgroundColor: "#9bc0ff" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            BalanceDays
          </Typography>
          <Link href="/">Top</Link>
        </Toolbar>
      </AppBar>
    </Box>

  );
}