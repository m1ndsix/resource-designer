import { RouteRecordRaw } from 'vue-router';
import vxOrderPage from 'pages/vxOrderPage.vue';
import vxPrepare from 'pages/vxPrepare.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Заказы',
    component: vxOrderPage,
  },

  {
    path: '/prepare',
    name: 'Обработка Заказов',
    component: vxPrepare,
  },

  {
    path: '/:catchAll(.*)*',
    name: 'Not Found',
    component: vxOrderPage,
  },
];

export default routes;
