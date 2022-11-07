import { defineStore } from 'pinia';
import { poApi } from 'boot/api';
import _ from 'lodash';

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
  nodeKey: number | string;
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
  poReqItemId?: number;
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
  nameRu: string;
  nameKz: string;
}

const fakeAddress = [
  'Инженерная ул., 499 кв. 714',
  'набережная Окружная, 153 кв. 121',
  'Сенная площадь, 208 кв. 721',
  'ал. Загородная, 415 кв. 950',
  'наб. Таежная, 329 кв. 538',
  'набережная Дорожная, 556 кв. 980',
  'Привольная ал., 993 кв. 690',
  'наб. Центральная, 492 кв. 422',
  'наб. Вольная, 005 кв. 500',
  'Железнодорожная улица, 239 кв. 964',
  'пл. Поселковая, 869 кв. 329',
  'ул. Красная, 071 кв. 289',
  'улица Покровская, 382 кв. 298',
  'Воронежская пл., 970 кв. 956',
  'Отрадная ул., 940 кв. 259',
  'Безымянная аллея, 456 кв. 020',
  'Молодежная набережная, 051 кв. 382',
  'набережная Локомотивная, 241 кв. 786',
  'Ореховая ул., 359 кв. 952',
  'Сахалинская площадь, 852 кв. 470',
];

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
    resourcesTree: (state) => {
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
            this.dataTree = _(data)
              .map((pos) => {
                const components = _(pos.itemComponents)
                  .map((comp) => {
                    return {
                      ...comp,
                      nodeKey: `${pos.id}-${comp.id}`,
                      label: `ID: ${comp.id}`,
                      state: 'Новый',
                    };
                  })
                  .value();
                const position = {
                  ...pos,
                  nodeKey: pos.id,
                  children: components,
                  label: `ID: ${pos.id}`,
                };
                delete position.itemComponents;
                return position;
              })
              .groupBy('geoPlaceId')
              .map((pos, geoPlaceId) => {
                const label =
                  pos[0].geoPlaceName ||
                  fakeAddress[Math.floor(Math.random() * fakeAddress.length)];
                return {
                  label,
                  geoPlaceId,
                  children: pos,
                  nodeKey: geoPlaceId,
                };
              })
              .value();
            this.positions = data;
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
