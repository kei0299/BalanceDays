import Header from "@/components/header";
import FooterLogin from "@/components/footerLogin";
import { Box, Button } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useState, useEffect } from "react";
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

import { getJobInfo } from "@/utils/api/getJobInfo";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface Company {
  id: number;
  name: string;
  user_id: number;
  hourly_wage: number;
  night_wage: number;
  training_wage: number;
  training_start: Date | null;
  training_end: Date | null;
  closing_day: string;
  payout_day: string;
  payout_month_type: string;
  income_category_id: number;
  created_at: Date;
  updated_at: Date;
  training_time: number;
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
  const [closingDay, setClosingDay] = React.useState("15日");
  const [payoutMonth, setPayoutMonth] = React.useState("当月");
  const [payoutDay, setPayoutDay] = React.useState("25日");
  const [companies, setCompanies] = useState<Company[]>([]); // DBから取得した会社情報

  const changeClosingDay = (event: SelectChangeEvent) => {
    setClosingDay(event.target.value);
  };

  const changePayoutMonth = (event: SelectChangeEvent) => {
    setPayoutMonth(event.target.value);
  };

  const changePayoutDay = (event: SelectChangeEvent) => {
    setPayoutDay(event.target.value);
  };

  const changeCompanyName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCompanyName(event.target.value);
  };

  const changeTrainingTime = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.valueAsNumber;
    if (!isNaN(value)) {
      setTrainingTime(value);
    } else {
      setTrainingTime(0);
    }
  };

  const [trainingStartDay, setTrainingStartDay] = React.useState<Dayjs | null>(
    dayjs()
  );
  const [trainingEndDay, setTrainingEndDay] = React.useState<Dayjs | null>(
    dayjs()
  );
  const [companyName, setCompanyName] = useState("");
  const [hourlyWage, setHourlyWage] = React.useState("");
  const [nightWage, setNightWage] = React.useState("");
  const [trainingWage, setTrainingWage] = React.useState("");
  const [trainingTime, setTrainingTime] = React.useState<number>(0);

  const [tab, setTab] = React.useState(0);
  const tabChange = (event: React.SyntheticEvent, newTab: number) => {
    setTab(newTab);
  };

  const [selectedTraining, setSelectedTraining] = useState("研修なし");

  // railsAPI_勤務先情報の登録
  const saveJobInfo = async (event: React.FormEvent) => {
    event.preventDefault();
    let trainingData = {};

    // ラジオボタンの値に応じてPOST内容を切り替え
    if (selectedTraining === "研修なし") {
      trainingData = { training_type: "none" };
    } else if (selectedTraining === "研修期間で設定") {
      trainingData = {
        training_start: trainingStartDay,
        training_end: trainingEndDay,
        training_wage: trainingWage,
      };
    } else if (selectedTraining === "研修時間で設定") {
      trainingData = {
        training_time: trainingTime,
        training_wage: trainingWage,
      };
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/jobs`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "access-token": accessToken,
            client: client,
            uid: uid,
          },
          body: JSON.stringify({
            name: companyName,
            night_wage: Number(nightWage.replace(/,/g, "")),
            hourly_wage: Number(hourlyWage.replace(/,/g, "")),
            closing_day: closingDay,
            payout_month_type: payoutMonth,
            payout_day: payoutDay,
            income_category_id: 1,
            ...trainingData,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json(); // エラー詳細を取得
        const errorMessages = errorData.errors || [
          "不明なエラーが発生しました",
        ];
        throw new Error(errorMessages.join("\n"));
      }
      alert("勤務先情報を登録しました");
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const data = await getJobInfo();
         setCompanies(data);
        console.log(data);
      } catch (error) {
        console.error("セッションデータ取得エラー:", error);
      }
    };
    fetchJobData(); // 初回レンダリング時にセッション情報を取得
  }, []);

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
      <div>
        <main>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "110vh",
            }}
          >
            <h1>勤務先登録画面</h1>
            <Box sx={{ width: "100%" }}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs value={tab} onChange={tabChange} aria-label="tabChanges">
                  {companies.map((company, index) => (
                    <Tab key={index} label={company.name} />
                  ))}
                  <Tab label="新規作成" {...a11yProps(companies.length)} />
                </Tabs>
              </Box>
            </Box>

            {companies.map((company, index) => (
              <CustomTabPanel key={index} value={tab} index={index}>
                {/* 勤務先 */}
                <TextField
                  sx={{ m: 2 }}
                  id="outlined-multiline-flexible"
                  label="勤務先名"
                  multiline
                  maxRows={4}
                  value={company.name}
                  onChange={changeCompanyName}
                />

                {/* 時給 */}
                <FormControl sx={{ minWidth: 150, m: 2 }}>
                  <InputLabel htmlFor="outlined-hourlyWage">時給</InputLabel>
                  <OutlinedInput
                    id="outlined-hourlyWage"
                    label="時給"
                    value={company.hourly_wage}
                    onChange={(event) =>
                      formatAmountChange(event, setHourlyWage)
                    }
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
                    value={company.night_wage}
                    onChange={(event) =>
                      formatAmountChange(event, setNightWage)
                    }
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

                <Box sx={{ m: 2 }}>
                  <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel id="label-closingDay">締日</InputLabel>
                    <Select
                      labelId="label-closingDay"
                      id="select-closingDay"
                      value={company.closing_day}
                      label="締日"
                      onChange={changeClosingDay}
                    >
                      <MenuItem value={"5日"}>5日</MenuItem>
                      <MenuItem value={"15日"}>15日</MenuItem>
                      <MenuItem value={"25日"}>25日</MenuItem>
                      <MenuItem value={"月末日"}>月末日</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl sx={{ minWidth: 120, ml: 2 }}>
                    <InputLabel id="label-paymentMonth">支払月</InputLabel>
                    <Select
                      labelId="label-paymentMonth"
                      id="select-paymentMonth"
                      value={company.payout_month_type}
                      label="支払月"
                      onChange={changePayoutMonth}
                    >
                      <MenuItem value={"当月"}>当月</MenuItem>
                      <MenuItem value={"翌月"}>翌月</MenuItem>
                      <MenuItem value={"翌々月"}>翌々月</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl sx={{ minWidth: 120, ml: 2 }}>
                    <InputLabel id="label-paymentDay">支払日</InputLabel>
                    <Select
                      labelId="label-paymentDay"
                      id="select-paymentDay"
                      value={company.payout_day}
                      label="支払日"
                      onChange={changePayoutDay}
                    >
                      <MenuItem value={"5日"}>5日</MenuItem>
                      <MenuItem value={"10日"}>10日</MenuItem>
                      <MenuItem value={"15日"}>15日</MenuItem>
                      <MenuItem value={"20日"}>20日</MenuItem>
                      <MenuItem value={"25日"}>25日</MenuItem>
                      <MenuItem value={"月末日"}>月末日</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                {/* 研修関連の設定 */}
                <Box>
                  <FormLabel id="demo-radio-buttons-group-label">
                    研修期間の給与設定
                  </FormLabel>
                  <RadioGroup
                    sx={{ ml: 2 }}
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="研修なし"
                    name="radio-buttons-group"
                    onChange={(e) => setSelectedTraining(e.target.value)}
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
                    value={company.training_start ? dayjs(company.training_start) : null} 
                    onChange={(newDay) => setTrainingStartDay(newDay)}
                    format="YYYY/MM/DD"
                  />
                </LocalizationProvider>

                {/* 研修終了日入力フォーム */}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    sx={{ minWidth: 150, m: 2 }}
                    label="研修終了日"
                    value={company.training_start ? dayjs(company.training_end) : null} 
                    onChange={(newDay) => setTrainingEndDay(newDay)}
                    format="YYYY/MM/DD"
                  />
                </LocalizationProvider>

                <TextField
                  sx={{ minWidth: 150, m: 2 }}
                  id="outlined-number"
                  label="研修時間"
                  value={company.training_time}
                  onChange={changeTrainingTime}
                  type="number"
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                />

                {/* 研修中時給 */}
                <FormControl sx={{ minWidth: 150, m: 2 }}>
                  <InputLabel htmlFor="outlined-trainingWage">
                    研修中時給
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-trainingWage"
                    label="研修中時給"
                    value={company.training_wage}
                    onChange={(event) =>
                      formatAmountChange(event, setTrainingWage)
                    }
                    startAdornment={
                      <InputAdornment position="start">¥</InputAdornment>
                    }
                    inputProps={{ inputMode: "numeric" }} // モバイルのみ数字キーボードを表示
                  />
                </FormControl>

                <Box sx={{ display: "flex", mt: 2, textAlign: "center" }}>
                  <Button
                    type="submit"
                    variant="outlined"
                    onClick={saveJobInfo}
                  >
                    更新する
                  </Button>
                </Box>
              </CustomTabPanel>
            ))}

            {/* 新規作成用のタブパネル */}
            <CustomTabPanel value={tab} index={companies.length}>
                {/* 勤務先 */}
                <TextField
                  sx={{ m: 2 }}
                  id="outlined-multiline-flexible"
                  label="勤務先名"
                  multiline
                  maxRows={4}
                  value={companyName}
                  onChange={changeCompanyName}
                />

                {/* 時給 */}
                <FormControl sx={{ minWidth: 150, m: 2 }}>
                  <InputLabel htmlFor="outlined-hourlyWage">時給</InputLabel>
                  <OutlinedInput
                    id="outlined-hourlyWage"
                    label="時給"
                    value={hourlyWage}
                    onChange={(event) =>
                      formatAmountChange(event, setHourlyWage)
                    }
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
                    onChange={(event) =>
                      formatAmountChange(event, setNightWage)
                    }
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

                <Box sx={{ m: 2 }}>
                  <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel id="label-closingDay">締日</InputLabel>
                    <Select
                      labelId="label-closingDay"
                      id="select-closingDay"
                      value={closingDay}
                      label="締日"
                      onChange={changeClosingDay}
                    >
                      <MenuItem value={"5日"}>5日</MenuItem>
                      <MenuItem value={"15日"}>15日</MenuItem>
                      <MenuItem value={"25日"}>25日</MenuItem>
                      <MenuItem value={"月末日"}>月末日</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl sx={{ minWidth: 120, ml: 2 }}>
                    <InputLabel id="label-paymentMonth">支払月</InputLabel>
                    <Select
                      labelId="label-paymentMonth"
                      id="select-paymentMonth"
                      value={payoutMonth}
                      label="支払月"
                      onChange={changePayoutMonth}
                    >
                      <MenuItem value={"当月"}>当月</MenuItem>
                      <MenuItem value={"翌月"}>翌月</MenuItem>
                      <MenuItem value={"翌々月"}>翌々月</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl sx={{ minWidth: 120, ml: 2 }}>
                    <InputLabel id="label-paymentDay">支払日</InputLabel>
                    <Select
                      labelId="label-paymentDay"
                      id="select-paymentDay"
                      value={payoutDay}
                      label="支払日"
                      onChange={changePayoutDay}
                    >
                      <MenuItem value={"5日"}>5日</MenuItem>
                      <MenuItem value={"10日"}>10日</MenuItem>
                      <MenuItem value={"15日"}>15日</MenuItem>
                      <MenuItem value={"20日"}>20日</MenuItem>
                      <MenuItem value={"25日"}>25日</MenuItem>
                      <MenuItem value={"月末日"}>月末日</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                {/* 研修関連の設定 */}
                <Box>
                  <FormLabel id="demo-radio-buttons-group-label">
                    研修期間の給与設定
                  </FormLabel>
                  <RadioGroup
                    sx={{ ml: 2 }}
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="研修なし"
                    name="radio-buttons-group"
                    onChange={(e) => setSelectedTraining(e.target.value)}
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
                  value={trainingTime}
                  onChange={changeTrainingTime}
                  type="number"
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                />

                {/* 研修中時給 */}
                <FormControl sx={{ minWidth: 150, m: 2 }}>
                  <InputLabel htmlFor="outlined-trainingWage">
                    研修中時給
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-trainingWage"
                    label="研修中時給"
                    value={trainingWage}
                    onChange={(event) =>
                      formatAmountChange(event, setTrainingWage)
                    }
                    startAdornment={
                      <InputAdornment position="start">¥</InputAdornment>
                    }
                    inputProps={{ inputMode: "numeric" }} // モバイルのみ数字キーボードを表示
                  />
                </FormControl>

                <Box sx={{ display: "flex", mt: 2, textAlign: "center" }}>
                  <Button
                    type="submit"
                    variant="outlined"
                    onClick={saveJobInfo}
                  >
                    登録する
                  </Button>
                </Box>
            </CustomTabPanel>
          </Box>
        </main>
        <FooterLogin />
      </div>
    </>
  );
}
