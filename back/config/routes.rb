Rails.application.routes.draw do
  namespace :v1 do
    mount_devise_token_auth_for "User", at: "auth", controllers: {
    registrations: 'v1/auth/registrations'
  }

    namespace :auth do
      resources :sessions, only: [:index]
      get 'users', to: 'users#index'
      put 'users', to: 'users#update'
      # resources :users, only: [:index, :update]
    end
  end

end
