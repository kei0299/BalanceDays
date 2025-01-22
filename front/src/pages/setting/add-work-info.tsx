import Header from "@/components/header";
import FooterLogin from "@/components/footerLogin";
import { Box, Button } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useState } from "react";
import { parseCookies } from "nookies";
import * as React from "react";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Tab関連
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

const cookies = parseCookies();
const accessToken = cookies["accessToken"];
const client = cookies["client"];
const uid = cookies["uid"];

export default function Setting() {
  const [age, setAge] = React.useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };

  const [trainingStartDay, setTrainingStartDay] = React.useState<Dayjs | null>(
    dayjs()
  ); // フォーム用の日付
  const [trainingEndDay, setTrainingEndDay] = React.useState<Dayjs | null>(
    dayjs()
  ); // フォーム用の日付
  const [companyName, setCompanyName] = useState("");
  const [hourlyWage, setHourlyWage] = React.useState("");
  const [nightWage, setNightWage] = React.useState("");
  const [tab, setTab] = React.useState(0);
  const tabChange = (event: React.SyntheticEvent, newTab: number) => {
    setTab(newTab);
  };

  const incomeMemoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCompanyName(event.target.value);
  };

  // railsAPI_支出の登録
  const saveJobInfo = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "access-token": accessToken,
          client: client,
          uid: uid,
        },
        body: JSON.stringify({
          // amount: Number(expenseAmount.replace(/,/g, "")),
          // date: formatFormDay,
          // expense_category_id: expenseCategory,
          // memo: expenseMemo,
        }),
      });

      if (!response.ok) {
        throw new Error("勤務先情報の登録に失敗しました");
      }
      alert("勤務先情報を登録しました");
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  // 金額をフォーマットする関数
  const formatAmountChange = <T extends HTMLInputElement | HTMLTextAreaElement>(
    event: React.ChangeEvent<T>,
    setAmount: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const numericValue = event.target.value.replace(/[^0-9]/g, ""); // 数字以外を削除
    const formattedValue = formatNum(numericValue); // フォーマット適用
    setAmount(formattedValue); // カンマ区切りを適用して状態を更新
  };

  // 3桁ごとにカンマを挿入する関数
  const formatNum = (num: string | number): string => {
    return String(num).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
              minHeight: "100vh",

            }}
          >
            <h1>勤務先登録画面</h1>
            <Box sx={{ width: "100%" }}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs value={tab} onChange={tabChange} aria-label="tabChanges">
                  <Tab label="株式会社ABC" {...a11yProps(0)} />
                  <Tab label="株式会社DEF" {...a11yProps(1)} />
                  <Tab label="株式会社GHI" {...a11yProps(2)} />
                </Tabs>
              </Box>
            </Box>

            <CustomTabPanel value={tab} index={0}>
              {/* 勤務先 */}
              <TextField
                sx={{ m: 2 }}
                id="outlined-multiline-flexible"
                label="勤務先名"
                multiline
                maxRows={4}
                value={companyName}
                onChange={incomeMemoChange}
              />

              {/* 時給 */}
              <FormControl sx={{ minWidth: 150, m: 2 }}>
                <InputLabel htmlFor="outlined-hourlyWage">時給</InputLabel>
                <OutlinedInput
                  id="outlined-hourlyWage"
                  label="時給"
                  value={hourlyWage}
                  onChange={(event) => formatAmountChange(event, setHourlyWage)}
                  startAdornment={
                    <InputAdornment position="start">¥</InputAdornment>
                  }
                  inputProps={{ inputMode: "numeric" }} // モバイルのみ数字キーボードを表示
                />
              </FormControl>

              {/* 深夜時給 */}
              <FormControl sx={{ minWidth: 150, m: 2 }}>
                <InputLabel htmlFor="outlined-nightWage">深夜時給</InputLabel>
                <OutlinedInput
                  id="outlined-nightWage"
                  label="深夜時給"
                  value={nightWage}
                  onChange={(event) => formatAmountChange(event, setNightWage)}
                  startAdornment={
                    <InputAdornment position="start">¥</InputAdornment>
                  }
                  inputProps={{ inputMode: "numeric" }} // モバイルのみ数字キーボードを表示
                />
              </FormControl>

              {/* 給料日設定 */}
              <Box>
                <FormLabel id="demo-radio-buttons-group-label">
                  給料日の設定
                </FormLabel>
                </Box>

                <Box sx={{m:2}}>  
                <FormControl sx={{ minWidth: 120}}>
                  <InputLabel id="demo-simple-select-label">締日</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={age}
                    label="締日"
                    onChange={handleChange}
                  >
                    <MenuItem value={10}>5日</MenuItem>
                    <MenuItem value={20}>15日</MenuItem>
                    <MenuItem value={30}>25日</MenuItem>
                    <MenuItem value={40}>月末日</MenuItem>
                  </Select>
                </FormControl>

                <FormControl sx={{ minWidth: 120,ml:2}}>
                  <InputLabel id="demo-simple-select-label">支払月</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={age}
                    label="支払月"
                    onChange={handleChange}
                  >
                    <MenuItem value={10}>当月</MenuItem>
                    <MenuItem value={20}>翌月</MenuItem>
                    <MenuItem value={30}>翌々月</MenuItem>
                  </Select>
                </FormControl>

                <FormControl sx={{ minWidth: 120,ml:2}}>
                  <InputLabel id="demo-simple-select-label">支払日</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={age}
                    label="支払日"
                    onChange={handleChange}
                  >
                    <MenuItem value={10}>5日</MenuItem>
                    <MenuItem value={20}>10日</MenuItem>
                    <MenuItem value={30}>15日</MenuItem>
                    <MenuItem value={40}>20日</MenuItem>
                    <MenuItem value={50}>25日</MenuItem>
                    <MenuItem value={60}>月末</MenuItem>
                  </Select>
                </FormControl>

              </Box>

              {/* 研修関連の設定 */}
              <Box>
                <FormLabel id="demo-radio-buttons-group-label">
                  研修期間の給与設定
                </FormLabel>
                <RadioGroup
                sx={{ml:2}}
                  aria-labelledby="demo-radio-buttons-group-label"
                  defaultValue="female"
                  name="radio-buttons-group"
                >
                  <FormControlLabel
                    value="研修なし"
                    control={<Radio />}
                    label="研修なし"
                  />
                  <FormControlLabel
                    value="研修期間で設定"
                    control={<Radio />}
                    label="研修期間で設定"
                  />
                  <FormControlLabel
                    value="研修時間で設定"
                    control={<Radio />}
                    label="研修時間で設定"
                  />
                </RadioGroup>
              </Box>

              {/* 研修開始日入力フォーム */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  sx={{ minWidth: 150, m: 2 }}
                  label="研修開始日"
                  value={trainingStartDay}
                  onChange={(newDay) => setTrainingStartDay(newDay)}
                  format="YYYY/MM/DD"
                />
              </LocalizationProvider>

              {/* 研修終了日入力フォーム */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  sx={{ minWidth: 150, m: 2 }}
                  label="研修終了日"
                  value={trainingEndDay}
                  onChange={(newDay) => setTrainingEndDay(newDay)}
                  format="YYYY/MM/DD"
                />
              </LocalizationProvider>

              <TextField
                sx={{ minWidth: 150, m: 2 }}
                id="outlined-number"
                label="研修時間"
                type="number"
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />

              <Box sx={{ display: "flex", mt: 2,textAlign:'center' }}>
                <Button type="submit" variant="outlined" onClick={saveJobInfo}>
                  登録する
                </Button>
              </Box>
            </CustomTabPanel>

            <CustomTabPanel value={tab} index={1}>
              とりあえず
            </CustomTabPanel>
          </Box>
        </main>
        <FooterLogin />
      </div>
    </>
  );
}
