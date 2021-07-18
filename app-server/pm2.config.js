module.exports = {
  apps: [
    {
      name: 'app-server',
      script: './bin/www.js',
      autorestart: true,
      instances: Number(process.env.NUM_OF_CLUSTERS),
      exec_mode: 'cluster',
      combine_logs: true,
      time: true,
    },
  ],
};
