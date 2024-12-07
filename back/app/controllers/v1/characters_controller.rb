class V1::CharactersController < ApplicationController
  before_action :authenticate_v1_user!

  def index
    chara_status = User.find_by(id: current_v1_user).chara_status
  
    render json: chara_status, status: :ok
  end

end
