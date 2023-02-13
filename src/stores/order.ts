import { defineStore } from 'pinia';
import { CPR_RO_API, PC_API, TE_API } from 'boot/api';

interface State {
  orders: WorkOrder[];
  selectedOrder: WorkOrder | null;
  baseCfsSpecs: IdName[];
  productSpecs: IdName[];
  cprSpecs: IdName[];
  physicalContainers: PhysicalContainer[];
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

interface PhysicalContainer {
  id: number;
  physicalContainerNumber: string;
  specificationData: {
    id: number;
    nameRu: string;
    nameKz: string;
    functionID: 4;
  };
  is_outer: boolean;
  inventorySystemData: IdName;
  externalId: number;
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
        await CPR_RO_API.get('/cpr-resource-order-po-req/work-order', {
          params: {
            offset,
            limit,
          },
        }).then(({ data }) => {
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
        await CPR_RO_API.get('/get-base-cfs-specs').then(({ data }) => {
          this.baseCfsSpecs = data;
        });
      } catch (error) {
        console.log(error);
      }
    },
    async getProductSpecs() {
      try {
        await CPR_RO_API.get('/get-product-specs').then(({ data }) => {
          this.productSpecs = data;
        });
      } catch (error) {
        console.log(error);
      }
    },
    async getCprSpecs() {
      try {
        await CPR_RO_API.get('/get-cpr-specs').then(({ data }) => {
          this.cprSpecs = data;
        });
      } catch (error) {
        console.log(error);
      }
    },
    async getPhysicalContainers(
      streetId: number,
      houseNum: number,
      subHouse: string
    ) {
      try {
        await PC_API.get('/physical-container/physical-container-by-address', {
          params: {
            streetId: 1426,
            houseNum: 162,
            // subHouse: 'Г',
            // entrance: '',
            // flatNumber: '',
            // geoSubAddressId: null,
          },
        }).then(({ data }) => {
          this.physicalContainers = data;
        });
      } catch (error) {
        console.log(error);
      }
    },
    requestTechInspection(
      workOrderId: number,
      employeeId: number,
      description: string
    ) {
      TE_API.post('/tech-inspection-request', {
        workOrderId,
        employeeId,
        description,
      }).then((response) => {
        console.log(response);
      });
    },
  },
});
