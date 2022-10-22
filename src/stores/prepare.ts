import { defineStore } from 'pinia';
import { poApi } from 'boot/api';

interface State {
  poRequest: ProductOfferRequest | null;
  positions: ProductOfferRequestItem[];
  selectedComponent: ProductOfferRequestItemComponent | null;
  components: ProductOfferRequestItemComponent[];
  availableResources: Resource[];
  preparedComponents: PreparedComponents[];
}

interface ProductOfferRequest {
  id?: number;
  divisionId: number;
  poReqStatusId?: number;
  poReqStatus?: IdNameRuKz;
  resourceOrderId: number;
  partyId: number;
  commChannelId: number;
  identificationNumber: string;
  contactName: string;
  contactNumber: number;
  salesChannelId: number;
  description?: string;
  createDate?: string;
  updateDate?: string;
  createUser?: string;
  updateUser?: string;
  createApp?: string;
  updateApp?: string;
}

interface Resource {
  spec: string | null;
  equipment: string | null;
  port: string | null;
  name: string | null;
}

interface ProductOfferRequestItem {
  id?: number;
  typeId: number;
  type?: IdNameRuKz;
  productOfferReqId?: number;
  geoPlaceId: number;
  oldProductOfferId: number;
  newProductOfferId: number;
  caSubscriptionId: number;
  createDate?: string;
  updateDate?: string;
  createUser?: string;
  updateUser?: string;
  createApp?: string;
  updateApp?: string;
  lazy?: boolean;
  components?: ProductOfferRequestItemComponent[];
}

interface ProductOfferRequestItemComponent {
  id?: number;
  typeId: number;
  type?: IdNameRuKz;
  poReqItemId: string;
  geoPlaceId?: number;
  poComponentId: number;
  oldPoStructId: number;
  newPoStructId: number;
  resourceOrderItemId: number;
  createDate?: string;
  updateDate?: string;
  createUser?: string;
  updateUser?: string;
  createApp?: string;
  updateApp?: string;
  resource?: Resource | null;
}

interface PreparedComponents {
  posId: number;
  compIds: number[];
}

interface IdNameRuKz {
  id: number;
  name_ru: string;
  name_kz: string;
}

export const usePrepareStore = defineStore('prepareStore', {
  state: (): State => {
    return {
      poRequest: null,
      positions: [],
      selectedComponent: null,
      components: [],
      availableResources: [],
      preparedComponents: [],
    };
  },
  getters: {
    getPositions: (state) => {
      return state.positions;
    },
    posCompTree: (state) => {
      return state.positions.map((p) => {
        const comps = state.components.filter(
          (c) => parseInt(c.poReqItemId) === p.id
        );
        return {
          ...p,
          lazy: true,
          components: comps,
        };
      });
    },
    componentsWithResources: (state) => {
      return state.positions.map((p) => {
        const comps = state.components.map((c) => {
          return {
            ...c,
            address: 'ул. Абая, 1',
            resource: c.resource,
          };
        });
        return {
          posId: p.id,
          components: comps,
        };
      });
    },
  },
  actions: {
    fetchPORequest(poRequestId: number) {
      poApi
        .get('/product-offer-request-be/v1.0/product-offer-request/19593')
        .then(({ data }) => {
          this.poRequest = data;
        });
    },
    fetchPositions(poRequestId: number) {
      poApi
        .get(
          '/product-offer-request-be/v1.0/product-offer-request/19593/po-req-item'
        )
        .then(({ data }) => {
          // TODO: fix later
          this.positions = data.map(async (p: ProductOfferRequestItem) => {
            // const address = await this.fetchAddress(p.geoPlaceId);
            const address = { fullAddress: 'ул. Абая, 1/б' };
            return {
              addressLabel: 'ул. Абая, 1/б',
              geoPlaceId: p.geoPlaceId,
              children: { ...p, address: address, lazy: true },
            };
          });
        });
    },
    fetchComponents(poReqItemId: number) {
      return poApi.get(
        'product-offer-request-be/v1.0/po-req-item/38/po-req-item-component'
      );
    },
    fetchAddress(geoPlaceId: number) {
      return poApi.get(
        'product-offer-request-be/v1.0/po-req-item/38/po-req-item-component'
      );
    },
  },
});
