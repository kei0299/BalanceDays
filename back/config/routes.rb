Rails.application.routes.draw do
  namespace :v1 do
    mount_devise_token_auth_for "User", at: "auth", controllers: {
    registrations: 'v1/auth/registrations'
  }

    resources :budgets, only: [:index, :create]
    resources :transactions, only: [:index, :update, :destroy]

    namespace :expense do
      resources :expense_categories, only: [:index]
      resources :expense_log, only: [:create]
    end
  
    namespace :income do
      resources :income_log, only: [:create]
      resources :income_categories, only: [:index]
    end

    namespace :auth do
      resources :sessions, only: [:index]
      # resouceだとusers/:idになる
      put 'users', to: 'users#update'
    end
  end
  
end
