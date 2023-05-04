<template>
  <q-card style="max-width: 1000px">
    <q-card-section class="row">
      <div class="text-h6">Результат</div>
      <q-space />
      <q-btn icon="close" flat round dense v-close-popup />
    </q-card-section>
    <q-table
      class="q-ma-sm"
      hide-bottom
      :rows="orderStore.techInspections"
      :columns="state.columns"
      row-key="id"
    >
    </q-table>
  </q-card>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue';
import { useOrderStore } from 'stores/order';

const orderStore = useOrderStore();

interface Rows {
  rowId: number;
  date: string;
  user: string;
  extraWork: string;
  cabelType: string;
  resultType: string;
  result: string;
}

interface State {
  columns: any[];
}
const initialState: State = {
  columns: [
    {
      name: 'workOrderId',
      label: 'Номер поручения',
      field: (row) => row.workOrderId,
      align: 'left',
    },
    {
      name: 'createDate',
      label: 'Дата',
      field: (row) => row.createDate,
      align: 'left',
    },
    {
      name: 'createEmployeeId',
      label: 'Исполнитель',
      field: (row) => row.createEmployeeId,
      align: 'left',
    },
    {
      name: 'isOverbudget',
      label: 'Требуются сверхпостроечные работы',
      field: (row) => (row.isOverbudget ? 'Да' : 'Нет'),
      align: 'left',
    },
    {
      name: 'wiringTypeData',
      label: 'Тип проводки',
      field: (row) => row.wiringTypeData.nameRu,
      align: 'left',
    },
    {
      name: 'resultTypeData',
      label: 'Тип результата',
      field: (row) => row.resultTypeData.nameRu,
      align: 'left',
    },
    {
      name: 'result',
      label: 'Результат',
      field: (row) => row.result,
      align: 'left',
    },
  ],
};
const state: State = reactive(initialState);
onMounted(() => {
  if (orderStore.selectedOrder?.id) {
    orderStore.fetchTechInspections(orderStore.selectedOrder.id);
  }
});
</script>

<style lang="sass" scoped></style>
