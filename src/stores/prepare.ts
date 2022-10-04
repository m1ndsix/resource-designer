import { defineStore } from 'pinia';

interface State {
  selectedPosition: Position | null;
  positions: Position[];
  selectedComponent: Component | null;
  selectedCustomPosition: CustomPosition | null;
  customPositions: CustomPosition[];
}

interface CustomPosition {
  spec: string;
  equipment: string;
  port: string;
  id: string;
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
}

interface PosCompType {
  id: number;
  name_ru: string;
  name_kz: string;
}

// TODO: remove later
function initialComponents() {
  return [
    {
      id: 58,
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
    },
    {
      id: 59,
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
          components: initialComponents(),
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
          components: initialComponents(),
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
          components: initialComponents(),
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
          components: initialComponents(),
        },
      ],
      selectedComponent: null,
      selectedCustomPosition: {
        spec: '',
        equipment: '',
        port: '',
        id: '',
      },
      customPositions: [],
    };
  },
  // getters: {
  //   doubleCount: (state) => state.counter * 2,
  // },
  // actions: {
  //   increment() {
  //     this.counter++;
  //   },
  // },
});
