import * as React from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import HomeIcon from "@mui/icons-material/Home";
import ListIcon from "@mui/icons-material/List";
import AssessmentIcon from "@mui/icons-material/Assessment";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import SettingsIcon from "@mui/icons-material/Settings";
import { CssBaseline } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { parseCookies, destroyCookie } from "nookies";
import { useAlert } from "@/components/AlertContext";
import { useRouter } from "next/router";

export default function FooterLogin() {
  const { showAlert } = useAlert();
  const [value, setValue] = React.useState(0);
  const router = useRouter();
  const currentPath = router.pathname;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const getValue = () => {
    switch (currentPath) {
      case "/home":
        return 0;
      case "/budget":
        return 1;
      case "/report":
        return 2;
      case "/calendar":
        return 3;
      case "/setting/account":
      case "/setting/set-lifespan":
      case "/setting/add-work-info":
        return 4;
      default:
        return 0;
    }
  };

  // ログアウトボタン
  const handleLogout = async (event: React.FormEvent) => {
    event.preventDefault();

    // クッキーからトークンを取得
    const cookies = parseCookies();
    const accessToken = cookies["accessToken"];
    const client = cookies["client"];
    const uid = cookies["uid"];

    // railsAPIログアウト
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/sign_out`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            "access-token": accessToken,
            client: client,
            uid: uid,
          }),
        }
      );

      if (!response.ok) {
        showAlert("ログアウトに失敗しました。", "error");
        throw new Error("ログアウトに失敗しました");
      }

      destroyCookie(null, "accessToken");
      destroyCookie(null, "client");
      destroyCookie(null, "uid");

      showAlert("ログアウトしました。", "success");
      window.location.href = "/";
    } catch (error) {
      console.error(error);
    }
  };

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
          zIndex: 1000
        }}
      >
        <BottomNavigation
          showLabels
          value={getValue()} 
          sx={{ width: "100%" }}
        >
          <BottomNavigationAction
            label="Home"
            icon={<HomeIcon />}
            href={"/home"}
            sx={{
              color: "#ffffff",
              backgroundColor: "#9bc0ff",
              maxWidth: "none",
            }}
          />

          <BottomNavigationAction
            label="予算設定"
            icon={<ListIcon />}
            href={"/budget"}
            sx={{
              color: "#ffffff",
              backgroundColor: "#9bc0ff",
              maxWidth: "none",
            }}
          />
          <BottomNavigationAction
            label="レポート"
            icon={<AssessmentIcon />}
            href={"/report"}
            sx={{
              color: "#ffffff",
              backgroundColor: "#9bc0ff",
              maxWidth: "none",
            }}
          />
          <BottomNavigationAction
            label="カレンダー"
            icon={<EditCalendarIcon />}
            href={"/calendar"}
            sx={{
              color: "#ffffff",
              backgroundColor: "#9bc0ff",
              maxWidth: "none",
            }}
          />

          <BottomNavigationAction
            label="設定"
            icon={<SettingsIcon />}
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
            sx={{
              color: "#ffffff",
              backgroundColor: "#9bc0ff",
              maxWidth: "none",
            }}
          />
        </BottomNavigation>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
        >
          <MenuItem onClick={handleClose}>
            <Link href="/setting/account">アカウント</Link>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <Link href="/setting/set-lifespan">生存期間設定</Link>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <Link href="/setting/add-work-info">勤務先登録</Link>
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <Link href="/">ログアウト</Link>
          </MenuItem>
        </Menu>
      </Box>
    </>
  );
}
