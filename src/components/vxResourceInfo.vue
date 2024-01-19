<template>
  <q-card style="max-width: 1200px">
    <q-card-section class="row">
      <div class="text-h6">Информация ресурса по компоненту</div>
      <q-space />
      <q-btn icon="close" flat round dense v-close-popup />
    </q-card-section>
    <q-table
      dense
      :rows="this.choosenComponent"
      :columns="columns"
      row-key="id"
      :loading="this.prepareStore.infoTableLoading"
      :hide-pagination="true"
      style="margin: 10px"
    >
      <template v-slot:loading>
        <q-inner-loading showing color="primary" />
      </template>
    </q-table>
  </q-card>
</template>

<script>
import { usePrepareStore } from 'stores/prepare';

const columns = [
  {
    name: 'actions',
    label: 'Действие над ресурсом',
    field: (row) => row.baseCfsActionSpecData.nameRu,
    align: 'center',
  },
  {
    name: 'spec',
    align: 'center',
    label: 'Спецификация',
    field: (row) => row.poComponentData.nameRu,
    sortable: true,
  },
  {
    name: 'action',
    align: 'center',
    label: 'Действие',
    field: (row) => row.baseCfsActionSpecData.nameRu,
    sortable: true,
  },
  {
    name: 'state',
    align: 'center',
    label: 'Состояние',
    field: 'state',
    sortable: true,
  },
  {
    name: 'pc',
    align: 'center',
    label: 'Физ. контейнер',
    field: 'physicalContainerNumber',
    sortable: true,
  },
  {
    name: 'port',
    align: 'center',
    label: 'Порт',
    field: 'portNumber',
    sortable: true,
  },
  {
    name: 'tts',
    align: 'center',
    label: 'Функц. спец. терм. оборудования',
    field: 'transportCpeFuncSpecId',
    sortable: true,
  },
  {
    name: 'measurement-result',
    align: 'center',
    label: 'Результат измерения',
    field: 'measurementResult',
    sortable: true,
  },
];

export default {
  setup() {
    const prepareStore = usePrepareStore();
    return {
      columns,
      prepareStore,
    };
  },
  props: {
    choosenComponent: Array,
  },
};
</script>
