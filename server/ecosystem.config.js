module.exports = {
  apps: [{
    name: 'kadeeo-api',
    script: 'server.js',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      DATABASE_URL: 'mysql://monuser:monpassword@localhost:3306/kadeeo',
      JWT_SECRET: 'votre-secret-jwt-super-securise'
    }
  }]
}