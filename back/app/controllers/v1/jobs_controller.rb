class V1::JobsController < ApplicationController
  before_action :authenticate_v1_user!

  def index
    jobs = Job.where(user_id: current_v1_user)
    render json: jobs
  end

  def create
    job = current_v1_user.jobs.build(job_params) 
    if job.save
      render json: { message: "Job created successfully", job: job }, status: :created
    else
      render json: { errors: job.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def job_params
    params.require(:job).permit(:user_id, :name, :hourly_wage, :night_wage, :training_wage, :training_start, :training_end, :closing_day, :payout_day, :payout_month_type, :income_category_id, :training_time)
  end
end
