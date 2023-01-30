import { defineStore } from 'pinia';
import { LOC_API, POR_API } from 'boot/api';
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
  geoPlaces: unknown[];
  geoPlaceInfo: unknown;
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
  id: number;
  divisionId: number;
  divisionName: string;
  stateData: IdName;
  nextActionData: IdName;
  subStateId: IdName;
  resourceOrderId: number;
  partyId: number;
  commChannelId: number;
  commChannelName: string;
  commChannelTypeData: IdName;
  commChannelAddr: string;
  entityAuthTypeData: IdName;
  salesChannelId: number;
  salesChannelName: string;
  identificationNumber: string;
  mobilePhoneNumber: string;
  contactName: string;
  externalId: string;
  codeVerify: string;
  description: string;
  createDate: string;
  updateDate: string;
  createUser: string;
  updateUser: string;
  createApp: string;
  updateApp: string;
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
  type?: IdName;
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
  type?: IdName;
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

interface IdName {
  id: number;
  nameRu: string;
  nameKz: string;
}

function makeTree(data) {
  return {
    ...data,
    label: data.nameRu,
    nodeKey: data.id,
    nodeType: 'address',
    children: _(data.productOfferReqItems)
      .map((pos) => {
        const components = _(pos.itemComponents)
          .map((comp) => {
            return {
              ...comp,
              // label: `ID: ${comp.id}`,
              nodeKey: `${pos.id}-${comp.id}`,
              nodeType: 'component',
              state: 'Новый',
            };
          })
          .value();
        const position = {
          ...pos,
          // label: `ID: ${pos.id}`,
          nodeKey: pos.id,
          nodeType: 'position',
          children: components,
        };
        delete position.itemComponents;
        return position;
      })
      .value(),
  };
}

export const usePrepareStore = defineStore('prepareStore', {
  state: (): State => {
    return {
      poRequest: null,
      dataTree: [
        {
          label: 'ПП с одним адресом',
          nodeKey: 'productOfferWithGeneralGeoPlace',
          noTick: true,
          children: [],
        },
        {
          label: 'ПП с несколькими адресами',
          nodeKey: 'productOfferWithP2PGeoPlace',
          noTick: true,
          children: [],
        },
      ],
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
      geoPlaces: [],
      geoPlaceInfo: null,
    };
  },
  actions: {
    fetchPORequest(poRequestId: number) {
      POR_API.get(`/product-offer-request/${poRequestId}`).then(({ data }) => {
        this.poRequest = data;
      });
    },
    // fetchGeoPlaces(poRequestId: number) {
    //   POR_API.get(`/product-offer-request/${poRequestId}/geo-places`).then(
    //     ({ data }) => {
    //       if (data) {
    //         this.geoPlaces = data;
    //         for (let i = 0; i < data.length; i++) {
    //           data[i].stateDistrict.geoPlaces.forEach((geoPlace) => {
    //             if (geoPlace.id) {
    //               this.fetchGeoPlaceInfo(poRequestId, geoPlace.id);
    //             }
    //           });
    //         }
    //       }
    //     }
    //   );
    // },
    fetchGeoPlaceInfo(geoPlaceId: number) {
      LOC_API.get(`/geo-place/${geoPlaceId}`).then(({ data }) => {
        this.geoPlaceInfo = data;
      });
    },
    fetchProductInfo(poRequestId: number, geoPlaceId: number) {
      POR_API.get(
        `/product-offer-request/${poRequestId}/geo-place/${geoPlaceId}`
      ).then(({ data }) => {
        if (data.productOfferWithGeneralGeoPlace.id) {
          this.dataTree[0].children.push(
            makeTree(data.productOfferWithGeneralGeoPlace)
          );
        }
        if (data.productOfferWithP2PGeoPlace.id) {
          this.dataTree[1].children.push(
            makeTree(data.productOfferWithP2PGeoPlace)
          );
        }
      });
    },
  },
});
