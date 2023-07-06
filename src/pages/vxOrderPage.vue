<template>
  <div>
    <q-drawer show-if-above bordered>
      <div class="q-pa-sm q-gutter-sm">
        <q-list>
          <q-item-label header> Время создания поручения </q-item-label>
          <q-input
            color="grey-3"
            label-color="grey"
            outlined
            v-model="state.dateFrom"
            debounce="2500"
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
            v-model="state.dateTo"
            debounce="2500"
            label="До"
          >
            <template v-slot:append>
              <q-icon name="event" color="green" />
            </template>
          </q-input>
          <q-item-label header> По ФИО контакта </q-item-label>
          <q-input
            color="grey-3"
            label-color="grey"
            outlined
            v-model="state.contactName"
            debounce="2500"
            label="ФИО"
          >
            <template v-slot:append>
              <q-icon name="account_circle" color="green" />
            </template>
          </q-input>
          <q-item-label header> По адресу </q-item-label>
          <q-input
            color="grey-3"
            label-color="grey"
            outlined
            v-model="state.address"
            debounce="2500"
            label="Адрес"
          >
            <template v-slot:append>
              <q-icon name="home" color="green" />
            </template>
          </q-input>
          <q-item-label header> По состоянию </q-item-label>
          <q-select
            color="grey-3"
            label-color="grey"
            outlined
            v-model="state.state"
            :options="stateOptions"
            label="Состояние"
          >
            <template v-slot:append>
              <q-icon name="list_alt" color="green" />
            </template>
          </q-select>
        </q-list>
      </div>
    </q-drawer>
    <q-table
      ref="myTable"
      dense
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

<script setup>
import { ref, reactive, onMounted, watchEffect } from 'vue';
import { useOrderStore } from 'stores/order';
import { useRouter } from 'vue-router';
import { date } from 'quasar';

const isTableLoading = ref(false);
const pagination = ref({
  page: 1,
  rowsPerPage: 5,
  rowsNumber: 20,
});

const state = reactive({
  dateFrom: '2000-01-01',
  dateTo: '2030-01-01',
  contactName: '',
  address: '',
  state: '',
});

const stateOptions = [
  'Новый',
  'В работе',
  'На уточнении адреса',
  'Уточнение завершено',
  'Выполнено',
];

const orderStore = useOrderStore();

const router = useRouter();

const myTable = ref();

watchEffect(() => {
  console.log('state.dateFrom', state.dateFrom);
  console.log('state.dateTo', state.dateTo);
  console.log('state.contactName', state.contactName);
  console.log('state.address', state.address);
  console.log('state.state', state.state);
  if (
    state.state ||
    state.address ||
    state.dateFrom ||
    state.dateTo ||
    state.contactName
  ) {
    console.log('watchEffect');
    console.log('myTable.value', myTable.value);
    if (myTable.value) {
      myTable.value.requestServerInteraction();
    }
  }
});

onMounted(() => {
  console.log('onMounted');
  // orderStore.getBaseCfsSpecs();
  // orderStore.getProductSpecs();
  // orderStore.getCprSpecs();
});

function onTableRequest(request) {
  console.log('onTableRequest');
  console.log('request ', request);
  isTableLoading.value = true;

  const newPagination = request.pagination;
  const offset = (newPagination.page - 1) * newPagination.rowsPerPage;
  const limit = newPagination.rowsPerPage;

  orderStore
    .getOrders(
      offset,
      limit,
      state.dateFrom + 'T00:00:00Z',
      state.dateTo + 'T00:00:00Z',
      state.contactName,
      state.address,
      state.state
    )
    .then(() => {
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

function prepareOrder(order) {
  orderStore.selectedOrder = { ...order };
  orderStore.patchWorkOrder(order.cprResourceOrderPoReqId, order.id, 2);
  router.push('/prepare');
}

const columns = reactive([
  { name: 'action', label: 'Действие', field: 'action', align: 'left' },
  {
    name: 'id',
    required: true,
    label: '№ поручения',
    align: 'left',
    field: 'id',
    sortable: true,
  },
  {
    name: 'productOfferRequestId',
    required: true,
    label: '№ запроса на ПП',
    align: 'left',
    field: 'productOfferRequestId',
    sortable: true,
  },
  {
    name: 'contactName',
    required: true,
    label: 'ФИО контакта',
    align: 'left',
    field: 'contactName',
    sortable: true,
  },
  {
    name: 'mobilePhoneNumber',
    required: true,
    label: 'Номер контакта',
    align: 'left',
    field: 'mobilePhoneNumber',
    sortable: true,
  },
  {
    name: 'geoPlace',
    required: true,
    label: 'Адрес',
    align: 'left',
    field: (row) => row.geoPlace.nameRu,
    sortable: true,
  },
  {
    name: 'stateData',
    required: true,
    label: 'Состояние',
    align: 'left',
    field: (row) => row.stateData.nameRu,
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
