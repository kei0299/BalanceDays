# ログイン状態確認用コントローラー
class V1::Auth::SessionsController < ApplicationController
  def index
    if current_v1_user
      render json: { is_login: true, data: current_api_v1_user }
    else
      render json: { is_login: false, message: "ユーザーが存在しません" }
    end
  end
end
