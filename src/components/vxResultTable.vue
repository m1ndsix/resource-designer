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
      :rows="state.rows"
      :columns="state.columns"
      row-key="id"
    >
    </q-table>
  </q-card>
</template>

<script setup lang="ts">
import { reactive } from 'vue';

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
  rows: Rows[];
}
const initialState: State = {
  columns: [
    {
      name: 'order',
      label: 'Номер поручения',
      field: (row) => row.order,
      align: 'left',
    },
    { name: 'date', label: 'Дата', field: (row) => row.date, align: 'left' },
    {
      name: 'user',
      label: 'Исполнитель',
      field: (row) => row.user,
      align: 'left',
    },
    {
      name: 'extraWork',
      label: 'Требуются сверхпостроечные работы',
      field: (row) => row.extraWork,
      align: 'left',
    },
    {
      name: 'cabelType',
      label: 'Тип проводки',
      field: (row) => row.cabelType,
      align: 'left',
    },
    {
      name: 'resultType',
      label: 'Тип результата',
      field: (row) => row.resultType,
      align: 'left',
    },
    {
      name: 'result',
      label: 'Результат',
      field: (row) => row.result,
      align: 'left',
    },
  ],
  rows: [
    {
      rowId: 1,
      order: '123456',
      date: '20.01.2022',
      user: 'Иванов А.Б',
      extraWork: 'Да',
      cabelType: 'КЛС',
      resultType: 'Есть ТВ',
      result: 'Текстовое примечание',
    },
    {
      rowId: 2,
      order: '234567',
      date: '21.01.2022',
      user: 'Иванов А.Б',
      extraWork: 'Да',
      cabelType: 'КЛС',
      resultType: 'Есть ТВ',
      result: 'Текстовое примечание',
    },
    {
      rowId: 3,
      order: '345678',
      date: '22.01.2022',
      user: 'Иванов А.Б',
      extraWork: 'Да',
      cabelType: 'ПЛС',
      resultType: 'Есть ТВ',
      result: 'Текстовое примечание',
    },
  ],
};
const state: State = reactive(initialState);
</script>

<style lang="sass" scoped></style>
