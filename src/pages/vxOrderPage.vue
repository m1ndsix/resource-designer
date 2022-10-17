<template>
  <div>
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
    <div>
      <q-table
        v-show="showSimulatedReturnData"
        title="Заказы"
        :rows="orderStore.orders"
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
              @click="prepareOrder(scope.row)"
            />
          </q-td>
        </template>
      </q-table>
      <q-inner-loading
        :showing="visible"
        label="Загрузка..."
        label-class="text-teal"
        label-style="font-size: 1.1em"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useOrderStore } from 'stores/order';
import { usePrepareStore } from 'stores/prepare';

const text = ref('');
const visible = ref(false);
const showSimulatedReturnData = ref(false);

const orderStore = useOrderStore();
const prepareStore = usePrepareStore();

onMounted(() => {
  visible.value = true;
  orderStore.getOrders(0, 10).then(() => {
    setTimeout(() => {
      visible.value = false;
      showSimulatedReturnData.value = true;
    }, 3000);
  });
});

function prepareOrder(order: any) {
  orderStore.selectedOrder = { ...order };
  prepareStore.getPoRequest(order.productOfferRequestId);
}

const columns = reactive([
  { name: 'action', label: 'Действие', field: 'action', align: 'left' },
  {
    name: 'externalId',
    required: true,
    label: 'Номер заказа',
    align: 'left',
    field: 'externalId',
    sortable: true,
  },
  {
    name: 'createDate',
    align: 'center',
    label: 'Создан',
    field: 'createDate',
    sortable: true,
  },
  {
    name: 'updateDate',
    label: 'Обновлен',
    field: 'updateDate',
    sortable: true,
  },
  {
    name: 'createUser',
    label: 'Оператор',
    field: 'createUser',
    sortable: true,
  },
  {
    name: 'createApp',
    label: 'Система',
    field: 'createApp',
    sortable: true,
  },
]);
</script>
