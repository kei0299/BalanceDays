import * as React from "react";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import HomeIcon from '@mui/icons-material/Home';
import ListIcon from '@mui/icons-material/List';
import AssessmentIcon from '@mui/icons-material/Assessment';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import SettingsIcon from '@mui/icons-material/Settings';
import { CssBaseline } from "@mui/material";

export default function FooterLogin() {
  const [value, setValue] = React.useState(0);

  return (
    <>
      <CssBaseline />
        <Box
          position="fixed"
          sx={{
            top: "auto",
            bottom: 0,
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <BottomNavigation
            showLabels
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
            sx={{ width: "100%" }}
          >
            <BottomNavigationAction
              label="Home"
              icon={<HomeIcon />}
              sx={{ color: "#ffffff", backgroundColor: "#9bc0ff", maxWidth: "none" }}
            />

            <BottomNavigationAction
              label="予算設定"
              icon={<ListIcon />}
              sx={{ color: "#ffffff", backgroundColor: "#9bc0ff", maxWidth: "none" }}
            />
            <BottomNavigationAction
              label="レポート"
              icon={<AssessmentIcon />}
              sx={{ color: "#ffffff", backgroundColor: "#9bc0ff", maxWidth: "none" }}
            />
            <BottomNavigationAction
              label="カレンダー"
              icon={<EditCalendarIcon />}
              sx={{ color: "#ffffff", backgroundColor: "#9bc0ff", maxWidth: "none" }}
            />

            <BottomNavigationAction
              label="設定"
              icon={<SettingsIcon />}
              sx={{ color: "#ffffff", backgroundColor: "#9bc0ff", maxWidth: "none" }}
            />
          </BottomNavigation>
        </Box>
    </>
  );
}
