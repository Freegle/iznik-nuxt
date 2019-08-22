module.exports = {
  apps : [
    {
      name: "nuxt-prod",
      script: "npm",
      args: "run start",
      instances: 0,
      autorestart: true,
      xp_backoff_restart_delay: 100,
      watch: false,
      max_memory_restart: '1G',
      env: {
        "PORT": "3001"
      }
    }
  ],

  deploy : {
    production : {
      user : 'root',
      key  : '/root/.ssh/id_rsa',
      host : ['46.43.9.246', '5.28.62.22'],
      ref  : 'origin/master',
      repo : 'git@github.com:Freegle/iznik-nuxt.git',
      path : '/var/www/fdnuxt',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js'
    }
  }
};
