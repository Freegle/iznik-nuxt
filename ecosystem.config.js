module.exports = {
  apps: [
    {
      name: 'FD',
      append_env_to_name: true,
      script: 'npm',
      args: 'run start',
      instances: 0,
      autorestart: true,
      xp_backoff_restart_delay: 100,
      watch: false,
      max_memory_restart: '1G',
      env_production: {
        PORT: 3000,
        NODE_ENV: 'production'
      },
      env_development: {
        PORT: 3001,
        NODE_ENV: 'production'
      },
      env_debug: {
        PORT: 3002,
        NODE_ENV: 'development'
      }
    }
  ],

  deploy: {
    // The live site.
    production: {
      user: 'root',
      key: '/root/.ssh/id_rsa',
      host: ['46.43.9.246', '5.28.62.22'],
      ref: 'origin/master',
      repo: 'git@github.com:Freegle/iznik-nuxt.git',
      path: '/var/www/fdnuxt.live',
      'post-deploy':
        'npm install && npm run build && pm2 reload ecosystem.config.js --env production'
    },
    // The preview site which is used by volunteers for testing.  We're sticking with this name because it's firmly
    // ingrained into volunteers' heads.
    development: {
      user: 'root',
      key: '/root/.ssh/id_rsa',
      host: ['46.43.9.246', '5.28.62.22'],
      ref: 'origin/master',
      repo: 'git@github.com:Freegle/iznik-nuxt.git',
      path: '/var/www/fdnuxt.dev',
      'post-deploy':
        'npm install && npm run build && pm2 reload ecosystem.config.js --env development'
    },
    // The development site (despite the name) which is used by developers.
    debug: {
      user: 'root',
      key: '/root/.ssh/id_rsa',
      host: ['46.43.9.246', '5.28.62.22'],
      ref: 'origin/master',
      repo: 'git@github.com:Freegle/iznik-nuxt.git',
      path: '/var/www/fdnuxt.dbg',
      'post-deploy':
        'npm install && npm run build && pm2 reload ecosystem.config.js --env debug'
    }
  }
}
