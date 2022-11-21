<template>
  <div>
    <q-drawer show-if-above bordered>
      <q-list>
        <q-item-label header> Время создания поручения </q-item-label>
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
      title="Поручения"
      :rows="orderStore.orders"
      :columns="columns"
      row-key="name"
      :loading="isTableLoading"
      v-model:pagination="pagination"
      @request="onTableRequest"
    >
      <template v-slot:body-cell-action="scope">
        <q-td>
          <q-btn
            v-model="scope.selected"
            color="secondary"
            label="Взять в работу"
            @click="prepareOrder(scope.row)"
          />
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useOrderStore } from 'stores/order';
import { useRouter } from 'vue-router';
import { date } from 'quasar';

const text = ref('');
const isTableLoading = ref(false);
const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 20,
});

const orderStore = useOrderStore();

const router = useRouter();

onMounted(() => {
  isTableLoading.value = true;
  orderStore.getOrders(0, 10).then(() => {
    isTableLoading.value = false;
  });
});

function onTableRequest(request) {
  isTableLoading.value = true;

  const newPagination = request.pagination;
  const offset = (newPagination.page - 1) * newPagination.rowsPerPage;
  const limit = newPagination.rowsPerPage;

  orderStore.getOrders(offset, limit).then(() => {
    let newRowsNumber =
      (newPagination.page - 1) * newPagination.rowsPerPage +
      orderStore.orderCount;

    newRowsNumber =
      orderStore.orderCount < limit ? newRowsNumber : newRowsNumber + limit;

    pagination.value.rowsNumber = newRowsNumber;
    pagination.value.page = newPagination.page;
    pagination.value.rowsPerPage = newPagination.rowsPerPage;
    isTableLoading.value = false;
  });
}

function prepareOrder(order: any) {
  orderStore.selectedOrder = { ...order };
  router.push('/prepare');
}

const columns = reactive([
  { name: 'action', label: 'Действие', field: 'action', align: 'left' },
  {
    name: 'externalId',
    required: true,
    label: 'Номер поручения',
    align: 'left',
    field: 'externalId',
    sortable: true,
  },
  {
    name: 'externalId',
    required: true,
    label: 'Номер запроса на ПП',
    align: 'left',
    field: 'externalId',
    sortable: true,
  },
  {
    name: 'externalId',
    required: true,
    label: 'Адрес',
    align: 'left',
    field: 'externalId',
    sortable: true,
  },
  {
    name: 'stateData',
    required: true,
    label: 'Состояние',
    align: 'left',
    field: (row) => row.stateData.name,
    sortable: true,
  },
  {
    name: 'createDate',
    align: 'center',
    label: 'Создан',
    field: (row) => date.formatDate(row.createDate, 'YYYY-MM-DD HH:mm:ss'),
    sortable: true,
  },
  {
    name: 'createUser',
    label: 'Исполнитель',
    field: 'createUser',
    sortable: true,
  },
]);
</script>
