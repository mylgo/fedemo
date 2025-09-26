module.exports = {
  apps: [
    {
      name: 'server-send-events-demo',
      script: './index.js',
      watch: true,
      ignore_watch: ['node_modules', 'logs'],
      env: {
        NODE_ENV: 'development',
        PORT: 8587,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 8888,
      },
    },
  ],
}
