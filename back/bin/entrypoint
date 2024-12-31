#!/bin/bash -e

# jemallocの設定 (省略可能)
if [ -z "${LD_PRELOAD+x}" ] && [ -f /usr/lib/*/libjemalloc.so.2 ]; then
  export LD_PRELOAD="$(echo /usr/lib/*/libjemalloc.so.2)"
fi

# データベースの準備とシードデータの投入を追加
if [ "${1}" == "rails" ] && [ "${2}" == "server" ]; then
  echo "Preparing the database..."
  bundle exec rails db:prepare
  echo "Seeding the database..."
  bundle exec rails db:seed
fi

# 最後にコマンドを実行
exec "$@"
