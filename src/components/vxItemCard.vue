<template>
  <div v-for="pos in itemPositions" v-bind:key="pos.key">
    <q-table
      title="Редактирование позиции заказа"
      :rows="pos.components"
      :columns="columns"
      row-key="name"
      selection="none"
      :hide-pagination="true"
    >
      <template v-slot:body-cell-selection="scope">
        <q-td>
          <div class="q-pa-md">
            <q-checkbox v-model="scope.row.selected" />
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-actions="scope">
        <q-td>
          <div class="q-pa-md q-gutter-sm">
            <q-btn
              v-model="scope.selected"
              color="primary"
              label="Редактировать"
            />

            <q-btn color="red" label="Отменить" />
          </div>
        </q-td>
      </template>
      <template v-slot:top>
        <div class="text-h4">
          г. Алматы, ул. Абылай хана {{ pos.components[0].geoPlaceId }}
        </div>
        <q-space />
        <div class="q-pa-md">
          <div class="row q-gutter-sm">
            <q-btn-group>
              <q-btn
                color="primary"
                glossy
                label="Измеритель"
                @click="() => (openMeasurementDialog = true)"
              ></q-btn>
            </q-btn-group>
          </div>
        </div>
      </template>
    </q-table>
  </div>
  <br />
  <q-dialog v-model="openMeasurementDialog">
    <vx-measurement />
  </q-dialog>
</template>

<script>
const columns = [
  {
    name: 'selection',
    label: 'Выбрать',
    field: (row) => row.selected,
    align: 'left',
  },
  { name: 'actions', label: 'Действие', field: 'action', align: 'center' },
  {
    name: 'spec',
    align: 'center',
    label: 'Спецификация',
    field: 'compositePhysResSpecId',
    sortable: true,
  },
  {
    name: 'action',
    align: 'center',
    label: 'Действие',
    field: (row) => row.actionData.name,
    sortable: true,
  },
  {
    name: 'state',
    align: 'center',
    label: 'Состояние',
    field: (row) => row.stateData.name,
    sortable: true,
  },
  {
    name: 'pc',
    align: 'center',
    label: 'Физический контейнер',
    field: 'physicalContainerId',
    sortable: true,
  },
  {
    name: 'port',
    align: 'center',
    label: 'Порт',
    field: 'portnumber', //calculated
    sortable: true,
  },
  {
    name: 'tts',
    align: 'center',
    label: 'Транспортная спецификация',
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

import { defineComponent, ref } from 'vue';
import vxMeasurement from '../components/vxMeasurement.vue';
export default defineComponent({
  components: { vxMeasurement },
  props: ['item'],
  setup(props) {
    //console.log('PROPS = ' + props);
    return {
      columns,
      openMeasurementDialog: ref(false),
    };
  },
  computed: {
    itemPositions: function () {
      //console.log('props comp ' + this.item);
      return [this.item];
    },
  },
});
</script>
