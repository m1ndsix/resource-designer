import { defineStore } from 'pinia';
import { CPR_RO_API, PC_API, TE_API } from 'boot/api';

interface State {
  orders: WorkOrder[];
  selectedOrder: WorkOrder | null;
  baseCfsSpecs: IdName[];
  productSpecs: IdName[];
  cprSpecs: IdName[];
  physicalContainers: PhysicalContainer[];
  techInspections: TechInspection[];
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
  contactName: string;
  mobilePhoneNumber: string;
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

interface TechInspection {
  id: number;
  employeeInteractionId: number;
  workOrderId: number;
  geoPlaceData: IdName;
  createEmployeeId: number;
  executeEmployeeId: number;
  description: string;
  isOverbudget: boolean;
  resultTypeData: IdName;
  wiringTypeData: IdName;
  result: string;
  executeDate: string;
  createDate: string;
  updateDate: string;
  createUser: string;
  updateUser: string;
  createApp: string;
  updateApp: string;
}

let statusCode = 0;
let errCode = 0;
let errMsg = '';

export const useOrderStore = defineStore('orderStore', {
  state: (): State => {
    return {
      orders: [],
      selectedOrder: null,
      baseCfsSpecs: [],
      productSpecs: [],
      cprSpecs: [],
      physicalContainers: [],
      techInspections: [],
    };
  },
  getters: {
    orderCount: (state) => {
      return state.orders.length;
    },
  },
  actions: {
    async getOrders(
      offset: number,
      limit: number,
      dateFrom: string,
      contactName: string,
      addressName: string,
      state: string
    ) {
      try {
        await CPR_RO_API.get('/cpr-resource-order-po-req/work-order', {
          params: {
            offset,
            limit,
            dateFrom,
            contactName,
            addressName,
            state,
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
    requestTechInspection(
      workOrderId: number,
      createEmployeeId: number,
      description: string
    ) {
      TE_API.post('/tech-inspection-request', {
        workOrderId,
        createEmployeeId,
        executeEmployeeId: createEmployeeId,
        description,
      }).then((response) => {
        console.log(response);
        this.fetchTechInspections(workOrderId);
      });
    },
    fetchInspectors(login: string) {
      return TE_API.get('tech-inspection-request/inspectors', {
        params: { login },
      });
    },
    fetchTechInspections(workOrderId: number) {
      TE_API.get('/tech-inspection-request', {
        params: { workOrderId },
      }).then(({ data }) => {
        this.techInspections = data;
      });
    },
    patchWorkOrder(
      cprRoPoReqId: number,
      cprRoPoReqWoId: number,
      stateId: number
    ) {
      CPR_RO_API.patch(
        `/cpr-resource-order-po-req/${cprRoPoReqId}/work-order/${cprRoPoReqWoId}`,
        { stateId }
      ).then((response) => {
        // TODO: meaningful handler
        console.log(response);
      });
    },
    async validateWorkOrder(cprRoPoReqWoId: number, cprRoPoReqId: number) {
      try {
        await CPR_RO_API.get('/validate', {
          params: {
            cprRoPoReqWoId,
            cprRoPoReqId,
          },
        }).then((response) => {
          if (response) {
            statusCode = response.status;
            errCode = response.data.errCode;
            errMsg = response.data.errMsg;
          } else {
            console.log('nothing');
            statusCode = 0;
            errCode = 1;
            errMsg = '';
          }
        });
      } catch (error) {
        console.log(error);
      }
      return [statusCode, errCode, errMsg];
    },
  },
});
