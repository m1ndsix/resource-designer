<template>
  <q-drawer show-if-above bordered>
    <q-list>
      <q-item-label header> Фильтр </q-item-label>
    </q-list>
  </q-drawer>
  <q-table
    title="Заказы"
    :rows="rows"
    :columns="columns"
    row-key="name"
    selection="none"
  >
    <template v-slot:body-cell-action="scope">
      <q-td>
        <q-btn
          v-model="scope.selected"
          color="secondary"
          label="Взять в работу"
        />
      </q-td>
    </template>
  </q-table>
</template>

<script>
const columns = [
  { name: 'action', label: 'Действие', field: 'action', align: 'left' },
  {
    name: 'name',
    required: true,
    label: 'Номер заказа (external_id)',
    align: 'left',
    field: (row) => row.name,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'calories',
    align: 'center',
    label: 'Создан (create_date)',
    field: 'calories',
    sortable: true,
  },
  {
    name: 'bronze',
    label: 'Обновлен (update_date)',
    field: 'bronze',
    sortable: true,
    sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
  },
  {
    name: 'calcium',
    label: 'Оператор (create_user)',
    field: 'calcium',
    sortable: true,
    sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
  },
  {
    name: 'iron',
    label: 'Система (create_app)',
    field: 'iron',
    sortable: true,
    sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
  },
  {
    name: 'copper',
    label: 'ИД Населенного пункта (state_id)',
    field: 'copper',
    sortable: true,
    sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
  },
];

const rows = [
  {
    name: '5823474',
    calories: '21.09.2022',
    bronze: '22.09.2022',
    calcium: 'root',
    iron: 'Activator',
    copper: '2',
  },
  {
    name: '5823474',
    calories: '21.09.2022',
    bronze: '22.09.2022',
    calcium: 'root',
    iron: 'Activator',
    copper: '2',
  },
  {
    name: '5823474',
    calories: '21.09.2022',
    bronze: '22.09.2022',
    calcium: 'root',
    iron: 'Activator',
    copper: '2',
  },
  {
    name: '5823474',
    calories: '21.09.2022',
    bronze: '22.09.2022',
    calcium: 'root',
    iron: 'Activator',
    copper: '2',
  },
  {
    name: '5823474',
    calories: '21.09.2022',
    bronze: '22.09.2022',
    calcium: 'root',
    iron: 'Activator',
    copper: '2',
  },
  {
    name: '5823474',
    calories: '21.09.2022',
    bronze: '22.09.2022',
    calcium: 'root',
    iron: 'Activator',
    copper: '2',
  },
  {
    name: '5823474',
    calories: '21.09.2022',
    bronze: '22.09.2022',
    calcium: 'root',
    iron: 'Activator',
    copper: '2',
  },
  {
    name: '5823474',
    calories: '21.09.2022',
    bronze: '22.09.2022',
    calcium: 'root',
    iron: 'Activator',
    copper: '2',
  },
  {
    name: '5823474',
    calories: '21.09.2022',
    bronze: '22.09.2022',
    calcium: 'root',
    iron: 'Activator',
    copper: '2',
  },
  {
    name: '5823474',
    calories: '21.09.2022',
    bronze: '22.09.2022',
    calcium: 'root',
    iron: 'Activator',
    copper: '2',
  },
  {
    name: '5823474',
    calories: '21.09.2022',
    bronze: '22.09.2022',
    calcium: 'root',
    iron: 'Activator',
    copper: '2',
  },
  {
    name: '5823474',
    calories: '21.09.2022',
    bronze: '22.09.2022',
    calcium: 'root',
    iron: 'Activator',
    copper: '2',
  },
  {
    name: '5823474',
    calories: '21.09.2022',
    bronze: '22.09.2022',
    calcium: 'root',
    iron: 'Activator',
    copper: '2',
  },
  {
    name: '5823474',
    calories: '21.09.2022',
    bronze: '22.09.2022',
    calcium: 'root',
    iron: 'Activator',
    copper: '2',
  },
  {
    name: '5823474',
    calories: '21.09.2022',
    bronze: '22.09.2022',
    calcium: 'root',
    iron: 'Activator',
    copper: '2',
  },
  {
    name: '5823474',
    calories: '21.09.2022',
    bronze: '22.09.2022',
    calcium: 'root',
    iron: 'Activator',
    copper: '2',
  },
];

export default {
  setup() {
    return {
      columns,
      rows,
    };
  },
};
</script>
