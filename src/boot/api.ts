import { boot } from 'quasar/wrappers';
import VueKeyCloak from '@dsb-norge/vue-keycloak-js';
import axios from 'axios';

const voixApi = (port: number) => {
  return axios.create({
    baseURL: `${process.env.API}:${port}`,
    headers: { Authorization: '123qwerty' },
  });
};

const externalApi = (port: number) => {
  return axios.create({ baseURL: `http://10.6.4.118:${port}/api` });
};

const psApi = axios.create({
  baseURL: `${process.env.API}:1323`,
  headers: { Authorization: '123qwerty' },
});
const cpsApi = axios.create({
  baseURL: `${process.env.API}:1324`,
  headers: { Authorization: '123qwerty' },
});
const mpApi = axios.create({
  baseURL: `${process.env.API}:1325`,
  headers: { Authorization: '123qwerty' },
});
const roApi = axios.create({
  baseURL: `${process.env.API}:1326`,
  headers: { Authorization: '123qwerty' },
});
const poApi = axios.create({ baseURL: 'http://10.6.4.118:6010/api' });

export default boot(async ({ app }) => {
  app.config.globalProperties.$axios = axios;
  function tokenInterceptor() {
    poApi.interceptors.request.use(
      (config) => {
        if (config.headers) {
          config.headers.Authorization = `Bearer ${app.config.globalProperties.$keycloak.token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  return new Promise((resolve) => {
    app.use(VueKeyCloak, {
      init: {
        onLoad: 'login-required', // or 'check-sso'
        flow: 'standard',
        pkceMethod: 'S256',
        silentCheckSsoRedirectUri:
          window.location.origin + '/silent-check-sso.html',
        checkLoginIframe: false,
      },
      config: {
        url: 'http://10.8.93.133:8081',
        realm: 'Test',
        clientId: 'vue-front',
      },
      onReady: () => {
        tokenInterceptor();
        resolve();
      },
    });
  });
});

export { axios, psApi, cpsApi, mpApi, roApi, poApi };
