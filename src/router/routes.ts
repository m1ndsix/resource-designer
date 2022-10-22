import { RouteRecordRaw } from 'vue-router';
import vxOrderPage from 'pages/vxOrderPage.vue';
import vxPrepare from 'pages/vxPrepare.vue';
import vxErrorNotFound from 'pages/vxErrorNotFound.vue';
import vxEditItem from 'pages/vxEditItem.vue';

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
    path: '/edit-item',
    name: 'Редактировать позицию заказа',
    component: vxEditItem,
  },

  {
    path: '/:catchAll(.*)*',
    name: 'Not Found',
    component: vxOrderPage,
  },
];

export default routes;
