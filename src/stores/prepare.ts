import { defineStore } from 'pinia';

interface State {
  selectedPosition: Position | null;
  positions: Position[];
  selectedComponent: Component | null;
  availableResources: Resource[];
}

interface Resource {
  spec: string | null;
  equipment: string | null;
  port: string | null;
  name: string | null;
}

interface Position {
  id: number;
  typeId: number;
  type: PosCompType;
  productOfferReqId: number;
  geoPlaceId: number;
  oldProductOfferId: number;
  newProductOfferId: number;
  caSubscriptionId: number;
  createDate: string;
  updateDate: string;
  createUser: string;
  updateUser: string;
  createApp: string;
  updateApp: string;
  status: string;
  components: Component[];
}

interface Component {
  id: number;
  typeId: number;
  type: PosCompType;
  poReqItemId: string;
  geoPlaceId: number;
  poComponentId: number;
  oldPoStructId: number;
  newPoStructId: number;
  resourceOrderItemId: number;
  agreementId: number;
  billingAccountId: number;
  createDate: string;
  updateDate: string;
  createUser: string;
  updateUser: string;
  createApp: string;
  updateApp: string;
  status: string;
  resource: Resource | null;
}

interface PosCompType {
  id: number;
  name_ru: string;
  name_kz: string;
}

// TODO: remove later
function initialComponents36() {
  return [
    {
      id: 58,
      typeId: 1,
      type: {
        id: 1,
        name_ru: 'Установка',
        name_kz: 'Установка',
      },
      poReqItemId: '36',
      geoPlaceId: 641475,
      poComponentId: 1031076,
      oldPoStructId: -1,
      newPoStructId: 0,
      resourceOrderItemId: -1,
      agreementId: -1,
      billingAccountId: -1,
      createDate: '2022-09-07T04:06:58.220Z',
      updateDate: '2022-09-07T04:06:58.220Z',
      createUser: 'CRM',
      updateUser: 'CRM',
      createApp: 'CRM',
      updateApp: 'CRM',
      status: 'Новый',
      resource: null,
    },
    {
      id: 59,
      typeId: 1,
      type: {
        id: 1,
        name_ru: 'Установка',
        name_kz: 'Установка',
      },
      poReqItemId: '36',
      geoPlaceId: 641475,
      poComponentId: 1031076,
      oldPoStructId: -1,
      newPoStructId: 0,
      resourceOrderItemId: -1,
      agreementId: -1,
      billingAccountId: -1,
      createDate: '2022-09-07T04:06:58.220Z',
      updateDate: '2022-09-07T04:06:58.220Z',
      createUser: 'CRM',
      updateUser: 'CRM',
      createApp: 'CRM',
      updateApp: 'CRM',
      status: 'Новый',
      resource: null,
    },
  ];
}
function initialComponents37() {
  return [
    {
      id: 60,
      typeId: 1,
      type: {
        id: 1,
        name_ru: 'Установка',
        name_kz: 'Установка',
      },
      poReqItemId: '37',
      geoPlaceId: 641475,
      poComponentId: 1031076,
      oldPoStructId: -1,
      newPoStructId: 0,
      resourceOrderItemId: -1,
      agreementId: -1,
      billingAccountId: -1,
      createDate: '2022-09-07T04:06:58.220Z',
      updateDate: '2022-09-07T04:06:58.220Z',
      createUser: 'CRM',
      updateUser: 'CRM',
      createApp: 'CRM',
      updateApp: 'CRM',
      status: 'Новый',
      resource: null,
    },
    {
      id: 61,
      typeId: 1,
      type: {
        id: 1,
        name_ru: 'Установка',
        name_kz: 'Установка',
      },
      poReqItemId: '37',
      geoPlaceId: 641475,
      poComponentId: 1031076,
      oldPoStructId: -1,
      newPoStructId: 0,
      resourceOrderItemId: -1,
      agreementId: -1,
      billingAccountId: -1,
      createDate: '2022-09-07T04:06:58.220Z',
      updateDate: '2022-09-07T04:06:58.220Z',
      createUser: 'CRM',
      updateUser: 'CRM',
      createApp: 'CRM',
      updateApp: 'CRM',
      status: 'Новый',
      resource: null,
    },
  ];
}
function initialComponents38() {
  return [
    {
      id: 62,
      typeId: 1,
      type: {
        id: 1,
        name_ru: 'Установка',
        name_kz: 'Установка',
      },
      poReqItemId: '38',
      geoPlaceId: 641475,
      poComponentId: 1031076,
      oldPoStructId: -1,
      newPoStructId: 0,
      resourceOrderItemId: -1,
      agreementId: -1,
      billingAccountId: -1,
      createDate: '2022-09-07T04:06:58.220Z',
      updateDate: '2022-09-07T04:06:58.220Z',
      createUser: 'CRM',
      updateUser: 'CRM',
      createApp: 'CRM',
      updateApp: 'CRM',
      status: 'Новый',
      resource: null,
    },
    {
      id: 63,
      typeId: 1,
      type: {
        id: 1,
        name_ru: 'Установка',
        name_kz: 'Установка',
      },
      poReqItemId: '38',
      geoPlaceId: 641475,
      poComponentId: 1031076,
      oldPoStructId: -1,
      newPoStructId: 0,
      resourceOrderItemId: -1,
      agreementId: -1,
      billingAccountId: -1,
      createDate: '2022-09-07T04:06:58.220Z',
      updateDate: '2022-09-07T04:06:58.220Z',
      createUser: 'CRM',
      updateUser: 'CRM',
      createApp: 'CRM',
      updateApp: 'CRM',
      status: 'Новый',
      resource: null,
    },
  ];
}
function initialComponents39() {
  return [
    {
      id: 64,
      typeId: 1,
      type: {
        id: 1,
        name_ru: 'Установка',
        name_kz: 'Установка',
      },
      poReqItemId: '39',
      geoPlaceId: 641475,
      poComponentId: 1031076,
      oldPoStructId: -1,
      newPoStructId: 0,
      resourceOrderItemId: -1,
      agreementId: -1,
      billingAccountId: -1,
      createDate: '2022-09-07T04:06:58.220Z',
      updateDate: '2022-09-07T04:06:58.220Z',
      createUser: 'CRM',
      updateUser: 'CRM',
      createApp: 'CRM',
      updateApp: 'CRM',
      status: 'Новый',
      resource: null,
    },
    {
      id: 65,
      typeId: 1,
      type: {
        id: 1,
        name_ru: 'Установка',
        name_kz: 'Установка',
      },
      poReqItemId: '39',
      geoPlaceId: 641475,
      poComponentId: 1031076,
      oldPoStructId: -1,
      newPoStructId: 0,
      resourceOrderItemId: -1,
      agreementId: -1,
      billingAccountId: -1,
      createDate: '2022-09-07T04:06:58.220Z',
      updateDate: '2022-09-07T04:06:58.220Z',
      createUser: 'CRM',
      updateUser: 'CRM',
      createApp: 'CRM',
      updateApp: 'CRM',
      status: 'Новый',
      resource: null,
    },
  ];
}

