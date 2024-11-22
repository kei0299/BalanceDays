import Header from "@/components/header";
import FooterLogin from "@/components/footerLogin";
import { Box } from "@mui/material";
import * as React from "react";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { useEffect, useState } from "react";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { fetchIncomeCategory } from "@/utils/auth/fetchIncomeCategory";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// income_categoryの型定義
interface incomeCategoryData {
  id: number;
  name: string;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
}

export default function Calender() {
  const [value, setValue] = React.useState(0);
  const [incomeAndExpense, setIncomeAndExpense] = React.useState("expense");
  const [day, setDay] = React.useState<Dayjs | null>(dayjs());
  const [incomeCategory, setIncomeCategory] = useState<string>("");
  const [categories, setCategories] = useState<incomeCategoryData[]>([]); // カテゴリデータ用のstate

  const selectIncomeCategory = (event: SelectChangeEvent<unknown>) => {
    setIncomeCategory(event.target.value as string);
  };

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP, // メニューの最大高さ
      },
    },
  };

  const toggleChange = (
    event: React.MouseEvent<HTMLElement>,
    nextIncomeAndExpense: string | null
  ) => {
    if (nextIncomeAndExpense !== null) {
      setIncomeAndExpense(nextIncomeAndExpense);
    }
  };

  const tabChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    // Rails APIからカテゴリを取得
    const fetchCategoryData = async () => {
      try {
        const data: incomeCategoryData[] = await fetchIncomeCategory();
        setCategories(data);
      } catch (error) {
        console.error("取得失敗", error);
      }
    };
    fetchCategoryData();
  }, []);

  return (
    <>
      <Header />
      <title>BalanceDays</title>
      <link rel="icon" href="/favicon.ico" />
      <div>
        <main style={{ minHeight: "300vh" }}>
          <Box sx={{ mt: 10, mr: 1000 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar />
            </LocalizationProvider>
          </Box>

          <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs value={value} onChange={tabChange} aria-label="tabChanges">
                <Tab label="収支" {...a11yProps(0)} />
                <Tab label="シフト" {...a11yProps(1)} />
              </Tabs>
            </Box>

            <CustomTabPanel value={value} index={0}>
              <Box sx={{ ml: 10 }}>
                <h1>収支入力</h1>
              </Box>

              {/* 収入/支出切り替えトグルボタン */}
              <ToggleButtonGroup
                sx={{ mr: 3 }}
                color="primary"
                orientation="vertical"
                value={incomeAndExpense}
                exclusive
                onChange={toggleChange}
              >
                <ToggleButton value="income" aria-label="income">
                  収入
                </ToggleButton>
                <ToggleButton value="expense" aria-label="expense">
                  支出
                </ToggleButton>
              </ToggleButtonGroup>

              {/* 日付入力フォーム */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="日付"
                  value={day}
                  onChange={(newDay) => setDay(newDay)}
                  format="YYYY/MM/DD"
                />
              </LocalizationProvider>

              {/* カテゴリ選択 */}
              <Box sx={{ display: "flex", alignItems: "flex-end", ml: 10 }}>
                <Box sx={{ minWidth: 150 }}>
                  <FormControl fullWidth>
                    <InputLabel id="income-category-label">カテゴリ</InputLabel>
                    <Select
                      labelId="income-category-label"
                      id="income-select"
                      value={incomeCategory}
                      label="カテゴリ"
                      onChange={selectIncomeCategory}
                      MenuProps={MenuProps}
                    >
                      {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name} {/* APIから取得したカテゴリ名 */}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              シフト入力
            </CustomTabPanel>
          </Box>
        </main>
        <FooterLogin />
      </div>
    </>
  );
}
