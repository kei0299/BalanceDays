Rails.application.routes.draw do
  namespace :v1 do
    mount_devise_token_auth_for "User", at: "auth", controllers: {
    registrations: 'v1/auth/registrations',
    omniauth_callbacks: 'v1/auth/omniauth_callbacks'
  }

  resources :reports, only: [] do
    collection do
      get 'pie_chart', to: 'reports#pie_chart'
      get 'total_gauge', to: 'reports#total_gauge'
      get 'category_gauge', to: 'reports#category_gauge'
    end
  end

    resources :budgets, only: [:index, :create] do
      collection do
        get :sum_month_budget
      end
    end
    resources :transactions, only: [:index, :update, :destroy]
    resources :characters, only: [:index]
    resources :shifts, only: [:index, :create, :update, :destroy]

    resources :jobs, only: [:index, :create, :update, :destroy] do
      collection do
        get 'company_index', to: 'jobs#company_index'
      end
    end

    namespace :expense do
      resources :expense_categories, only: [:index]
      resources :expense_log, only: [:index, :create, :update]
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
      delete 'delete_user', to: 'users#destroy'
    end
  end
  
end
