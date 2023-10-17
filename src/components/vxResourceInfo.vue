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
      :hide-pagination="true"
      style="margin: 10px"
    >
    </q-table>
  </q-card>
</template>

<script>
const columns = [
  {
    name: 'actions',
    label: 'Действие над ресурсом',
    field: 'action',
    align: 'center',
  },
  {
    name: 'spec',
    align: 'center',
    label: 'Спецификация',
    field: (row) => row.resource?.spec.nameRu,
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
    field: (row) => row.resource?.equipment.physicalContainerNumber,
    sortable: true,
  },
  {
    name: 'port',
    align: 'center',
    label: 'Порт',
    field: (row) => row.resource?.port.portNumber,
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
    return {
      columns,
    };
  },
  props: {
    choosenComponent: Array,
  },
};
</script>
