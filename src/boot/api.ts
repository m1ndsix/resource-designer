import { boot } from 'quasar/wrappers';
import VueKeyCloak from '@dsb-norge/vue-keycloak-js';
import axios, { AxiosInstance } from 'axios';

const PC_API_URL =
  process.env.PC_API_URL ||
  'http://10.8.27.97:6126/api/physical-container-be/v1.0'; // - URL сервиса physical-container-be
const CPR_API_URL =
  process.env.CPR_API_URL ||
  'http://10.8.27.97:6124/api/composite-physical-resource-be/v1.0'; // - URL сервиса composite-physical-resource
const MP_API_URL =
  process.env.MP_API_URL || 'http://10.8.27.97:6125/api/mounted-port-be/v1.0'; // - URL сервиса mounted-port-be
const CPR_RO_URL =
  process.env.CPR_RO_URL ||
  // 'http://10.8.27.97:6127/api/cpr-resource-order-be/v1.0'; // - URL сервиса resource-order-be
  'http://localhost:1326/api/cpr-resource-order-be/v1.0';
const LOC_API_URL = process.env.LOC_API_URL || 'http://10.6.4.118:6009/api/v1'; // - URL сервиса location
const POR_API_URL =
  process.env.POR_API_URL ||
  'http://10.6.4.118:6010/api/product-offer-request-be/v1.0'; // - URL сервиса product-offer
const TE_URL =
  process.env.TE_URL ||
  'http://10.8.27.97:6244/api/tech-inspection-request-be/v1.0'; // - URL сервиса tech-inspection
const ME_URL =
  process.env.ME_URL ||
  'http://10.8.27.97:6241/api/measurement-request-be/v1.0'; // URL сервиса measurement-request
// Переменные среды
const KEYCLOAK_URL = process.env.KEYCLOAK_URL || 'https://keycloak.telecom.kz';
const KEYCLOAK_REALM = process.env.KEYCLOAK_REALM || 'KT';
const KEYCLOAK_CLIENT_ID =
  process.env.KEYCLOAK_CLIENT_ID || 'cpr-resource-order-design-fe';

function createRouter(url: string) {
  return axios.create({
    baseURL: url,
  });
}

const PC_API = createRouter(PC_API_URL);
const CPR_API = createRouter(CPR_API_URL);
const MP_API = createRouter(MP_API_URL);
const CPR_RO_API = createRouter(CPR_RO_URL);
const LOC_API = createRouter(LOC_API_URL);
const POR_API = createRouter(POR_API_URL);
const TE_API = createRouter(TE_URL);
const ME_API = createRouter(ME_URL);

const ALL_APIS = [
  PC_API,
  CPR_API,
  MP_API,
  CPR_RO_API,
  LOC_API,
  POR_API,
  TE_API,
  ME_API,
];

export default boot(async ({ app }) => {
  app.config.globalProperties.$axios = axios;
  function tokenInterceptor(ALL_APIS: AxiosInstance[]) {
    ALL_APIS.forEach((api) => {
      api.interceptors.request.use(
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
    });
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
          url: KEYCLOAK_URL,
          realm: KEYCLOAK_REALM,
          clientId: KEYCLOAK_CLIENT_ID,
        },
        onReady: () => {
          tokenInterceptor(ALL_APIS);
          resolve();
        },
      });
    });
  }
});

export {
  axios,
  PC_API,
  CPR_API,
  MP_API,
  CPR_RO_API,
  LOC_API,
  POR_API,
  TE_API,
  ME_API,
};
