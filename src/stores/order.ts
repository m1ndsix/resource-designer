import { defineStore } from 'pinia';
import { roApi } from 'boot/axios';

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
  actions: {
    // TODO: optimize later
    async getOrders(offset: number, limit: number) {
      try {
        await roApi
          .get('/api/cpr-resource-order-be/v1.0/cpr-resource-order-manual', {
            params: {
              offset,
              limit,
            },
            headers: {
              Authorization: '123qwerty',
            },
          })
          .then((response) => {
            this.orders = response.data;
          });
      } catch (error) {
        console.log(error);
      }
    },
  },
});
