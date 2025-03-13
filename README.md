# BalanceDays
## サービス概要
このアプリは、失業者やフリーターが日々の生活費を効率的に管理し、今後の生活資金を簡単に予測できるツールです。  
現在の貯金額と月々の支出を入力するだけで、どれくらいの期間今の生活を維持できるかをすぐに把握できます。  
また、バイト先を複数登録することができ、時給や深夜手当などの設定を行ったうえで、シフトを入力すると自動的に収入が反映されます。  
生活の不安を軽減し、計画的な家計管理をサポートするアプリです。  

## このサービスへの思い・作りたい理由  
私は今回、学校に通うために一時的に仕事を退職しましたが、その際に最も不安に感じたのが「生活費をどうやって管理するか」でした。  
一般的な家計簿アプリは多く存在しますが、単に支出を記録するだけでは、実際に今の貯金でどれくらい生活できるのかを判断することが難しいと感じました。  

同じように、体調の問題でやむを得ず仕事を辞めた方や、夢や目標を持ってフリーターとして働いている方々も、将来の生活資金に不安を感じることが多いのではないでしょうか。  
そんな方々に少しでも安心を届け、計画的に生活をサポートできるツールを作りたいと思い、このアプリを考案しました。  
生活の不安を少しでも軽減し、前向きに未来を見据えられるようなサポートを目指しています。  

## ユーザー層について
失業者やフリーターで今後の生活が金銭面的に不安な人。   

## サービスの利用イメージ
1. 新規登録 or ログイン  
  ユーザーはまず、アカウント登録を行います。ログインには、Googleアカウントが使用可能です。    

2. 貯金額と生存期間を設定  
  生存期間設定画面から貯金額と通知の設定をします。  
  この情報に基づいて、現在の生活資金でどれくらい生活できるかを予測しアラートが出るタイミングを設定します。  
  アラートは注意レベルと警告レベルの２段階に分かれており、残りの生活期間(○ヶ月)になることでホーム画面のキャラクターが変更されて注意を促します。

3. 予算設定
  月々の固定支出を予算に設定します。    

4. 勤務先の登録  
  ユーザーは、複数の勤務先を登録できます。  
  各勤務先ごとに、以下の情報を入力します。
  時給：通常時給および深夜割増  
  研修期間（時間）：期間中は設定した研修時給で計算されます。  
  給与日の設定：締日、給料日を入れておくことで給料日の確認ができます。    

5. 日々の収支管理  
  ユーザーは、日々の収支を簡単に入力できます。食費や交通費、娯楽費などのカテゴリを選んで入力します。  
  これにより、カレンダー上で収支の変動が確認できます。 

6. シフト登録  
  勤務先のシフトを登録できます。  
  勤務時間と必要であれば休憩時間を入力することで給与計算を行い、カレンダーに反映されます。  

7. 支出の分析  
  レポート画面では、カテゴリごとの支出や予算に対しての実績がグラフで確認できます。  

## ユーザーの獲得について
SEO対策を行い、検索結果からのアクセスを長期的に増加させる。  

## サービスの差別化ポイント・推しポイント
従来の家計簿アプリでは、収支の記録はできても現在の貯金でどれだけの期間生活できるかを把握するのは難しいです。  
そのため、ユーザーが別途計算して生活計画を立てる手間がかかります。  
本サービスは、貯金や支出をもとに生活可能期間を簡単に計算し、すぐに結果を提供します。  

## 機能候補
### MVPリリース
- 作成ページ
  - TOP画面
  - 新規作成画面
  - ログイン画面
  - ホーム画面
  - プロフィール画面
  - カレンダー画面
  - レポート画面
  - 生存期間設定画面
  - 勤務先登録画面

Googleログイン機能  
収支入力  
バイト先登録機能  
シフト入力  
カテゴリ分類  
収支をカテゴリごとに円グラフで表示  
予算比をゲージで表示  
アラート発生予測時期を折れ線グラフで表示  

### 将来的に
通知機能  
  - 予算が超えそうな時  
  - 予算が超えた時  
レスポンシブ対応 
テーマカラー変更  
節約アドバイス機能追加  
予定された収支のリマインダー  
LINEチャットbotへの相談機能  
失業手当がもらえるかどうかの診断機能  
失業手当の目安金額診断  
定年退職者にも対応
（年金、退職金、将来の医療費、介護費用などを追加）
学生や主婦/主夫モードの追加  
目安となる保険料や住民税が自動的に算出され、月々の支出に追加される機能  
  - 年齢：将来の税金や保険料算出に必要。  
  - 扶養人数：世帯の人数に基づいて、国民健康保険や住民税などの目安を計算する。  
  - 前年度の収入：住民税、国民健康保険の金額を正確に算出するために使用。  

## 収益化について
節約アドバイス機能を課金にする  
転職関連会社との連携  
保険関連会社との連携  
資産運用会社との連携  

| 使用技術  |   |
| ------------- | ------------- |
| バックエンド   | Ruby on Rails（APIモード） |
| フロントエンド   |  React,Next.js |
| フレームワーク  | MUI |
| データベース  | PostgreSQL |
| インフラ  | Render.com,Vercel |

## 画面遷移図
https://www.figma.com/design/fUmQooXllg8ZSFDwMfiOwe/myapp?node-id=0-1&t=okIjQUZCgKaHWG1l-1


## ER図
https://dbdiagram.io/d/myapp-66dd684deef7e08f0e07b61b
