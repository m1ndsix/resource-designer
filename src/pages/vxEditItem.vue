<template>
  <q-page padding>
    <q-table
      title="Редактирование позиции заказа"
      :rows="itemsExample"
      :columns="columns"
      row-key="name"
      selection="none"
      :hide-pagination="true"
    >
      <template v-slot:body-cell-actions="scope">
        <q-td>
          <div class="q-pa-md q-gutter-sm">
            <q-btn
              v-model="scope.selected"
              color="primary"
              label="Редактировать"
            />
            <q-btn color="secondary" label="Сохранить" />
            <q-btn color="red" label="Отменить" />
          </div>
        </q-td>
      </template>
      <template v-slot:top>
        <div class="text-h4">Позиция заказа по адресу ул. Абая, 100</div>
        <br />
        <div class="q-pa-md">
          <div class="row q-gutter-sm">
            <q-btn-dropdown
              split
              class="glossy"
              color="primary"
              label="Обследователь"
            >
              <q-list>
                <q-item clickable v-close-popup>
                  <q-item-section>
                    <q-item-label>Есть ТВ</q-item-label>
                    <q-item-label caption>Username</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-icon name="info" color="amber" />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>

            <q-btn-dropdown
              split
              class="glossy"
              color="primary"
              label="Измеритель"
            >
              <q-list>
                <q-item clickable v-close-popup>
                  <q-item-section>
                    <q-item-label>Линия в порядке</q-item-label>
                    <q-item-label caption>Username</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-icon name="info" color="amber" />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>

            <q-btn-dropdown
              split
              class="glossy"
              color="primary"
              label="Проверка линии"
            >
              <q-list>
                <q-item clickable v-close-popup>
                  <q-item-section>
                    <q-item-label>Трассировка линии</q-item-label>
                    <q-item-label caption>[{:::}]</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-icon name="info" color="amber" />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </div>
        </div>
      </template>
    </q-table>
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

const rows = [
  {
    position: '1',
    calories: 'FTTH',
    bronze: 'Установка',
    calcium: 'Новая',
    address: 'ул. Желтоксан, 100',
    iron: 'ОРК 229/06/2/1',
    copper: '8',
    tts: 'ONT-2-4',
  },
];

const itemsExample = [
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
    geoPlaceId: 13246,
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
    geoPlaceId: 13246435,
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
  },
];

import { defineComponent } from 'vue';
export default {
  setup() {
    return {
      rows,
      columns,
      itemsExample,
    };
  },
};
</script>
