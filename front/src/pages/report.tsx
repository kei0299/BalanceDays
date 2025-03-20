import Header from "@/components/headerLogin";
import FooterLogin from "@/components/footerLogin";
import { Box } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import { useState, useEffect } from "react";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import React from "react";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import { parseCookies } from "nookies";
import { Gauge } from "@mui/x-charts/Gauge";
import Stack from "@mui/material/Stack";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { fetchExpenseCategory } from "@/utils/auth/fetchExpenseCategory";

// menuitemの設定
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4 + ITEM_PADDING_TOP, // メニューの最大高さ
    },
  },
};

export default function Report() {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [checked, setChecked] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [totalBudget, setTotalBudget] = useState([]);
  const [totalExpense, setTotalExpense] = useState([]);

  const [categoryBudget, setCategoryBudget] = useState([]);
  const [categoryExpense, setCategoryExpense] = useState([]);
  const [totalRatio, setTotalRatio] = useState<number>(0);
  const [categoryRatio, setCategoryRatio] = useState<number>(0);
  const [expenseCategory, setExpenseCategory] = useState<number>(1);
  const [expenseCategories, setExpenseCategories] = useState<
    expenseCategoryData[]
>([]);

  const selectExpenseCategory = (event: SelectChangeEvent<number>) => {
    setExpenseCategory(Number(event.target.value));
  };

  const checkedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const cookies = parseCookies();
  const accessToken = cookies["accessToken"];
  const client = cookies["client"];
  const uid = cookies["uid"];

  // Rails APIから円チャートを作成
  const fetchPieChart = async (isChecked: boolean) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/reports/pie_chart?month=${apiFormattedDate}&checked=${isChecked}`, // クエリパラメータとして送信
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "access-token": accessToken,
            client: client,
            uid: uid,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`エラー: ${response.status}`);
      }

      const data = await response.json();

      // カテゴリごとに色を指定（ここでは例として色を手動で設定）
      const colors = [
        "#4682b4",
        "#FFCE56",
        "#4BC0C0",
        "#FF9F40",
        "#9966FF",
        "#FFB6C1",
        "#2e8b57",
        "#FF6384",
        "#8A2BE2",
        "#FFD700",
        "#8B0000",
      ];

      // APIレスポンスを PieChart に渡す形式に変換
      const pieChartData = data.map((item: pieChartData, index: number) => ({
        id: item.id,
        value: item.current_month_amount,
        label: item.name,
        color: colors[index % colors.length],
      }));
      setExpenses(pieChartData);
    } catch (error) {
      console.error("取得失敗", error);
    }
  };

  // Rails APIから予算ゲージを作成
  const fetchGauge = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/reports/total_gauge?month=${apiFormattedDate}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "access-token": accessToken,
            client: client,
            uid: uid,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`エラー: ${response.status}`);
      }

      const data = await response.json();

      setTotalBudget(data.total_budget);
      setTotalExpense(data.total_expense);
      setTotalRatio(data.total_ratio);
    } catch (error) {
      console.error("取得失敗", error);
    }
  };

  useEffect(() => {
    // Rails APIからカテゴリを取得
    const fetchCategoryData = async () => {
      try {
        const expenseData: expenseCategoryData[] = await fetchExpenseCategory();
        setExpenseCategories(expenseData);
      } catch (error) {
        console.error("取得失敗", error);
      }
    };

    const changeCategory = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/reports/category_gauge?month=${apiFormattedDate}&category=${expenseCategory}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "access-token": accessToken,
              client: client,
              uid: uid,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`エラー: ${response.status}`);
        }

        const data = await response.json();
        setCategoryBudget(data.category_budget);
        setCategoryExpense(data.category_expense);
        setCategoryRatio(data.category_ratio);
      } catch (error) {
        console.error("エラーが発生しました:", error);
      }
    };
    changeCategory();

    fetchCategoryData();
    fetchPieChart(checked);
    fetchGauge();
  }, [currentMonth, expenseCategory]);

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

  const switchToggle = () => {
    const newChecked = !checked; // スイッチの新しい状態
    setChecked(newChecked);
    fetchPieChart(newChecked); // スイッチの状態を渡してデータ取得
  };

  return (
    <>
      <Header />
      <title>BalanceDays</title>
      <link rel="icon" href="/favicon.ico" />
      <div>
        <main style={{ minHeight: "130vh" }}>
          <Box
            sx={{
              display: "flex",
              mt: 10,
            }}
          >
            <KeyboardArrowLeftIcon onClick={() => monthChange("previous")} />
            {formattedMonth}
            <KeyboardArrowRightIcon onClick={() => monthChange("next")} />
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              mb: 10
            }}
          >
            {/* 円グラフ */}
            <Stack spacing={3} direction="column" alignItems="center">
              <Typography sx={{ fontSize: "24px", fontWeight: "bold" }}>
                カテゴリ別収支レポート（￥）
              </Typography>
              <PieChart
                series={[{ data: expenses }]}
                width={650}
                height={350}
              />

              {/* スイッチ */}
              <Box display="flex" alignItems="center" gap={1} marginTop={1}>
                <Typography
                  sx={{
                    color: checked ? "gray" : "red", // オフ時は赤、オン時は灰色
                    fontWeight: !checked ? "bold" : "normal", // オフ時は太字
                    fontSize: "20px"
                  }}
                >
                  支出
                </Typography>
                <Switch
                  checked={checked}
                  onChange={checkedChange}
                  onClick={switchToggle}
                  sx={{
                    "& .MuiSwitch-track": {
                      backgroundColor: checked ? "blue" : "red", // トラックの色
                    },
                  }}
                />
                <Typography
                  sx={{
                    color: checked ? "blue" : "gray", // オン時は緑、オフ時は灰色
                    fontWeight: checked ? "bold" : "normal", // オン時は太字
                    fontSize: "20px"
                  }}
                >
                  収入
                </Typography>
              </Box>
            </Stack>

            <Stack spacing={3} direction="column" sx={{ mt: "50px" }}>
              <Typography sx={{ fontSize: "24px", fontWeight: "bold" }}>
                総予算 / カテゴリ別予算（％）
              </Typography>
              <Stack spacing={3} direction="row">
                <Stack spacing={2} direction="column">
                  <Gauge width={200} height={200} value={totalRatio} />
                  <Typography>
                    ¥{totalExpense.toLocaleString()} / ¥
                    {totalBudget.toLocaleString()}
                  </Typography>
                </Stack>

                <Stack spacing={2} direction="column">
                  <Gauge width={180} height={180} value={categoryRatio} />
                  <Typography>
                  ¥{categoryExpense.toLocaleString()} / ¥
                  {categoryBudget.toLocaleString()}
                  </Typography>
                </Stack>
                {/* カテゴリ選択 */}
                <FormControl sx={{ minWidth: 150, ml: 2 }}>
                  <InputLabel>カテゴリ</InputLabel>
                  <Select
                    value={expenseCategory}
                    label="カテゴリ"
                    onChange={selectExpenseCategory}
                    MenuProps={MenuProps}
                  >
                    {expenseCategories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
            </Stack>
          </Box>
        </main>
        <FooterLogin />
      </div>
    </>
  );
}