export const usePrepareStore = defineStore('prepareStore', {
  state: (): State => {
    return {
      selectedPosition: null,
      positions: [
        {
          id: 36,
          typeId: 1,
          type: {
            id: 1,
            name_ru: 'Установка',
            name_kz: 'Установка',
          },
          productOfferReqId: 19593,
          geoPlaceId: 641475,
          oldProductOfferId: -1,
          newProductOfferId: 30598,
          caSubscriptionId: -1,
          createDate: '2022-08-24T08:35:30.697Z',
          updateDate: '2022-08-24T08:35:30.697Z',
          createUser: 'CRM',
          updateUser: 'CRM',
          createApp: 'CRM',
          updateApp: 'CRM',
          status: 'Новый',
          components: initialComponents36(),
        },
        {
          id: 37,
          typeId: 1,
          type: {
            id: 1,
            name_ru: 'Установка',
            name_kz: 'Установка',
          },
          productOfferReqId: 19593,
          geoPlaceId: 641475,
          oldProductOfferId: -1,
          newProductOfferId: 33801,
          caSubscriptionId: -1,
          createDate: '2022-09-07T04:00:29.827Z',
          updateDate: '2022-09-07T04:00:29.827Z',
          createUser: 'CRM',
          updateUser: 'CRM',
          createApp: 'CRM',
          updateApp: 'CRM',
          status: 'Новый',
          components: initialComponents37(),
        },
        {
          id: 38,
          typeId: 1,
          type: {
            id: 1,
            name_ru: 'Установка',
            name_kz: 'Установка',
          },
          productOfferReqId: 19593,
          geoPlaceId: 641475,
          oldProductOfferId: -1,
          newProductOfferId: 33763,
          caSubscriptionId: -1,
          createDate: '2022-09-07T04:06:58.220Z',
          updateDate: '2022-09-07T04:06:58.220Z',
          createUser: 'CRM',
          updateUser: 'CRM',
          createApp: 'CRM',
          updateApp: 'CRM',
          status: 'Новый',
          components: initialComponents38(),
        },
        {
          id: 39,
          typeId: 1,
          type: {
            id: 1,
            name_ru: 'Установка',
            name_kz: 'Установка',
          },
          productOfferReqId: 19593,
          geoPlaceId: 1112087,
          oldProductOfferId: -1,
          newProductOfferId: 30598,
          caSubscriptionId: -1,
          createDate: '2022-09-07T12:38:01.734Z',
          updateDate: '2022-09-07T12:38:01.734Z',
          createUser: 'CRM',
          updateUser: 'CRM',
          createApp: 'CRM',
          updateApp: 'CRM',
          status: 'Новый',
          components: initialComponents39(),
        },
      ],
      selectedComponent: null,
      availableResources: [],
    };
  },
  getters: {
    componentsWithResources: (state) => {
      return state.positions.map((p) => {
        const comps = p.components.map((c) => {
          return {
            compId: c.id,
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
  // actions: {
  //   increment() {
  //     this.counter++;
  //   },
  // },
});
