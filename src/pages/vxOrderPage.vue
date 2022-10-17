<template>
  <q-drawer show-if-above bordered>
    <q-list>
      <q-item-label header> Время создания заказа </q-item-label>
      <q-input
        color="grey-3"
        label-color="grey"
        outlined
        v-model="text"
        label="От"
      >
        <template v-slot:append>
          <q-icon name="event" color="green" />
        </template>
      </q-input>
      <q-input
        color="grey-3"
        label-color="grey"
        outlined
        v-model="text"
        label="До"
      >
        <template v-slot:append>
          <q-icon name="event" color="green" />
        </template>
      </q-input>
    </q-list>
  </q-drawer>
  <q-table
    title="Заказы"
    :rows="orders"
    :columns="columns"
    row-key="name"
    selection="none"
    :pagination="pagination"
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
    name: 'externalId',
    required: true,
    label: 'Номер заказа (external_id)',
    align: 'left',
    field: 'externalId',
    //format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'state',
    align: 'center',
    label: 'Статус',
    field: (row) => row.stateData.name,
    sortable: true,
  },
  {
    name: 'expectedCompletionDate',
    label: 'Запрашиваемая дата завершения',
    field: 'expectedCompletionDate',
    sortable: true,
  },
  {
    name: 'createDate',
    label: 'Дата создания',
    field: (row) => date.formatDate(row.createDate, 'YYYY-MM-DD HH:mm:ss'),
    sortable: true,
  },
  {
    name: 'createApp',
    label: 'Система (create_app)',
    field: 'createApp',
    sortable: true,
  },
  {
    name: 'createUser',
    label: 'Логин создателя',
    field: 'createUser',
    sortable: true,
  },
];

import { roApi } from 'boot/axios';
import { date } from 'quasar';

export default {
  setup() {
    return {
      columns,
      //rows,
    };
  },
  data() {
    return {
      orders: [],
      pagination: { rowsPerPage: 10 },
    };
  },
  mounted() {
    roApi
      .get(
        'api/cpr-resource-order-be/v1.0/cpr-resource-order-manual?limit=10&offset=0',
        {
          headers: {
            Authorization: '123qwerty',
          },
        }
      )
      .then((response) => {
        //console.log(this.orders);
        //console.log(response.data);
        this.orders = response.data;
      })
      .catch(function (error) {
        console.log(error);
      });
  },
};
</script>
