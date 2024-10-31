Rails.application.routes.draw do
  mount_devise_token_auth_for 'User', at: 'auth'

  namespace :v1 do
    mount_devise_token_auth_for "User", at: "auth"
  end

  resources :posts
  get "up" => "rails/health#show", as: :rails_health_check



end
