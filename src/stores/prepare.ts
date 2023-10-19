import { defineStore } from 'pinia';
import {
  CPR_API,
  LOC_API,
  POR_API,
  PC_API,
  CPR_RO_API,
  MP_API,
  ME_API,
} from 'boot/api';
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
  geoPlaceInfo: GeoPlaceInfo | null;
  physicalContainers: IdName[];
  streets: IdName[];
  addresses: Address[];
  mountedPorts: PortData[];
  resourceOrderItemId: any;
  measurementResponse: any;
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

interface GeoPlaceInfo {
  geoPlaceTypeId: number;
  generalGeoAddress: {
    generalGeoAddressTypeId: number;
    generalGeoAddressNameRU: string;
    generalGeoAddressNameKZ: string;
    toponymId: number;
    toponymNameRU: string;
    toponymNameKZ: string;
    toponymTypeId: number;
    toponymTypeNameRU: string;
    toponymTypeNameKZ: string;
    townStateId: number;
    townStateNameRU: string;
    townStateNameKZ: string;
    townStateTypeId: number;
    townStateTypeNameRU: string;
    townStateTypeNameKZ: string;
    geoAddressFullNum: string;
    geoAddressNum: number;
    geoAddressSubNum: string;
    geoSubAddressNum: string;
    geoSubAddressSubNum: string;
    entrance: string;
    floor: string;
    residentialTypeId: number;
  };
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

interface PortData {
  id: number;
  portNumber: string;
}
interface Address {
  id: number;
  house: number;
  subHouse: string | null;
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
      existingResources: [],
      preparedComponents: [],
      geoPlaces: [],
      geoPlaceInfo: null,
      physicalContainers: [],
      mountedPorts: [],
      streets: [],
      addresses: [],
      resourceOrderItemId: null,
      measurementResponse: null,
    };
  },
  actions: {
    fetchPORequest(poRequestId: number) {
      POR_API.get(`/product-offer-request/${poRequestId}`).then(({ data }) => {
        this.poRequest = data;
      });
    },
    patchPORequest(poRequestId: number, poRequestItemId: number) {
      POR_API.patch(
        `/product-offer-request/${poRequestId}/po-req-item/${poRequestItemId}`,
        {
          cprRoRejectReasonId: 1, // Нет ТВ
        }
      ).then(({ data }) => {
        // TODO: meaningul handler
        console.log(data);
      });
    },
    fetchGeoPlaceInfo(geoPlaceId: number) {
      LOC_API.get(`/geo-place/${geoPlaceId}`).then(({ data }) => {
        this.geoPlaceInfo = data;
        this.fetchStreets(data.generalGeoAddress.townStateId);
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
    // TODO: apply better naming and fix typing
    fetchCPRInfo(geoPlaceId: number, offset: number, limit: number) {
      CPR_API.get('/composite-physical-resource', {
        params: {
          geoPlaceId,
          offset,
          limit,
        },
      }).then(({ data }) => {
        // TODO: no data spec
        if (data) {
          this.existingResources = data.map((cpr) => {
            return {
              label: `${cpr.compositePhysResSpecData.nameRu} (${cpr.compositePhysResSpecData.id}), ${cpr.resourceFullNumber}`,
              value: {
                lineData: cpr.lineData,
                spec: cpr.compositePhysResSpecData,
              },
            };
          });
        }
      });
    },
    fetchPhysicalContainers(
      streetId: number,
      house: number,
      subHouse: string,
      entrance: number,
      flatNumber: string
    ) {
      PC_API.get('/physical-container-by-address', {
        params: {
          streetId,
          house,
          subHouse,
          entrance,
          flatNumber,
        },
      })
        .then(({ data }) => {
          this.physicalContainers = data;
        })
        .catch((error) => {
          console.log(error);
          this.physicalContainers = [];
        });
    },
    /*
      TODO: Should handle cases when multiple components in multiple positions are being prepared.
      Currently, using promiseAll for each selected component (in single position only). Probably,
      should pass a map with signature: {positionId: [componentIds...]}
    */
    createPosition({
      cprRoPoReqId,
      cprRoPoReqWoId,
      cprActionSpecId,
      compositePhysResSpecId,
      physicalContainerId,
      geoPlaceId,
      transportCpeFuncSpecId,
      wiringTypeId,
      compositePhysResId,
      compositePhysResNum,
      compositePhysResFullNum,
      mountedPortId,
      currentPortId,
      poRequestItemId,
      poReqItemCompIds,
    }) {
      CPR_RO_API.post(
        `/cpr-resource-order-po-req/${cprRoPoReqId}/work-order/${cprRoPoReqWoId}/item`,
        {
          cprActionSpecId,
          compositePhysResSpecId,
          physicalContainerId,
          geoPlaceId,
          transportCpeFuncSpecId,
          wiringTypeId,
          compositePhysResId,
          compositePhysResNum,
          compositePhysResFullNum,
        }
      ).then((creationResult) => {
        this.resourceOrderItemId = creationResult.data.data.id;
        MP_API.patch(`/mounted-port/${mountedPortId}`, {
          usageStateId: 2,
        }).then((mountResult) => {
          // TODO: handle success/error
          console.log(mountResult);
          if (currentPortId) {
            MP_API.patch(`/mounted-port/${currentPortId}`, {
              usageStateId: 1,
              cprResourceOrderItemId: -1,
            }).then((mountResult) => {
              // TODO: handle success/error
              console.log(mountResult);
            });
          }
        });

        const patchPositionRequests = poReqItemCompIds.map((componentId) => {
          POR_API.patch(
            `/po-req-item/${poRequestItemId}/po-req-item-component/${componentId}`,
            {
              resourceOrderItemId: creationResult.data.data.id,
            }
          );
        });

        Promise.all(patchPositionRequests)
          .then((responses) => {
            // Process individual responses here
            responses.forEach((response) => {
              console.log('response.data', response.data);
            });
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      });
    },
    fetchMountedPorts(
      physicalContainerId: number,
      usageStateId: number,
      limit: number,
      offset: number
    ) {
      MP_API.get('/mounted-port', {
        params: {
          physicalContainerId,
          usageStateId: usageStateId,
          limit,
          offset,
        },
      });
    },
    fetchMountedPortsByParentPc(physicalContainerId: number) {
      MP_API.get(`/mounted-port-by-parent-pc/${physicalContainerId}`, {})
        .then(({ data }) => {
          this.mountedPorts = data;
          console.log('this.mountedPorts', this.mountedPorts);
        })
        .catch((error) => {
          console.log(error);
          this.mountedPorts = [];
        });
    },
    fetchStreets(id: number) {
      PC_API.get('/streets', {
        params: {
          id,
        },
      }).then(({ data }) => {
        this.streets = data;
      });
    },
    fetchAddresses(id: number) {
      PC_API.get('/addresses', {
        params: {
          id,
        },
      }).then(({ data }) => {
        this.addresses = data;
      });
    },
    sendMeasurement(
      workOrderId: number,
      createEmployeeId: number,
      employeeFuncRoleSpecCode: string,
      description: string,
      items: { cprResourceOrderItemId: number }[]
    ) {
      console.log(
        'sendMeasurement ',
        workOrderId,
        createEmployeeId,
        employeeFuncRoleSpecCode,
        description,
        items
      );
      ME_API.post('/measurement-request', {
        workOrderId,
        createEmployeeId,
        employeeFuncRoleSpecCode,
        description,
        items,
      }).then(({ data }) => {
        this.measurementResponse = data;
      });
    },
  },
});
