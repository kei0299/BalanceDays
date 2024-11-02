Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'localhost:8000', '127.0.0.1:8000', 'https://myapp-three-rho.vercel.app/'

    resource "*",
      headers: :any,
      expose: ["access-token", "uid", "client"],
      methods: [:get, :post, :put, :patch, :delete, :options, :head]
  end
end
