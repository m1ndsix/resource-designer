<template>
  <div>
    <q-drawer show-if-above bordered>
      <div class="q-pa-sm q-gutter-sm">
        <q-list>
          <q-item-label header> Время создания поручения </q-item-label>
          <q-input filled v-model="state.dateFrom" mask="date" label="От">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer" color="green">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="state.dateFrom" :locale="myLocale">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer" color="green" />
          </template>
          <q-input filled v-model="state.dateTo" mask="date" label="До">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer" color="green">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="state.dateTo" :locale="myLocale">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
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
            :options="options"
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
      dense
      title="Поручения"
      :rows="filteredOrders"
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
import { ref, reactive, onMounted, computed } from 'vue';
import { useOrderStore } from 'stores/order';
import { useRouter } from 'vue-router';
import { date } from 'quasar';

const isTableLoading = ref(false);
const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 20,
});
const state = reactive({
  dateFrom: '',
  dateTo: '',
  contactName: '',
  address: '',
  state: '',
});

const options = [
  'Новый',
  'В работе',
  'На уточнении адреса',
  'Уточнение завершено',
  'Выполнено',
];

const orderStore = useOrderStore();

const router = useRouter();

const myLocale = {
  days: 'Понедельник_Вторник_Среда_Четверг_Пятница_Суббота_Воскресенье'.split(
    '_'
  ),
  daysShort: 'Пнд_Втр_Срд_Чтв_Птн_Сбт_Вск'.split('_'),
  months:
    'Январь_Февраль_Март_Апрель_Май_Июнь_Июль_Аугуст_Сентябрь_Октябрь_Ноябрь_Декабрь'.split(
      '_'
    ),
  monthsShort: 'Янв_Фев_Мар_Апр_Май_Июн_Июл_Авг_Сен_Окт_Ноя_Дек'.split('_'),
  firstDayOfWeek: 1,
  format24h: true,
  pluralDay: 'dias',
};

onMounted(() => {
  isTableLoading.value = true;
  orderStore.getOrders(0, 10).then(() => {
    isTableLoading.value = false;
  });
  orderStore.getBaseCfsSpecs();
  orderStore.getProductSpecs();
  orderStore.getCprSpecs();
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

const filteredOrders = computed(() => {
  let filtered = orderStore.orders;

  // Фильтрация по дате
  if (state.dateFrom && state.dateTo) {
    filtered = filtered.filter((order) => {
      const orderDate = new Date(order.createDate);
      const fromDate = new Date(state.dateFrom);
      const toDate = new Date(state.dateTo);
      return orderDate >= fromDate && orderDate <= toDate;
    });
  }

  // Фильтрация по имени
  if (state.contactName) {
    filtered = filtered.filter((row) =>
      row.contactName.toLowerCase().includes(state.contactName.toLowerCase())
    );
  }

  // Фильтрация по адресу
  if (state.address) {
    const lowercaseAddress = state.address.toLowerCase();
    filtered = filtered.filter((row) =>
      row.geoPlace.nameRu.toLowerCase().includes(lowercaseAddress)
    );
  }

  // Фильтрация по состоянию
  if (state.state) {
    filtered = filtered.filter((row) =>
      row.stateData.nameRu.toLowerCase().includes(state.state.toLowerCase())
    );
  }

  return filtered;
});
</script>
