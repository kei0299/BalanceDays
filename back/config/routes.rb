Rails.application.routes.draw do
  namespace :v1 do
    mount_devise_token_auth_for "User", at: "auth", controllers: {
    registrations: 'v1/auth/registrations'
  }

    namespace :auth do
      resources :sessions, only: [:index]
      resources :expense_categories, only: [:index]
      resources :budgets, only: [:index, :create]
      # resouceだとusers/:idになる
      put 'users', to: 'users#update'
    end
  end

end
