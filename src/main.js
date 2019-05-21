import Vue from 'vue'
import Vuetify from 'vuetify'
import router from '@/router.js'
import App from './App.vue'
import 'vuetify/dist/vuetify.min.css'

Vue.config.productionTip = false;

Vue.use(Vuetify);

router.beforeEach((to, from, next) => {
  if (to.path === '/logout') {
    localStorage.clear();
    next('/sign-in');
  }
  next();
});

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
