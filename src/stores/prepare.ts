import { defineStore } from 'pinia';
import { poApi } from 'boot/api';
import _ from 'lodash';

interface State {
  poRequest: ProductOfferRequest | null;
  dataTree: any[];
  positions: ProductOfferRequestItem[];
  selectedComponent: ProductOfferRequestItemComponent | null;
  components: ProductOfferRequestItemComponent[];
  createdResources: Resource[];
  existingResources: Resource[];
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
  label: string | null;
  value: {
    length?: string | null;
    lineData?: string | null;
    spec: string | null;
    equipment: string | null;
    port: string | null;
  };
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
  'г.Алматы, мкр.Самал-2, 64, 1',
  'г.Астана, мкр.Коктем-2, 6А, 403 - г.Алматы, мкр.Самал-2, 64, 1',
];

function makeTreeOfAddressType(data) {
  return _(data)
    .map((address) => {
      const positions = _(address.productOfferReqItems)
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
        .value();
      delete address.productOfferReqItems;
      return {
        ...address,
        label: address.nameRu,
        nodeKey: address.id,
        children: positions,
      };
    })
    .value();
}

export const usePrepareStore = defineStore('prepareStore', {
  state: (): State => {
    return {
      poRequest: null,
      dataTree: [],
      positions: [],
      selectedComponent: null,
      components: [],
      createdResources: [],
      existingResources: [
        {
          label: 'Прямая линия FTTH б/логина (1000776), 7222-4207188',
          value: {
            length: '928.9 м',
            lineData:
              'TOWN:727;STATION:42/01; MAN:ECI; OLT:2/00/03/07;ODF:3/08/06/01; LD:Ст. 42/01: ODF 3/8/06/4, ODF 3/4/06/1; ОРКсп 240/0/142/03: 00/00/спл.1х16/10 (Этаж 3); OU:0;ONUPORTNUM:0; 928.9 м',
            spec: 'Прямая линия FTTH б/логина (1000776)',
            equipment: 'ОРК 229/06/2/1',
            port: 'Порт: 1',
          },
        },
        {
          label: 'Прямая линия ETTH(1000784), 7222-5498221',
          value: {
            length: '928.9 м',
            lineData:
              'TOWN:727;STATION:42/01; MAN:ECI; OLT:2/00/03/07;ODF:3/08/06/01; LD:Ст. 42/01: ODF 3/8/06/4, ODF 3/4/06/1; ОРКсп 240/0/142/03: 00/00/спл.1х16/10 (Этаж 3); OU:0;ONUPORTNUM:0; 928.9 м',
            spec: 'Прямая линия ETTH(1000784)',
            equipment: 'ОРК 229/06/2/2',
            port: 'Порт: 2',
          },
        },
      ],
      preparedComponents: [],
    };
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
          if (data) {
            this.dataTree = [
              {
                label: 'Общий',
                nodeKey: 'productOfferWithGeneralGeoPlace',
                children: makeTreeOfAddressType(
                  data.productOfferWithGeneralGeoPlace
                ),
              },
              {
                label: 'P2P',
                nodeKey: 'productOfferWithP2PGeoPlace',
                children: makeTreeOfAddressType(
                  data.productOfferWithP2PGeoPlace
                ),
              },
            ];
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
