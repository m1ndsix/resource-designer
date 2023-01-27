import { boot } from 'quasar/wrappers';
import VueKeyCloak from '@dsb-norge/vue-keycloak-js';
import axios from 'axios';

const voixUrl = process.env.voixUrl;
const ktUrl = process.env.ktUrl;

function createVoixRouter(url: string, port: number) {
  return axios.create({
    baseURL: `${url}:${port}/api/cpr-resource-order-be/v1.0`,
    headers: { Authorization: '123qwerty' },
  });
}

function tempRouter(url: string, port: number) {
  return axios.create({
    baseURL: `${url}:${port}/api/physical-container-be/v1.0`,
    headers: { Authorization: '123qwerty' },
  });
}

const psApi = tempRouter(voixUrl, process.env.psPort);
const cpsApi = createVoixRouter(voixUrl, process.env.cpsPort);
const mpApi = createVoixRouter(voixUrl, process.env.mpPort);
const roApi = createVoixRouter(voixUrl, process.env.roPort);

const poApi = axios.create({ baseURL: ktUrl });

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
  if (!process.env.isLocalDemo) {
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
  }
});

export { axios, psApi, cpsApi, mpApi, roApi, poApi };
