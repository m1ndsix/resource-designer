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
            v-model="state.dateFromInput"
            debounce="2500"
            label="От"
          >
            <template v-slot:append>
              <q-icon
                v-if="state.dateFromInput !== ''"
                class="cursor-pointer"
                name="clear"
                @click.stop.prevent="state.dateFromInput = ''"
              />
              <q-icon name="event" color="green" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="state.dateFromInput" mask="YYYY-MM-DD">
                    <div class="row items-center justify-end">
                      <q-btn
                        v-close-popup
                        label="Закрыть"
                        color="primary"
                        flat
                      />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
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
              <q-icon
                v-if="state.contactName !== ''"
                class="cursor-pointer"
                name="clear"
                @click.stop.prevent="state.contactName = ''"
              />
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
              <q-icon
                v-if="state.address !== ''"
                class="cursor-pointer"
                name="clear"
                @click.stop.prevent="state.address = ''"
              />
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
              <q-icon
                v-if="state.state !== ''"
                class="cursor-pointer"
                name="clear"
                @click.stop.prevent="state.state = ''"
              />
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
      <template v-slot:loading>
        <q-inner-loading showing color="primary" />
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { ref, reactive, watchEffect } from 'vue';
import { useOrderStore } from 'stores/order';
import { usePrepareStore } from 'stores/prepare';
import { useRouter } from 'vue-router';
import { date } from 'quasar';

const isTableLoading = ref(false);
const orderStore = useOrderStore();
const prepareStore = usePrepareStore();
const router = useRouter();
const myTable = ref();
const pagination = ref({
  page: 1,
  rowsPerPage: 4,
  rowsNumber: 20,
});
const state = reactive({
  dateFromInput: '',
  dateFrom: '',
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

watchEffect(() => {
  if (
    (state.dateFromInput &&
      state.contactName.length == '' &&
      state.address.length == '' &&
      state.state == '') ||
    (state.dateFromInput &&
      state.contactName.length > 3 &&
      state.address.length == '' &&
      state.state == '') ||
    (state.dateFromInput &&
      state.contactName.length == '' &&
      state.address.length > 3 &&
      state.state == '') ||
    (state.dateFromInput &&
      state.contactName.length == '' &&
      state.address.length == '' &&
      state.state) ||
    (state.dateFromInput == '' &&
      state.contactName.length == '' &&
      state.address.length == '' &&
      state.state == '') ||
    (state.dateFromInput == '' &&
      state.contactName.length > 3 &&
      state.address.length == '' &&
      state.state == '') ||
    (state.dateFromInput == '' &&
      state.contactName.length == '' &&
      state.address.length > 3 &&
      state.state == '') ||
    (state.dateFromInput == '' &&
      state.contactName.length == '' &&
      state.address.length == '' &&
      state.state) ||
    (state.dateFromInput &&
      state.contactName.length > 3 &&
      state.address.length == '' &&
      state.state == '') ||
    (state.dateFromInput &&
      state.contactName.length > 3 &&
      state.address.length > 3 &&
      state.state == '') ||
    (state.dateFromInput &&
      state.contactName.length > 3 &&
      state.address.length > 3 &&
      state.state) ||
    (state.dateFromInput == '' &&
      state.contactName.length == '' &&
      state.address.length > 3 &&
      state.state == '') ||
    (state.dateFromInput == '' &&
      state.contactName.length == '' &&
      state.address.length > 3 &&
      state.state) ||
    (state.dateFromInput &&
      state.contactName.length == '' &&
      state.address.length > 3 &&
      state.state == '') ||
    (state.dateFromInput &&
      state.contactName.length == '' &&
      state.address.length > 3 &&
      state.state) ||
    (state.dateFromInput &&
      state.contactName.length > 3 &&
      state.address.length > 3 &&
      state.state == '') ||
    (state.dateFromInput == '' &&
      state.contactName.length > 3 &&
      state.address.length > 3 &&
      state.state == '') ||
    (state.dateFromInput == '' &&
      state.contactName.length > 3 &&
      state.address.length > 3 &&
      state.state)
  ) {
    if (state.dateFromInput) {
      state.dateFrom = state.dateFromInput + 'T00:00:00Z';
    } else {
      state.dateFrom = '1900-01-01T00:00:00Z';
    }

    if (myTable.value) {
      myTable.value.pagination.page = 0;
      myTable.value.requestServerInteraction();
    }
  }
});

function onTableRequest(request) {
  isTableLoading.value = true;
  const newPagination = request.pagination;
  const offset = (newPagination.page - 1) * newPagination.rowsPerPage;
  const limit = newPagination.rowsPerPage;

  orderStore.getOrdersCount(
    state.dateFrom,
    state.contactName,
    state.address,
    state.state
  );

  orderStore
    .getOrders(
      offset,
      limit,
      state.dateFrom,
      state.contactName,
      state.address,
      state.state
    )
    .then(() => {
      pagination.value.rowsNumber = orderStore.ordersCount;
      pagination.value.page = newPagination.page;
      pagination.value.rowsPerPage = newPagination.rowsPerPage;
      isTableLoading.value = false;
    });
  orderStore.getBaseCfsSpecs();
  orderStore.getProductSpecs();
  orderStore.getCprSpecs();
}

function prepareOrder(order) {
  orderStore.selectedOrder = { ...order };
  orderStore.patchWorkOrder(order.cprResourceOrderPoReqId, order.id, 2);
  prepareStore.patchPORState(orderStore.selectedOrder.productOfferRequestId, 2);
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
