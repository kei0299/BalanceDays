import Header from "@/components/header";
import FooterLogin from "@/components/footerLogin";
import { Box } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import React, { useState } from "react";

  const AmountInput = () => {
    const [amount, setAmount] = useState("");
  
    // 金額をフォーマットする関数
    const formatAmount = (value: string) => {
      const numericValue = value.replace(/[^0-9]/g, ""); // 数字以外を削除
      return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ","); // 3桁ごとにカンマを挿入
    };
  
    const addComma = (event: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = event.target.value;
      setAmount(formatAmount(rawValue)); // カンマ区切りを適用して状態を更新
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
              textAlign: "center",
            }}
          >
            <h1>生存期間設定</h1>

            <Box sx={{ display: "flex", alignItems: "flex-end", mb: 1 }}>
              <FormControl fullWidth sx={{ m: 1 }}>
                <InputLabel htmlFor="outlined-adornment-amount">
                  貯金残高
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-amount"
                  value={amount}
                  onChange={addComma}
                  startAdornment={
                    <InputAdornment position="start">¥</InputAdornment>
                  }
                  label="Amount"
                  inputProps={{ inputMode: "numeric" }} // モバイルのみ数字キーボードを表示
                />
              </FormControl>

              {/* <Button type="submit" variant="outlined" onClick={handleSave}>
                保存する
              </Button> */}
            </Box>
          </Box>
        </main>
        <FooterLogin />
      </div>
    </>
  );
}

export default AmountInput;
