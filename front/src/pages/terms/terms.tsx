import React from "react";
import { Container, Typography, Box, List, ListItem } from "@mui/material";

const TermsOfService = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        利用規約
      </Typography>

      <Box mb={3}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          第1条（適用）
        </Typography>
        <Typography>
          本利用規約（以下、「本規約」といいます。）は、「BalanceDays」（以下、「本サービス」といいます。）の利用条件を定めるものです。本サービスを利用する全てのユーザーは、本規約に同意した上で、本サービスを利用するものとします。
        </Typography>
      </Box>

      <Box mb={3}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          第2条（定義）
        </Typography>
        <List>
          <ListItem>「本サービス」とは、生活費の管理・予測を支援するために提供されるアプリケーションを指します。</ListItem>
          <ListItem>「ユーザー」とは、本サービスを利用するすべての個人を指します。</ListItem>
          <ListItem>「登録ユーザー」とは、Googleアカウントまたはその他の方法で本サービスに登録したユーザーを指します。</ListItem>
          <ListItem>「個人情報」とは、個人を識別できる情報を指します。</ListItem>
        </List>
      </Box>

      <Box mb={3}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          第3条（利用登録）
        </Typography>
        <List>
          <ListItem>本サービスの利用を希望する者は、本規約に同意の上、指定の方法により登録を行うものとします。</ListItem>
          <ListItem>登録情報に虚偽があった場合、本サービスの利用を制限または停止する場合があります。</ListItem>
        </List>
      </Box>

      <Box mb={3}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          第4条（禁止事項）
        </Typography>
        <Typography>ユーザーは、本サービスの利用にあたり、以下の行為を行ってはなりません。</Typography>
        <List>
          <ListItem>法令または公序良俗に違反する行為</ListItem>
          <ListItem>不正アクセスまたはシステムの不正利用</ListItem>
          <ListItem>本サービスの運営を妨害する行為</ListItem>
          <ListItem>他のユーザーの個人情報を不正に収集・利用する行為</ListItem>
          <ListItem>その他、運営者が不適切と判断する行為</ListItem>
        </List>
      </Box>

      <Box mb={3}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          第5条（サービスの提供・変更・中止）
        </Typography>
        <List>
          <ListItem>本サービスは、予告なくその内容を変更・停止する場合があります。</ListItem>
          <ListItem>本サービスの変更・停止によってユーザーに生じた損害について、一切の責任を負いません。</ListItem>
        </List>
      </Box>

      <Box mb={3}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          第6条（免責事項）
        </Typography>
        <List>
          <ListItem>本サービスは、正確性・完全性を保証するものではありません。</ListItem>
          <ListItem>本サービスの利用により発生したいかなる損害についても、運営者は責任を負いません。</ListItem>
          <ListItem>本サービスの利用に起因するユーザー間または第三者との紛争について、運営者は関与せず、責任を負いません。</ListItem>
        </List>
      </Box>

      <Box mb={3}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          第7条（個人情報の取り扱い）
        </Typography>
        <Typography>
          本サービスは、ユーザーの個人情報を適切に取り扱い、プライバシーポリシーに基づき管理します。
        </Typography>
      </Box>

      <Box mb={3}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          第8条（規約の変更）
        </Typography>
        <Typography>
          本規約は、必要に応じて変更されることがあります。変更後の規約は、本サービス上に掲載された時点で効力を生じるものとします。
        </Typography>
      </Box>
    </Container>
  );
};

export default TermsOfService;
