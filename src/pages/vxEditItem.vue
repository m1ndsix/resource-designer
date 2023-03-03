<template>
  <div class="q-pa-sm">
    <q-table
      title="Редактирование позиции заказа"
      :rows="components"
      :columns="columns"
      row-key="name"
      selection="none"
      :hide-pagination="true"
    >
      <template v-slot:body-cell-selection="scope">
        <q-td>
          <div class="q-pa-md">
            <q-checkbox v-model="scope.row.selected" />
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-actions="scope">
        <q-td>
          <div class="q-pa-md q-gutter-sm">
            <q-btn
              v-model="scope.selected"
              color="primary"
              label="Редактировать"
            />

            <q-btn color="red" label="Отменить" />
          </div>
        </q-td>
      </template>
      <template v-slot:top>
        <div class="text-h4">
          г. Алматы, ул. Абылай хана
          {{ geoPlaceName() }}
        </div>
        <q-space />
        <div class="q-pa-md">
          <div class="row q-gutter-sm">
            <q-btn-group>
              <q-btn
                color="primary"
                glossy
                label="Измеритель"
                @click="() => (openMeasurementDialog = true)"
              ></q-btn>
            </q-btn-group>

            <q-btn-group>
              <q-btn color="primary" glossy label="Проверка линии"></q-btn>
              <q-btn color="primary" outline label="ЛД" disabled>
                <q-tooltip>
                  {TOWN:727;STATION:272; MAN:ECI; OLT:4/00/08/01;ODF:2/03/08/13;
                  LD:ОРШ 272/07: 00/ODF-1/00/29, 00/ODF-5/00/118,
                  00/ODF-5/00/121, 00/ODF-1/00/138; ОРКсп 272/07/29/3:
                  00/00/1х8/7; OU:0;ONUPORTNUM:0; (DSL,IPTV,FXS); 6.518 км}
                </q-tooltip>
              </q-btn>
            </q-btn-group>
          </div>
        </div>
      </template>
    </q-table>
  </div>
  <br />
  <q-dialog v-model="openMeasurementDialog">
    <vx-measurement />
  </q-dialog>
</template>

<script>
const columns = [
  {
    name: 'selection',
    label: 'Выбрать',
    field: (row) => row.selected,
    align: 'left',
  },
  { name: 'actions', label: 'Действие', field: 'action', align: 'center' },
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
  {
    name: 'measurement-result',
    align: 'center',
    label: 'Результат измерения',
    field: 'measurementResult',
    sortable: true,
  },
];
const components = [
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
];

import { ref } from 'vue';
import { usePrepareStore } from 'stores/prepare';
//import { useOrderStore } from 'src/stores/order';

export default {
  setup() {
    const prepareStore = usePrepareStore();
    //const orderStore = useOrderStore();
    return {
      columns,
      components,
      prepareStore,
    };
  },
  methods: {
    geoPlaceName() {
      return this.prepareStore.geoPlace;
    },
  },
};
</script>
