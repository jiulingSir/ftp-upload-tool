import Vue from 'vue'
import store from '../store/index.js'
import Router from 'vue-router'

Vue.use(Router);

//路由懒加载
const Login = resolve => {
  require.ensure(['../views/login/index.vue'], () => {
    resolve(require('../views/login/index.vue'));
  });
};

const Hello = resolve => {
  require.ensure(['../views/home/index.vue'], () => {
    resolve(require('../views/home/index.vue'));
  });
};

const Error404 = resolve => {
  require.ensure(['../views/error-page/404.vue'], () => {
      resolve(require('../views/error-page/404.vue'));
  }); 
};

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '*',
      name: 'error',
      component: Error404
    }
  ]
});

//注册全局钩子用来拦截导航
router.beforeEach((to, from, next) => {
  //获取store里面的token
  let token = store.state.token;
  //判断要去的路由有没有requiresAuth
  if(to.meta.requiresAuth){

    if(token){
      next();
    }else{
      next({
        path: '/login',
        query: { redirect: to.fullPath }  // 将刚刚要去的路由path（却无权限）作为参数，方便登录成功后直接跳转到该路由
      });
    }

  }else{
    next();//如果无需token,那么随它去吧
  }
});

export default router;


