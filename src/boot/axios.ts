import { boot } from 'quasar/wrappers';
import axios from 'axios';

const roApi = axios.create({ baseURL: 'http://localhost:1326' });

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios;

  app.config.globalProperties.$api = roApi;
});

export { axios, roApi };
