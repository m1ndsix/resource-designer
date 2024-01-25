import { defineStore } from 'pinia';
import { useOrderStore } from 'src/stores/order';
import { Notify } from 'quasar';
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
  dataTree: unknown[];
  positions: ProductOfferRequestItem[];
  selectedComponent: ProductOfferRequestItemComponent | null;
  components: ProductOfferRequestItemComponent[];
  createdResources: Resource[];
  existingResources: Resource[];
  preparedComponents: PreparedComponents[];
  preparedComponentsNew: unknown[];
  editItem: null;
  geoPlaces: unknown[];
  geoPlaceInfo: GeoPlaceInfo | null;
  physicalContainers: IdName[];
  streets: IdName[];
  addresses: Address[];
  mountedPorts: PortData[];
  resourceOrderItemId: unknown;
  measurementResponse: unknown;
  infoTableLoading: boolean;
  preparedTableLoading: boolean;
}

// interface DataTree {
//   nodeKey: number | string;
//   label: string;
//   children: DataNode[];
// }

// interface DataNode extends ProductOfferRequest {
//   nodeKey: number;
//   label: string;
//   state: string;
// }

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
  resourceOrderItemId: unknown;
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
              portId: '',
              portNumber: '',
              physicalContainerNumber: '',
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
      preparedComponentsNew: [],
      editItem: null,
      geoPlaces: [],
      geoPlaceInfo: null,
      physicalContainers: [],
      mountedPorts: [],
      streets: [],
      addresses: [],
      resourceOrderItemId: null,
      measurementResponse: null,
      infoTableLoading: false,
      preparedTableLoading: false,
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
      this.preparedTableLoading = true;
      POR_API.get(
        `/product-offer-request/${poRequestId}/geo-place/${geoPlaceId}`
      ).then(({ data }) => {
        console.log('poRequestId', poRequestId);
        console.log('geoPlaceId', geoPlaceId);
        console.log('fetchProductInfo', data);
        this.dataTree[0].children = [];
        this.dataTree[1].children = [];
        this.preparedComponentsNew = [];

        if (data.productOfferWithGeneralGeoPlace.id) {
          this.dataTree[0].children.push(
            makeTree(data.productOfferWithGeneralGeoPlace)
          );
          data.productOfferWithGeneralGeoPlace.productOfferReqItems.forEach(
            (element) =>
              element.itemComponents.forEach((element) =>
                element.resourceOrderItemId != -1
                  ? (MP_API.get('/mounted-port', {
                      params: {
                        cprResourceOrderItemId: element.resourceOrderItemId,
                        limit: 1,
                        offset: 0,
                      },
                    }).then((mPortResult) => {
                      if (mPortResult.data) {
                        element.portId = mPortResult.data[0].id;
                        element.portNumber = mPortResult.data[0].portNumber;
                        PC_API.get(
                          `/physical-container/${mPortResult.data[0].physicalContainerId}`
                        ).then(({ data }) => {
                          element.physicalContainerNumber =
                            data.physicalContainerNumber;
                          this.preparedComponentsNew.push(element);
                        });
                      } else {
                        console.log('Порт не найден');
                      }
                    }),
                    (this.preparedTableLoading = false))
                  : (this.preparedTableLoading = false)
              )
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
          console.log('this.physicalContainers', this.physicalContainers);
        })
        .catch((error) => {
          console.log(error);
          this.physicalContainers = [];
        });
    },

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
          cprResourceOrderItemId: this.resourceOrderItemId,
        })
          .then((mountResult) => {
            for (let i = 0; i < poReqItemCompIds.length; i++) {
              POR_API.patch(
                `/po-req-item/${poRequestItemId}/po-req-item-component/${poReqItemCompIds[i]}`,
                {
                  resourceOrderItemId: creationResult.data.data.id,
                }
              )
                .then(() => {
                  if (
                    poReqItemCompIds[i] ===
                    poReqItemCompIds[poReqItemCompIds.length - 1]
                  ) {
                    useOrderStore().getOrder(
                      useOrderStore().selectedOrder.cprResourceOrderPoReqId,
                      useOrderStore().selectedOrder.id
                    );
                    this.fetchProductInfo(
                      useOrderStore().selectedOrder.productOfferRequestId,
                      useOrderStore().selectedOrder.geoPlace.id
                    );
                  }
                  Notify.create({
                    message: 'Успешно назначен',
                    type: 'positive',
                    position: 'top',
                  });
                })
                .catch((error) => {
                  console.log(error);
                  Notify.create({
                    message: 'Ошибка назначения',
                    type: 'negative',
                    position: 'top',
                  });
                });
            }
            console.log(mountResult);
          })
          .catch((error) => {
            console.log(error);
            Notify.create({
              message: 'Ошибка назначения',
              type: 'negative',
              position: 'top',
            });
          });
      });
    },

    editPosition({
      cprRoPoReqId,
      cprRoPoReqWoId,
      cprRoPoReqWoItemId,
      compositePhysResSpecId,
      physicalContainerId,
      transportCpeFuncSpecId,
      wiringTypeId,
      compositePhysResId,
      compositePhysResNum,
      compositePhysResFullNum,
      mountedPortId,
      currentPortId,
    }) {
      CPR_RO_API.patch(
        `/cpr-resource-order-po-req/${cprRoPoReqId}/work-order/${cprRoPoReqWoId}/item/${cprRoPoReqWoItemId}`,
        {
          compositePhysResSpecId,
          physicalContainerId,
          transportCpeFuncSpecId,
          wiringTypeId,
          compositePhysResId,
          compositePhysResNum,
          compositePhysResFullNum,
        }
      ).then(() => {
        MP_API.patch(`/mounted-port/${mountedPortId}`, {
          usageStateId: 2,
          cprResourceOrderItemId: cprRoPoReqWoItemId,
        })
          .then((mountResult) => {
            // TODO: handle success/error
            console.log(mountResult);
            MP_API.patch(`/mounted-port/${currentPortId}`, {
              usageStateId: 1,
              cprResourceOrderItemId: -1,
            })
              .then((mountResult) => {
                useOrderStore().getOrder(
                  useOrderStore().selectedOrder.cprResourceOrderPoReqId,
                  useOrderStore().selectedOrder.id
                );
                this.fetchProductInfo(
                  useOrderStore().selectedOrder.productOfferRequestId,
                  useOrderStore().selectedOrder.geoPlace.id
                );
                Notify.create({
                  message: 'Успешно отредактирован',
                  type: 'positive',
                  position: 'top',
                });
                console.log(mountResult);
              })
              .catch((error) => {
                console.log(error);
                Notify.create({
                  message: 'Ошибка редактирования',
                  type: 'negative',
                  position: 'top',
                });
              });
          })
          .catch((error) => {
            console.log(error);
            Notify.create({
              message: 'Ошибка редактирования',
              type: 'negative',
              position: 'top',
            });
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
