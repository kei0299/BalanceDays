import Header from "@/components/header";
import FooterLogin from "@/components/footerLogin";
import { Button, Stack, Box } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Image from "next/image";
import { parseCookies } from "nookies";
import React, { useEffect, useState } from "react";
import { checkSession } from "@/utils/auth/checkSession";

const BalanceInput = () => {
  const [balance, setBalance] = useState("");
  const [caution, setCaution] = useState<number>(1);
  const [warning, setWarning] = useState<number>(1);

  const selectCaution = (event: SelectChangeEvent<unknown>) => {
    setCaution(Number(event.target.value)); // 'unknown' から 'number' にキャスト
  };

  const selectWarning = (event: SelectChangeEvent<unknown>) => {
    setWarning(Number(event.target.value));
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

  // 金額をフォーマットする関数
  const formatBalance = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, ""); // 数字以外を削除
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ","); // 3桁ごとにカンマを挿入
  };

  const addComma = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBalance(formatBalance(event.target.value)); // カンマ区切りを適用して状態を更新
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();

    // railsAPI_生存確認設定の登録
    const cookies = parseCookies();
    const accessToken = cookies["accessToken"];
    const client = cookies["client"];
    const uid = cookies["uid"];

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/users`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "access-token": accessToken,
            client: client,
            uid: uid,
          },
          body: JSON.stringify({
            balance: Number(balance.replace(/,/g, "")),
            caution_lv: caution,
            warning_lv: warning,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("設定に失敗しました");
      }
      alert("設定しました");
      window.location.reload()
    } catch (error) {
      console.error(error);
    }
  };

  const [sessionData, setSessionData] = useState<any>(null); // セッションデータを状態として管理

  useEffect(() => {
    // 非同期関数を定義してセッション情報を取得
    const fetchSessionData = async () => {
      try {
        const data = await checkSession(); // checkSessionの結果を取得
        setSessionData(data); // セッション情報を状態に保存

        //　初期値の設定
        if (data.data?.balance) {
          setBalance(formatBalance(data.data.balance.toString()));
        }
        if (data.data?.caution_lv) {
          setCaution(data.data.caution_lv);
        }
        if (data.data?.warning_lv) {
          setWarning(data.data.warning_lv);
        }
      } catch (error) {
        console.error("セッションチェックエラー", error);
      }
    };

    fetchSessionData(); // 初回レンダリング時にセッション情報を取得
  }, []);

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
              textAlign: "center",
            }}
          >
            <h1>生存期間設定</h1>

            {/* セッションデータを表示 */}
            <div style={{ marginBottom: "20px" }}>
              {sessionData ? (
                <ul>
                  <li>
                    <strong>貯金残高:</strong>{" "}
                    {sessionData.data?.balance || "設定なし"}
                  </li>
                  <li>
                    <strong>注意レベル:</strong>{" "}
                    {sessionData.data?.caution_lv || "設定なし"}
                  </li>
                  <li>
                    <strong>警告レベル:</strong>{" "}
                    {sessionData.data?.warning_lv || "設定なし"}
                  </li>
                </ul>
              ) : (
                <p>セッションデータを取得中...</p>
              )}
            </div>

            <Box sx={{ display: "flex", alignItems: "flex-end", mb: 2 }}>
              <FormControl fullWidth sx={{ m: 1 }}>
                <InputLabel htmlFor="outlined-adornment-balance">
                  貯金残高
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-balance"
                  label="貯金残高"
                  value={balance}
                  onChange={addComma}
                  startAdornment={
                    <InputAdornment position="start">¥</InputAdornment>
                  }
                  inputProps={{ inputMode: "numeric" }} // モバイルのみ数字キーボードを表示
                />
              </FormControl>
            </Box>

            <Stack spacing={2} direction="row">
              <Image
                src="/image/caution.png"
                alt="Sample Image"
                width={100}
                height={100}
                priority
              />
              {/* 注意レベル通知 */}
              <Box sx={{ display: "flex", alignItems: "flex-end", mb: 2 }}>
                <Box sx={{ minWidth: 150 }}>
                  <FormControl fullWidth>
                    <InputLabel id="select-caution-label">
                      注意レベル通知
                    </InputLabel>
                    <Select
                      labelId="select-caution-label"
                      id="caution-select"
                      value={caution}
                      label="注意レベル通知"
                      onChange={selectCaution}
                      MenuProps={MenuProps}
                    >
                      {[...Array(12)].map((_, index) => (
                        <MenuItem key={index + 1} value={(index + 1)}>
                          {index + 1}ヶ月
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            </Stack>

            <Stack spacing={2} direction="row">
              {/* 警告レベル通知 */}
              <Image
                src="/image/warning.png"
                alt="Sample Image"
                width={100}
                height={100}
              />
              <Box sx={{ display: "flex", alignItems: "flex-end", mb: 2 }}>
                <Box sx={{ minWidth: 150 }}>
                  <FormControl fullWidth>
                    <InputLabel id="select-warning-label">
                      警告レベル通知
                    </InputLabel>
                    <Select
                      labelId="select-warning-label"
                      id="warning-select"
                      value={warning}
                      label="警告レベル通知"
                      onChange={selectWarning}
                      MenuProps={MenuProps}
                    >
                      {[...Array(12)].map((_, index) => (
                        <MenuItem key={index + 1} value={(index + 1)}>
                          {index + 1}ヶ月
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            </Stack>

            <Button type="submit" variant="outlined" onClick={handleSave}>
              登録する
            </Button>
          </Box>
        </main>
        <FooterLogin />
      </div>
    </>
  );
};

export default BalanceInput;
