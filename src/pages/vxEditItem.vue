<template>
  <q-page padding>
    <q-table
      title="Редактирование позиции заказа"
      :rows="rows"
      :columns="columns"
      row-key="name"
      selection="none"
      :hide-pagination="true"
    >
      <template v-slot:top>
        <div class="text-h4">
          Редактирование позиции заказа
          <div class="q-pa-md q-gutter-y-md column items-start">
            <div class="text-h6">
              <q-btn color="primary" label="Обследователь" />
              <q-chip square align="center" color="green">Есть ТВ</q-chip>
            </div>
            <div class="text-h6">
              <q-btn color="primary" label="Измеритель" />
              <q-chip square align="center" color="green"
                >Линия в порядке</q-chip
              >
            </div>
          </div>
        </div>
      </template>
    </q-table>
    <div class="q-pa-md q-gutter-sm">
      <q-btn color="red" label="Отменить" />
      <q-btn color="secondary" label="Сохранить" />
    </div>
  </q-page>
</template>

<script lang="ts">
const columns = [
  {
    name: 'position',
    required: true,
    label: 'Номер позиции',
    field: 'position',
    align: 'center',
    sortable: true,
  },
  {
    name: 'calories',
    align: 'center',
    label: 'Спецификация',
    field: 'calories',
    sortable: true,
  },
  {
    name: 'bronze',
    align: 'center',
    label: 'Действие',
    field: 'bronze',
    sortable: true,
  },
  {
    name: 'calcium',
    align: 'center',
    label: 'Состояние',
    field: 'calcium',
    sortable: true,
  },
  {
    name: 'address',
    align: 'center',
    label: 'Состояние',
    field: 'address',
    sortable: true,
  },
  {
    name: 'iron',
    align: 'center',
    label: 'Физический контейнер',
    field: 'iron',
    sortable: true,
  },
  {
    name: 'copper',
    align: 'center',
    label: 'Порт',
    field: 'copper',
    sortable: true,
  },
  {
    name: 'tts',
    align: 'center',
    label: 'Транспортная спецификация',
    field: 'tts',
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

import { defineComponent } from 'vue';
export default {
  setup() {
    return {
      rows,
      columns,
    };
  },
};
</script>
