module.exports = {
    apps: [
      {
        name: "sketch-w",
        cwd: "/var/www/sketchupplaystore/web",
        script: "node_modules/.bin/next",
        args: "start -p 3000",
        env: { NODE_ENV: "production", PORT: 3000 },
        autorestart: true,
        max_restarts: 10,
        watch: false,
        out_file: "/var/www/sketchupplaystore/ops/server/pm2/web.out.log",
        error_file: "/var/www/sketchupplaystore/ops/server/pm2/web.err.log",
      },
    ],
  };
  