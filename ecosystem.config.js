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
      wait_ready: true,
      listen_timeout: 10000,
      env_production: {
        PORT: 3000,
        NODE_ENV: 'production',
        IZNIK_API: 'https://fdapilive.ilovefreegle.org'
      },
      env_development: {
        PORT: 3001,
        NODE_ENV: 'production',
        IZNIK_API: 'https://fdapidev.ilovefreegle.org'
      },
      env_debug: {
        PORT: 3002,
        NODE_ENV: 'development',
        IZNIK_API: 'https://fdapidbg.ilovefreegle.org'
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
        'monit stop nginx && npm install && npm run build && php ./mungeindex.php > /tmp/a.a && cp /tmp/a.a .nuxt/index.js && pm2 reload FD-production && /etc/waitfornode && monit start nginx'
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
        'npm install && npm run build && php ./mungeindex.php > /tmp/a.a && cp /tmp/a.a .nuxt/index.js && pm2 reload FD-development'
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
        'npm install && npm run build && php ./mungeindex.php > /tmp/a.a && cp /tmp/a.a .nuxt/index.js && pm2 reload FD-debug'
    }
  }
}
