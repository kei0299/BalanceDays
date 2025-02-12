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
  training_time: number;
  training_settings: string;
  created_at: Date;
  updated_at :Date;
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
  const [closingDay, setClosingDay] = React.useState("5日");
  const [payoutMonth, setPayoutMonth] = React.useState("当月");
  const [payoutDay, setPayoutDay] = React.useState("25日");
  const [companies, setCompanies] = useState<Company[]>([]); // DBから取得した会社情報

  const changeCompanyName = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCompanyName(e.target.value as string);
  };

  const changeClosingDay = (e: SelectChangeEvent<string>) => {
    const newClosingDay = e.target.value; // 選ばれた値を取得
    setClosingDay(newClosingDay); // 状態を更新
  };

  const changePayoutMonth = (event: SelectChangeEvent) => {
    setPayoutMonth(event.target.value);
  };

  const changePayoutDay = (event: SelectChangeEvent) => {
    setPayoutDay(event.target.value);
  };

  const changeTrainingTime = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value; // `value` は文字列として取得
  
    // 数字以外の入力を防ぎつつ、空の場合は "" にする
    setTrainingTime(value === "" ? "" : Number(value));
  };

  const changeCompanyFieldSelect = (
    e: SelectChangeEvent,
    index: number
  ) => {
    const { name, value } = e.target; // name 属性でプロパティ識別
    const updatedCompanies = [...companies]; // 配列をコピー
    updatedCompanies[index] = {
      ...updatedCompanies[index], // 対象オブジェクトを展開
      [name]: name === "closing_day" || "payout_day" || "payout_month_type" ? value : Number(value)
    };
    setCompanies(updatedCompanies); // 状態を更新
  };

  const changeCompanyFieldInput = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
    index: number
  ) => {
    const { name, value } = e.target; // name 属性でプロパティ識別
  
    let newValue = value;
  
    // 数値フィールドの場合
    if (name !== "name" && name !== "training_settings") {
      newValue = newValue.replace(/^0+(\d)/, "$1"); // 先頭の 0 を削除（"0" 単体は許可）
      newValue = newValue.replace(/[^0-9]/g, ""); // 数字以外を削除
    }
  
    const updatedCompanies = [...companies]; // 配列をコピー
    updatedCompanies[index] = {
      ...updatedCompanies[index], // 対象オブジェクトを展開
      [name]: name === "name" || name === "training_settings" ? newValue : Number(newValue),
    };
    setCompanies(updatedCompanies);
  };

  const changeCompanyDateFieldInput = (newDate: dayjs.Dayjs | null, index: number, fieldName: string) => {
    if (!newDate) return; // 選択されていない場合は処理しない
  
    const updatedCompanies = [...companies];
    updatedCompanies[index] = {
      ...updatedCompanies[index],
      [fieldName]: newDate.format("YYYY-MM-DD"), // 日付を "YYYY-MM-DD" 形式で保存
    };
  
    setCompanies(updatedCompanies);
  };
  

  const [trainingStartDay, setTrainingStartDay] = React.useState<Dayjs | null>(
    dayjs()
  );
  const [trainingEndDay, setTrainingEndDay] = React.useState<Dayjs | null>(
    dayjs()
  );
  const [companyName, setCompanyName] = React.useState("");
  const [hourlyWage, setHourlyWage] = React.useState("");
  const [nightWage, setNightWage] = React.useState("");
  const [trainingWage, setTrainingWage] = React.useState("");
  const [trainingTime, setTrainingTime] = React.useState<string | number>("");

  const [tab, setTab] = React.useState(0);
  const tabChange = (event: React.SyntheticEvent, newTab: number) => {
    setTab(newTab);
  };

  const [selectedTraining, setSelectedTraining] = useState("no_training");

  // railsAPI_勤務先情報の登録
  const saveJobInfo = async (event: React.FormEvent) => {
    event.preventDefault();

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
            training_start: trainingStartDay,
            training_end: trainingEndDay,
            training_wage: Number(trainingWage.replace(/,/g, "")),
            training_time: trainingTime,
            training_settings: selectedTraining
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

  // railsAPI_勤務先情報の更新
  const updateJobInfo = async (jobId: number, updatedData: Company) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/jobs/${jobId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "access-token": accessToken,
          client: client,
          uid: uid,
        },
        body: JSON.stringify({job: updatedData}), // 現在のタブのデータだけ送信
      });

      if (!response.ok) {
        const errorData = await response.json(); // エラー詳細を取得
        const errorMessages = errorData.errors || [
          "不明なエラーが発生しました",
        ];
        throw new Error(errorMessages.join("\n"));
      }
      alert("勤務先情報を更新しました");
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

    // railsAPI_勤務先情報の削除
    const deleteJobInfo = async (
      jobId: number
    ) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/jobs/${jobId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "access-token": accessToken,
              client: client,
              uid: uid,
            },
            body: JSON.stringify({
              id: jobId,
            }),
          }
        );
        if (!response.ok) {
          // 失敗した場合、エラーメッセージを表示
          const errorData = await response.json();
          console.error("Error:", errorData);
          alert(`削除に失敗しました: ${errorData.error || "不明なエラー"}`);
          return;
        }
  
        // 成功した場合、通知
        const data = await response.json();
        alert(data.message || "削除完了");
  
        // ページをリロードして反映
        window.location.reload();
      } catch (error) {
        // ネットワークエラーやその他のエラーをキャッチ
        console.error("Network Error:", error);
        alert("エラーが発生しました。再度お試しください。");
      }
    };

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const data = await getJobInfo();
        setCompanies(data);
        console.log(data);
      } catch (error) {
        console.error("勤務先情報データ取得エラー:", error);
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
                  id={`company-name-${index}`}
                  label="勤務先名"
                  multiline
                  maxRows={4}
                  name="name"
                  value={company.name}
                  onChange={(e) => changeCompanyFieldInput(e, index)}
                />

                {/* 時給 */}
                <FormControl sx={{ minWidth: 150, m: 2 }}>
                  <InputLabel htmlFor="outlined-hourlyWage">時給</InputLabel>
                  <OutlinedInput
                    id={`hourly-wage-${index}`}
                    label="時給"
                    name="hourly_wage"
                    value={company.hourly_wage}
                    // onChange={(e) =>
                    //   formatAmountChange(e, setHourlyWage)
                    // }
                    onChange={(e) => changeCompanyFieldInput(e, index)}
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
                    id={`night-wage-${index}`}
                    label="深夜時給"
                    value={company.night_wage}
                    name="night_wage"
                    // onChange={(event) =>
                    //   formatAmountChange(event, setNightWage)
                    // }
                    onChange={(e) => changeCompanyFieldInput(e, index)}
                    startAdornment={
                      <InputAdornment position="start">¥</InputAdornment>
                    }
                    inputProps={{ inputMode: "numeric" }} // モバイルのみ数字キーボードを表示
                  />
                </FormControl>

                {/* 給料日設定 */}
                <Box>
                  <FormLabel id="radio-group-label">給料日の設定</FormLabel>
                </Box>

                <Box sx={{ m: 2 }}>
                  <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel id="label-closingDay">締日</InputLabel>
                    <Select
                      labelId="label-closingDay"
                      id={`closing-day-${index}`}
                      value={company.closing_day}
                      name="closing_day"
                      label="締日"
                      onChange={(e) => changeCompanyFieldSelect(e, index)}
                      // onChange={changeClosingDay}
                    >
                      <MenuItem value={"5日"}>5日</MenuItem>
                      <MenuItem value={"15日"}>15日</MenuItem>
                      <MenuItem value={"25日"}>25日</MenuItem>
                      <MenuItem value={"月末日"}>月末日</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl sx={{ minWidth: 120, ml: 2 }}>
                    <InputLabel id="label-payoutMonth">支払月</InputLabel>
                    <Select
                      labelId="label-paymentMonth"
                      id={`payout-month-${index}`}
                      value={company.payout_month_type}
                      name="payout_month_type"
                      label="支払月"
                      onChange={(e) => changeCompanyFieldSelect(e, index)}
                      // onChange={changePayoutMonth}
                    >
                      <MenuItem value={"当月"}>当月</MenuItem>
                      <MenuItem value={"翌月"}>翌月</MenuItem>
                      <MenuItem value={"翌々月"}>翌々月</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl sx={{ minWidth: 120, ml: 2 }}>
                    <InputLabel id="label-payoutDay">支払日</InputLabel>
                    <Select
                      labelId="label-payoutDay"
                      id={`payout-day-${index}`}
                      value={company.payout_day}
                      name="payout_day"
                      label="支払日"
                      onChange={(e) => changeCompanyFieldSelect(e, index)}
                      // onChange={changePayoutDay}
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
                  <FormLabel id="radio-buttons-group-label">
                    研修期間の給与設定
                  </FormLabel>
                  <RadioGroup
                    sx={{ ml: 2 }}
                    aria-labelledby="radio-buttons-group-label"
                    defaultValue={company.training_settings}
                    name="training_settings"
                    onChange={(e) => changeCompanyFieldInput(e,index)}
                  >
                    <FormControlLabel
                      value="no_training"
                      control={<Radio />}
                      label="研修なし"
                    />
                    <FormControlLabel
                      value="training_period"
                      control={<Radio />}
                      label="研修期間で設定"
                    />
                    <FormControlLabel
                      value="training_time"
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
                    value={
                      company.training_start
                        ? dayjs(company.training_start)
                        : null
                    }
                    onChange={(newDay) => changeCompanyDateFieldInput(newDay, index, "training_start")}
                    format="YYYY/MM/DD"
                  />
                </LocalizationProvider>

                {/* 研修終了日入力フォーム */}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    sx={{ minWidth: 150, m: 2 }}
                    label="研修終了日"
                    value={
                      company.training_start
                        ? dayjs(company.training_end)
                        : null
                    }
                    onChange={(newDay) => changeCompanyDateFieldInput(newDay, index, "training_end")}
                    format="YYYY/MM/DD"
                  />
                </LocalizationProvider>

                <TextField
                  sx={{ minWidth: 150, m: 2 }}
                  id="outlined-number"
                  label="研修時間(h)"
                  value={company.training_time}
                  name="training_time"
                  onChange={(e) => changeCompanyFieldInput(e, index)}
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
                    name="training_wage"
                    onChange={(e) => changeCompanyFieldInput(e, index)}
                    // onChange={(event) =>
                    //   formatAmountChange(event, setTrainingWage)
                    // }
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
                    onClick={async () => {
                      try {
                        await updateJobInfo(company.id,company); // 非同期関数をラップして呼び出し
                      } catch (error) {
                        console.error("エラー:", error);
                      }
                    }}
                  >
                    更新する
                  </Button>

                  <Button
                    type="submit"
                    variant="outlined"
                    onClick={async () => {
                      try {
                        await deleteJobInfo(company.id); // 非同期関数をラップして呼び出し
                      } catch (error) {
                        console.error("エラー:", error);
                      }
                    }}
                  >
                    削除
                  </Button>

                </Box>
              </CustomTabPanel>
            ))}

            {/* 新規作成用のタブパネル */}
            <CustomTabPanel value={tab} index={companies.length}>
              {/* 勤務先 */}
              <TextField
                sx={{ m: 2 }}
                id="outlined-newCompanyName"
                label="勤務先名"
                multiline
                maxRows={4}
                value={companyName}
                onChange={changeCompanyName}
              />

              {/* 時給 */}
              <FormControl sx={{ minWidth: 150, m: 2 }}>
                <InputLabel htmlFor="outlined-newHourlyWage">時給</InputLabel>
                <OutlinedInput
                  id="outlined-newHourlyWage"
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
                <InputLabel htmlFor="outlined-newNightWage">
                  深夜時給
                </InputLabel>
                <OutlinedInput
                  id="outlined-newNightWage"
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
                <FormLabel id="radio-group-newLabel">給料日の設定</FormLabel>
              </Box>

              <Box sx={{ m: 2 }}>
                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel id="label-newClosingDay">締日</InputLabel>
                  <Select
                    labelId="label-newClosingDay"
                    id="select-newClosingDay"
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
                  <InputLabel id="label-newPaymentMonth">支払月</InputLabel>
                  <Select
                    labelId="label-newPaymentMonth"
                    id="select-newPaymentMonth"
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
                  <InputLabel id="label-newPaymentDay">支払日</InputLabel>
                  <Select
                    labelId="label-newPaymentDay"
                    id="select-newPaymentDay"
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
                <FormLabel id="radio-group-newLabel">
                  研修期間の給与設定
                </FormLabel>
                <RadioGroup
                  sx={{ ml: 2 }}
                  aria-labelledby="radio-group-newLabel"
                  defaultValue="no_training"
                  name="radio-buttons-newGroup"
                  onChange={(e) => setSelectedTraining(e.target.value)}
                >
                  <FormControlLabel
                    value="no_training"
                    control={<Radio />}
                    label="研修なし"
                  />
                  <FormControlLabel
                    value="training_period"
                    control={<Radio />}
                    label="研修期間で設定"
                  />
                  <FormControlLabel
                    value="training_time"
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
                label="研修時間(h)"
                value={trainingTime}
                onChange={changeTrainingTime}
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
                  id="outlined-newTrainingWage"
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
                <Button type="submit" variant="outlined" onClick={saveJobInfo}>
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