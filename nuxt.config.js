module.exports = {
  router: {
    linkActiveClass: 'active', // nuxt-link active自定义样式
    extendRoutes(routes, resolve) {
      // console.log(routes)
      routes.splice(0) // 删除掉原本自动生成的路由配置
      routes.push(...[
        {
          path: '/',
          component: resolve(__dirname, 'pages/layout/'),
          children: [
            {
              path: '',
              name: 'home',
              component: resolve(__dirname, 'pages/home/')
            },
            {
              path: 'login',
              name: 'login',
              component: resolve(__dirname, 'pages/login/')
            },
            {
              path: 'register',
              name: 'register',
              component: resolve(__dirname, 'pages/login/')
            },
            {
              path: 'profile/:username?/:favorite?',
              name: 'profile',
              component: resolve(__dirname, 'pages/profile/')
            },
            {
              path: 'settings',
              name: 'settings',
              component: resolve(__dirname, 'pages/settings/')
            },
            {
              path: 'create/:slug?',
              name: 'create',
              component: resolve(__dirname, 'pages/create/')
            },
            {
              path: 'article/:slug',
              name: 'article',
              component: resolve(__dirname, 'pages/article/')
            }
          ]
        }
      ])
    }
  },

  server: {
    host: '0.0.0.0',
    port: 3001
  },
  plugins: [
    '~/plugins/request.js'
  ]
}