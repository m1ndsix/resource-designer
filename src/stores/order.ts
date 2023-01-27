import { defineStore } from 'pinia';
import { roApi } from 'boot/api';
import { psApi } from 'boot/api';

interface State {
  orders: WorkOrder[];
  selectedOrder: WorkOrder | null;
  baseCfsSpecs: IdName[];
  productSpecs: IdName[];
  cprSpecs: IdName[];
  physicalContainers: IdName[];
}

interface WorkOrder {
  id: number;
  cprResourceOrderPoReqId: number;
  stateDistrictId: number;
  geoPlace: GeoPlace;
  techInspectionRequestId: number;
  measurementRequestId: number;
  productOfferRequestId: number;
  executeEmployeeId: number;
  executeData: string;
  stateData: IdName;
  cprResourceOrderPoReqItems: WorkOrderItem[];
  createDate: string;
  updateDate: string;
  createUser: string;
  updateUser: string;
  createApp: string;
  updateApp: string;
}

interface GeoPlace {
  id: number;
  nameRu: string;
  nameKz: string;
  typeData: IdName;
}

interface IdName {
  id: number;
  nameRu: string;
  nameKz: string;
}

interface WorkOrderItem {
  id: number;
  cprActionSpecId: number;
  cprActionSpecData: IdName;
  stateData: IdName;
  compositePhysResSpecId: number;
  compositePhysResSpecData: IdName;
  physicalContainerId: number;
  geoPlaceId: number;
  geoPlaceData: IdName;
  transportCpeFuncSpecId: number;
  transportCpeFuncSpecData: IdName;
  wiringTypeId: number;
  wiringTypeData: IdName;
  compositePhysResId: number;
  compositePhysResFullNum: string;
  externalProjectId: number;
  externalCompositePhysResNum: number;
  createDate: string;
  updateDate: string;
  createUser: string;
  updateUser: string;
  createApp: string;
  updateApp: string;
}

export const useOrderStore = defineStore('orderStore', {
  state: (): State => {
    return {
      orders: [],
      selectedOrder: null,
      baseCfsSpecs: [],
      productSpecs: [],
      cprSpecs: [],
      physicalContainers: [],
    };
  },
  getters: {
    orderCount: (state) => {
      return state.orders.length;
    },
  },
  actions: {
    async getOrders(offset: number, limit: number) {
      try {
        await roApi
          .get('/cpr-resource-order-po-req/work-order', {
            params: {
              offset,
              limit,
            },
          })
          .then(({ data }) => {
            if (data && data.length > 0) {
              this.orders = data;
            } else {
              this.orders = [];
            }
          });
      } catch (error) {
        console.log(error);
      }
    },
    async getBaseCfsSpecs() {
      try {
        await roApi.get('/get-base-cfs-specs/').then(({ data }) => {
          this.baseCfsSpecs = data;
        });
      } catch (error) {
        console.log(error);
      }
    },
    async getProductSpecs() {
      try {
        await roApi.get('/get-product-specs/').then(({ data }) => {
          this.productSpecs = data;
        });
      } catch (error) {
        console.log(error);
      }
    },
    async getCprSpecs() {
      try {
        await roApi.get('/get-cpr-specs/').then(({ data }) => {
          this.cprSpecs = data;
        });
      } catch (error) {
        console.log(error);
      }
    },
    async getPhysicalContainers(offset: number, limit: number) {
      try {
        await psApi
          .get('/physical-container', {
            params: {
              townStateId: 2,
              offset,
              limit,
            },
          })
          .then(({ data }) => {
            this.physicalContainers = data;
          });
      } catch (error) {
        console.log(error);
      }
    },
  },
});
