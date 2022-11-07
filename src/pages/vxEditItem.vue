<template>
  <q-page padding>
    <VxItemCard v-for="item in itemsExample" :key="item.id" :item="item" />
  </q-page>
</template>

<script>
const columns = [
  { name: 'actions', label: 'Действие', field: 'action', align: 'left' },
  {
    name: 'position',
    required: true,
    label: 'Номер позиции',
    field: 'position', //rowindex?
    align: 'center',
  },
  {
    name: 'spec',
    align: 'center',
    label: 'Спецификация',
    field: 'compositePhysResSpecId',
    sortable: true,
  },
  {
    name: 'action',
    align: 'center',
    label: 'Действие',
    field: (row) => row.actionData.name,
    sortable: true,
  },
  {
    name: 'state',
    align: 'center',
    label: 'Состояние',
    field: (row) => row.stateData.name,
    sortable: true,
  },
  {
    name: 'pc',
    align: 'center',
    label: 'Физический контейнер',
    field: 'physicalContainerId',
    sortable: true,
  },
  {
    name: 'port',
    align: 'center',
    label: 'Порт',
    field: 'portnumber', //calculated
    sortable: true,
  },
  {
    name: 'tts',
    align: 'center',
    label: 'Транспортная спецификация',
    field: 'transportCpeFuncSpecId',
    sortable: true,
  },
];

const itemsExample = [
  {
    name: 1,
    components: [
      {
        id: 23654,
        actionId: 1,
        actionData: {
          id: 1,
          name: 'Установка',
        },
        stateId: 2,
        stateData: {
          id: 2,
          name: 'В работе',
        },
        externalId: '456gtr65',
        compositePhysResSpecId: 1000776,
        physicalContainerId: 354,
        geoPlaceId: 123,
        portnumber: 8,
        transportCpeFuncSpecId: 13,
        externalProjectId: 1423375,
        externalCompositePhysResNum: 3425313,
        processUserId: 543,
        processDate: '2022-08-24T14:15:22Z',
        createDate: '2022-06-28T14:15:22Z',
        updateDate: '2022-06-28T14:15:22Z',
        createUser: 'Japparov.S',
        updateUser: 'Japparov.S',
        createApp: 'resource-design-fe',
        updateApp: 'resource-design-fe',
        selected: false,
        measurementResult: 'Линия в порядке',
      },
      {
        id: 23655,
        actionId: 1,
        actionData: {
          id: 1,
          name: 'Установка',
        },
        stateId: 2,
        stateData: {
          id: 2,
          name: 'В работе',
        },
        externalId: '456gtr6513',
        compositePhysResSpecId: 1000776,
        physicalContainerId: 355,
        geoPlaceId: 456,
        portnumber: 3,
        transportCpeFuncSpecId: 14,
        externalProjectId: 1423375,
        externalCompositePhysResNum: 3425313,
        processUserId: 543,
        processDate: '2022-08-24T14:15:22Z',
        createDate: '2022-06-28T14:15:22Z',
        updateDate: '2022-06-28T14:15:22Z',
        createUser: 'Japparov.S',
        updateUser: 'Japparov.S',
        createApp: 'resource-design-fe',
        updateApp: 'resource-design-fe',
        selected: false,
        measurementResult: 'Линия в порядке',
      },
    ],
  },
  {
    name: 2,
    components: [
      {
        id: 23655,
        actionId: 1,
        actionData: {
          id: 1,
          name: 'Замена',
        },
        stateId: 2,
        stateData: {
          id: 2,
          name: 'В работе',
        },
        externalId: '456gtestr6513',
        compositePhysResSpecId: 1000776,
        physicalContainerId: 245,
        geoPlaceId: 988,
        portnumber: 3,
        transportCpeFuncSpecId: 14,
        externalProjectId: 1423375,
        externalCompositePhysResNum: 3425313,
        processUserId: 543,
        processDate: '2022-08-24T14:15:22Z',
        createDate: '2022-06-28T14:15:22Z',
        updateDate: '2022-06-28T14:15:22Z',
        createUser: 'Japparov.S',
        updateUser: 'Japparov.S',
        createApp: 'resource-design-fe',
        updateApp: 'resource-design-fe',
        selected: false,
        measurementResult: 'Линия в порядке',
      },
    ],
  },
];

import { defineComponent } from 'vue';
import VxItemCard from 'src/components/vxItemCard.vue';
export default {
  setup() {
    return {
      itemsExample,
    };
  },
  components: { VxItemCard },
};
</script>
