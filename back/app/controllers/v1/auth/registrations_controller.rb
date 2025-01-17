class V1::Auth::RegistrationsController < DeviseTokenAuth::RegistrationsController
  def create
    # メールアドレスがDBに存在するか確認
    existing_user = User.find_by(email: sign_up_params[:email])

    if existing_user && existing_user.delete_at.present?
      # ユーザーデータの初期化
      reset_user_data(existing_user)

      # 初期化後、再登録用に既存ユーザーを再利用
      @resource = existing_user
      @resource.assign_attributes(sign_up_params.merge(delete_at: nil))
    else
      # 通常の新規登録処理
      @resource = User.new(sign_up_params)
    end

    # 登録処理
    if @resource.save
      # トークンを生成してレスポンスに含める
      @token = @resource.create_new_auth_token
      sign_in(:user, @resource) # ユーザーをログイン状態にする
      render json: {
        status: 'success',
        data: @resource,
        token: @token
      }
    else
      render_create_error
    end
  end

  private

  # サインアップ時に許可するパラメータ
  def sign_up_params
    params.require(:registration).permit(:email, :password, :password_confirmation)
  end

  # ユーザーのデータを初期化するメソッド
  def reset_user_data(user)
    user.update!(
      delete_at: nil,
      balance: nil, 
      chara_status: nil,
      caution_lv: nil,
      warning_lv: nil
    )
    # 予算、支出ログ、収入ログをリセット・削除
    user.budgets.destroy_all
    user.expense_logs.destroy_all
    user.income_logs.destroy_all
  end
end
