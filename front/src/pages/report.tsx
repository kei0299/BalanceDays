import Header from "@/components/header";
import FooterLogin from "@/components/footerLogin";
import { Box } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import { useState, useEffect } from "react";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import React from "react";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";

export default function Report() {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [checked, setChecked] = useState(false);

  const checkedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  // 年月を "YYYY年MM月" の形式にフォーマット
  const formattedMonth = `${currentMonth.getFullYear()}年${String(
    currentMonth.getMonth() + 1
  ).padStart(2, "0")}月`;

  // API用のフォーマットを "YYYY-MM-DD" 形式で作成
  const apiFormattedDate = `${currentMonth.getFullYear()}-${String(
    currentMonth.getMonth() + 1
  ).padStart(2, "0")}-01`; // 1日を固定で追加

  const monthChange = (direction: "previous" | "next") => {
    const newMonth = new Date(currentMonth);
    if (direction === "previous") {
      newMonth.setMonth(currentMonth.getMonth() - 1); // 前月
    } else {
      newMonth.setMonth(currentMonth.getMonth() + 1); // 次月
    }
    setCurrentMonth(newMonth);
  };

  return (
    <>
      <Header />
      <title>BalanceDays</title>
      <link rel="icon" href="/favicon.ico" />
      <div>
        <main>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                mt: 10,
                textAlign: "center",
              }}
            >
              <KeyboardArrowLeftIcon onClick={() => monthChange("previous")} />
              {formattedMonth}
              <KeyboardArrowRightIcon onClick={() => monthChange("next")} />
            </Box>

            <PieChart
              series={[
                {
                  data: [
                    { id: 0, value: 10, label: "カテゴリ名" },
                    { id: 1, value: 15, label: "series B" },
                    { id: 2, value: 20, label: "series C" },
                    { id: 3, value: 20, label: "series C" },
                    { id: 4, value: 20, label: "series C" },
                    { id: 5, value: 20, label: "series C" },
                  ],
                },
              ]}
              width={500}
              height={200}
            />
            <Box display="flex" alignItems="center" gap={1}>
              {/* 支出ラベル */}
              <Typography
                sx={{
                  color: checked ? "gray" : "red", // オフ時は赤、オン時は灰色
                  fontWeight: !checked ? "bold" : "normal", // オフ時は太字
                }}
              >
                支出
              </Typography>

              {/* スイッチ */}
              <Switch
                checked={checked}
                onChange={checkedChange}
                sx={{
                  "& .MuiSwitch-track": {
                    backgroundColor: checked ? "blue" : "red", // トラックの色
                  },
                }}
              />

              {/* 収入ラベル */}
              <Typography
                sx={{
                  color: checked ? "blue" : "gray", // オン時は緑、オフ時は灰色
                  fontWeight: checked ? "bold" : "normal", // オン時は太字
                }}
              >
                収入
              </Typography>
            </Box>
          </Box>
        </main>
        <FooterLogin />
      </div>
    </>
  );
}
