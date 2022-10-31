import { defineStore } from 'pinia';
import { roApi } from 'boot/api';

interface State {
  orders: CprResourceOrderManual[];
  selectedOrder: CprResourceOrderItem | null;
}

interface CprResourceOrderManual {
  id?: number;
  externalId: string;
  productOfferRequestId: number;
  stateId?: number;
  stateData?: RoState;
  expectedCompletionDate?: string;
  completionDate?: string;
  rejectReasonId?: number;
  rejectReasonData?: RejectReason;
  rejectDate?: string;
  items?: CprResourceOrderItem[];
  createDate?: string;
  updateDate?: string;
  createUser?: string;
  updateUser?: string;
  createApp?: string;
  updateApp?: string;
}

interface CprResourceOrderItem {
  id?: number;
  actionId: number;
  actionData?: RoiAction;
  stateId?: number;
  stateData?: RoiState;
  externalId: string;
  compositePhysicalResourceSpecificationId: number;
  geoPlaceId: number;
  physicalContainerId: number;
  externalCompositePhysicalResourceNumber?: number;
  createDate?: string;
  updateDate?: string;
  createUser?: string;
  updateUser?: string;
  createApp?: string;
  updateApp?: string;
}

interface RoiAction {
  id?: number;
  name?: string;
}

interface RoiState {
  id?: number;
  name?: string;
}

interface RoState {
  id?: number;
  name?: string;
}

interface RejectReason {
  id?: number;
  nameRu?: string;
  nameKz?: string;
}

export const useOrderStore = defineStore('orderStore', {
  state: (): State => {
    return {
      orders: [],
      selectedOrder: null,
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
          .get('/cpr-resource-order-manual', {
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
  },
});
