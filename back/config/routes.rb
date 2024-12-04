Rails.application.routes.draw do
  namespace :v1 do
    mount_devise_token_auth_for "User", at: "auth", controllers: {
    registrations: 'v1/auth/registrations'
  }

    resources :budgets, only: [:index, :create]
    resources :transactions, only: [:index, :update, :destroy]

    namespace :expense do
      resources :expense_categories, only: [:index]
      resources :expense_log, only: [:index, :create, :update]
      # put 'expense_log', to: 'expense_log#update'
    end
  
    namespace :income do
      resources :income_categories, only: [:index]
      resources :income_log, only: [:create, :update]
      # put 'income_log', to: 'income_log#update'
    end

    namespace :auth do
      resources :sessions, only: [:index]
      # resouceだとusers/:idになる
      put 'users', to: 'users#update'
    end
  end
  
end
