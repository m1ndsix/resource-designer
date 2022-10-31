import { defineStore } from 'pinia';
import { poApi } from 'boot/api';

interface State {
  poRequest: ProductOfferRequest | null;
  dataTree: DataTree[];
  positions: ProductOfferRequestItem[];
  selectedComponent: ProductOfferRequestItemComponent | null;
  components: ProductOfferRequestItemComponent[];
  availableResources: Resource[];
  preparedComponents: PreparedComponents[];
}

interface DataTree {
  nodeKey: number;
  label: string;
  children: DataNode[];
}

interface DataNode extends ProductOfferRequest {
  nodeKey: number;
  label: string;
  state: string;
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
  geoPlaceName?: string;
  oldProductOfferId: number;
  oldProductOfferName?: string;
  newProductOfferId: number;
  newProductOfferName?: string;
  caSubscriptionId: number;
  agreementId: number;
  billingAccountId: number;
  createDate?: string;
  updateDate?: string;
  createUser?: string;
  updateUser?: string;
  createApp?: string;
  updateApp?: string;
  itemComponents: ProductOfferRequestItemComponent[];
}

interface ProductOfferRequestItemComponent {
  id?: number;
  typeId: number;
  type?: IdNameRuKz;
  poReqItemId?: string;
  geoPlaceId?: number;
  geoPlaceName?: string;
  poComponentId: number;
  poComponentName?: string;
  oldPoStructId: number;
  oldPoStructName?: string;
  newPoStructId: number;
  newPoStructName?: string;
  resourceOrderItemId: number;
  oldNumber: string;
  newNumber: string;
  oldCount: number;
  newCount: number;
  elements: number[];
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
      dataTree: [],
      positions: [],
      selectedComponent: null,
      components: [],
      availableResources: [],
      preparedComponents: [],
    };
  },
  getters: {
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
      poApi.get(`/product-offer-request/${poRequestId}`).then(({ data }) => {
        this.poRequest = data;
      });
    },
    fetchPositions(poRequestId: number) {
      poApi
        .get(`/product-offer-request/${poRequestId}/po-req-item`)
        .then(({ data }) => {
          if (!!data.length) {
            this.positions = data;
            this.dataTree = data.reduce((acc, el) => {
              const components = el.itemComponents.map((c) => {
                return {
                  ...c,
                  nodeKey: `${el.id}-${c.id}`,
                  label: `Компонент (ID): ${c.id}`,
                  state: 'Новый',
                };
              });
              const position = {
                ...el,
                nodeKey: el.id,
                children: components,
                label: `Позиция (ID): ${el.id}`,
              };
              delete position.itemComponents;
              const existingIdx = acc.findIndex(
                (f) => f && f.nodeKey === position.geoPlaceId
              );
              if (existingIdx > -1) {
                acc[existingIdx].children.push(position);
              } else {
                acc.push({
                  nodeKey: position.geoPlaceId,
                  label: `Геоместорасположение (ID): ${position.geoPlaceId}`,
                  children: [position],
                });
              }
              return acc;
            }, []);
          }
        });
    },
    fetchComponents(poReqItemId: number) {
      return poApi.get(
        `product-offer-request-be/v1.0/po-req-item/${poReqItemId}/po-req-item-component`
      );
    },
  },
});
