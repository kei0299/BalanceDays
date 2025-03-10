# 貯金残高、注意/警告レベルの設定用コントローラー
class V1::Auth::UsersController < ApplicationController
  before_action :authenticate_user!

  # ログイン確認用
  def index
    if current_user
      render json: { is_login: true, data: current_user }
    else
      render json: { is_login: false, message: "ユーザーが存在しません" }
    end
  end

  # 生存期間、貯金残高の登録
  def update
    @user = current_user
    if @user.update(user_params)
      render json: @user, status: :ok
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @user = current_user
    if @user.destroy
      render json: { message: 'User deleted successfully' }, status: :ok
    else
      render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
    end    
  end

  private

  def user_params
    params.require(:user).permit(:email, :uid, :balance, :caution_lv, :warning_lv)
  end
end
