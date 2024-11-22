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

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
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
  const [incomeAndExpense, setIncomeAndExpense] = React.useState("income");
  const [day, setDay] = React.useState<Dayjs | null>(dayjs());

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

  return (
    <>
      <Header />
      <title>BalanceDays</title>
      <link rel="icon" href="/favicon.ico" />
      <div>
        <main style={{ minHeight: "300vh"}}>
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
