module.exports = {
  apps: [
    {
      name: "gotong-backend",
      script: "app.js",
      cwd: "./backend",
      env: {
        NODE_ENV: "development",
        DB_HOST: "localhost",
        DB_USER: "gotong",
        DB_PASSWORD: "Lenkso0210@",
        DB_NAME: "user_register_db",
        JWT_SECRET: "your_jwt_secret"
      },
      env_production: {
        NODE_ENV: "production",
        DB_HOST: "localhost",
        DB_USER: "gotong",
        DB_PASSWORD: "Lenkso0210@",
        DB_NAME: "user_register_db",
        JWT_SECRET: "your_jwt_secret"
      }
    },
    {
      name: "gotong-frontend",
      script: "npm",
      args: "start",
      cwd: "./src",
      env: {
        NODE_ENV: "development",
        REACT_APP_API_URL: "http://106.52.158.123:5000/api"
      },
      env_production: {
        NODE_ENV: "production",
        REACT_APP_API_URL: "http://106.52.158.123:5000/api"
      }
    }
  ]
};
