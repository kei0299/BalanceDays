import Header from "@/components/headerLogin";
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
import { useAlert } from "@/components/AlertContext";

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
  updated_at: Date;
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
  const { showAlert } = useAlert();
  const [closingDay, setClosingDay] = React.useState("5日");
  const [payoutMonth, setPayoutMonth] = React.useState("当月");
  const [payoutDay, setPayoutDay] = React.useState("25日");
  const [companies, setCompanies] = useState<Company[]>([]);

  const changeCompanyName = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCompanyName(e.target.value as string);
  };

  const changeClosingDay = (e: SelectChangeEvent<string>) => {
    const newClosingDay = e.target.value;
    setClosingDay(newClosingDay);
  };

  const changePayoutMonth = (event: SelectChangeEvent) => {
    setPayoutMonth(event.target.value);
  };

  const changePayoutDay = (event: SelectChangeEvent) => {
    setPayoutDay(event.target.value);
  };

  const changeTrainingTime = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setTrainingTime(value === "" ? "" : Number(value));
  };

  // フォーム編集できるようにするためにコピーする
  const changeCompanyFieldSelect = (e: SelectChangeEvent, index: number) => {
    const { name, value } = e.target;
    const updatedCompanies = [...companies];
    updatedCompanies[index] = {
      ...updatedCompanies[index],
      [name]:
        name === "closing_day" || "payout_day" || "payout_month_type"
          ? value
          : Number(value),
    };
    setCompanies(updatedCompanies);
  };

    // フォーム編集できるようにするためにコピーする
  const changeCompanyFieldInput = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
    index: number
  ) => {
    const { name, value } = e.target;

    let newValue = value;

    // 数値フィールドの場合
    if (name !== "name" && name !== "training_settings") {
      newValue = newValue.replace(/^0+(\d)/, "$1");
      newValue = newValue.replace(/[^0-9]/g, "");
    }

    const updatedCompanies = [...companies];
    updatedCompanies[index] = {
      ...updatedCompanies[index],
      [name]:
        name === "name" || name === "training_settings"
          ? newValue
          : Number(newValue),
    };
    setCompanies(updatedCompanies);
  };

  const changeCompanyDateFieldInput = (
    newDate: dayjs.Dayjs | null,
    index: number,
    fieldName: string
  ) => {
    if (!newDate) return;

    const updatedCompanies = [...companies];
    updatedCompanies[index] = {
      ...updatedCompanies[index],
      [fieldName]: newDate.format("YYYY-MM-DD"),
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
            training_settings: selectedTraining,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessages = errorData.errors || [
          "不明なエラーが発生しました",
        ];
        throw new Error(errorMessages.join("\n"));
      }
      showAlert("勤務先情報を登録しました。", "success");
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  // railsAPI_勤務先情報の更新
  const updateJobInfo = async (jobId: number, updatedData: Company) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/jobs/${jobId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "access-token": accessToken,
            client: client,
            uid: uid,
          },
          body: JSON.stringify({ job: updatedData }), // 現在のタブのデータだけ送信
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessages = errorData.errors || [
          "不明なエラーが発生しました",
        ];
        throw new Error(errorMessages.join("\n"));
      }
      showAlert("勤務先情報を更新しました。", "success");
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  // railsAPI_勤務先情報の削除
  const deleteJobInfo = async (jobId: number) => {
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
        const errorData = await response.json();
        console.error("Error:", errorData);
        showAlert("勤務先情報の削除に失敗しました。", "error");
        return;
      }
      showAlert("勤務先情報を削除しました","success");
      window.location.reload();
    } catch (error) {
      console.error("Network Error:", error);
      showAlert("エラーが発生しました。再度お試しください。", "error");
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
    fetchJobData();
  }, []);

  // 金額をフォーマットする関数
  const formatAmountChange = <T extends HTMLInputElement | HTMLTextAreaElement>(
    event: React.ChangeEvent<T>,
    setAmount: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const numericValue = event.target.value.replace(/[^0-9]/g, "");
    const formattedValue = formatNum(numericValue);
    setAmount(formattedValue);
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
                    <Tab
                      key={index}
                      label={company.name}
                      sx={{ textTransform: "none" }}
                    />
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
                    onChange={(e) => changeCompanyFieldInput(e, index)}
                    startAdornment={
                      <InputAdornment position="start">¥</InputAdornment>
                    }
                    inputProps={{ inputMode: "numeric" }}
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
                    onChange={(e) => changeCompanyFieldInput(e, index)}
                    startAdornment={
                      <InputAdornment position="start">¥</InputAdornment>
                    }
                    inputProps={{ inputMode: "numeric" }}
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
                    onChange={(e) => changeCompanyFieldInput(e, index)}
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
                    onChange={(newDay) =>
                      changeCompanyDateFieldInput(
                        newDay,
                        index,
                        "training_start"
                      )
                    }
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
                    onChange={(newDay) =>
                      changeCompanyDateFieldInput(newDay, index, "training_end")
                    }
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
                    startAdornment={
                      <InputAdornment position="start">¥</InputAdornment>
                    }
                    inputProps={{ inputMode: "numeric" }}
                  />
                </FormControl>

                <Box sx={{ display: "flex", m: 2, textAlign: "center" }}>
                  <Button
                    type="submit"
                    variant="outlined"
                    onClick={async () => {
                      try {
                        await updateJobInfo(company.id, company);
                      } catch (error) {
                        console.error("エラー:", error);
                      }
                    }}
                  >
                    更新する
                  </Button>

                  <Button
                    color="error"
                    sx={{ ml: 2 }}
                    type="submit"
                    variant="outlined"
                    onClick={async () => {
                      try {
                        await deleteJobInfo(company.id);
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
                  inputProps={{ inputMode: "numeric" }}
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
                  inputProps={{ inputMode: "numeric" }}
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
                  inputProps={{ inputMode: "numeric" }}
                />
              </FormControl>

              <Box sx={{ display: "flex", m: 2, textAlign: "center" }}>
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
