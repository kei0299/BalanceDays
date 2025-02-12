import React from "react";
import { Container, Typography, Box, List, ListItem } from "@mui/material";

const PrivacyPolicy = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        プライバシーポリシー
      </Typography>

      <Box mb={3}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          1. 収集する情報
        </Typography>
        <Typography>本サービスでは、以下の情報を収集する場合があります。</Typography>
        <List>
          <ListItem>Googleアカウント情報（認証のため）</ListItem>
          <ListItem>ユーザーが入力した生活費・収支データ</ListItem>
          <ListItem>アプリの利用状況（アクセス解析のため）</ListItem>
        </List>
      </Box>

      <Box mb={3}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          2. 情報の利用目的
        </Typography>
        <Typography>収集した情報は、以下の目的で利用します。</Typography>
        <List>
          <ListItem>本サービスの提供および運営</ListItem>
          <ListItem>利用状況の分析によるサービス向上</ListItem>
          <ListItem>必要な情報の通知</ListItem>
        </List>
      </Box>

      <Box mb={3}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          3. 情報の管理
        </Typography>
        <List>
          <ListItem>ユーザーの個人情報は、適切な管理のもと第三者に提供されません。</ListItem>
          <ListItem>ただし、法令に基づき開示が必要な場合はこの限りではありません。</ListItem>
        </List>
      </Box>

      <Box mb={3}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          4. クッキー（Cookie）の使用
        </Typography>
        <Typography>
          本サービスでは、利便性向上のためCookieを使用することがあります。ユーザーはブラウザの設定によりCookieを拒否できますが、その場合、一部機能が利用できなくなる可能性があります。
        </Typography>
      </Box>

      <Box mb={3}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          5. プライバシーポリシーの変更
        </Typography>
        <Typography>
          本ポリシーは、必要に応じて変更されることがあります。変更後のポリシーは、本サービス上に掲載された時点で効力を生じるものとします。
        </Typography>
      </Box>
    </Container>
  );
};

export default PrivacyPolicy;


