FROM node:18.18.0
# タイムゾーンを設定するために tzdata パッケージをインストール
RUN apt-get update && apt-get install -y tzdata

# タイムゾーンを指定
ENV TZ=Asia/Tokyo

# タイムゾーン設定を反映させる
RUN dpkg-reconfigure -f noninteractive tzdata

WORKDIR /app