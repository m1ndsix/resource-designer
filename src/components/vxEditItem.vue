<template>
  <q-card style="max-width: 1200px">
    <q-card-section class="row">
      <div class="text-h6">Редактирование позиции заказа</div>
      <q-space />
      <q-btn icon="close" flat round dense v-close-popup />
    </q-card-section>
    <q-table
      dense
      :rows="this.editComponents"
      :columns="columns"
      row-key="name"
      selection="none"
      :hide-pagination="true"
    >
      <template v-slot:body-cell-selection="scope">
        <q-td>
          <div class="q-pa-sm">
            <q-checkbox size="sm" v-model="scope.row.selected" />
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-actions="scope">
        <q-td>
          <div class="q-pa-sm q-gutter-sm">
            <q-btn
              v-model="scope.selected"
              color="primary"
              size="sm"
              label="Редакт."
            />

            <q-btn color="red" size="sm" label="Отменить" />
          </div>
        </q-td>
      </template>
      <template v-slot:top>
        <div class="text-h6">
          {{
            prepareStore.geoPlaceInfo.generalGeoAddress.generalGeoAddressNameRU
          }}
        </div>
        <q-space />
        <div class="q-pa-sm">
          <div class="row q-gutter-sm">
            <q-btn-group>
              <q-btn
                color="primary"
                glossy
                size="sm"
                label="Измеритель"
                @click="() => (openMeasurementDialog = true)"
              ></q-btn>
            </q-btn-group>
          </div>
        </div>
      </template>
    </q-table>
    <q-dialog v-model="openMeasurementDialog">
      <vx-measurement :cprResourceOrderItemIds="cprResourceOrderItemIds" />
    </q-dialog>
  </q-card>
</template>

<script>
const columns = [
  {
    name: 'selection',
    label: 'Выбор',
    field: (row) => row.selected,
    align: 'center',
  },
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

import { ref } from 'vue';
import { usePrepareStore } from 'stores/prepare';
import vxMeasurement from './vxMeasurement.vue';

export default {
  setup() {
    const prepareStore = usePrepareStore();
    return {
      openMeasurementDialog: ref(false),
      columns,
      prepareStore,
    };
  },
  props: {
    editComponents: Array,
  },
  components: { vxMeasurement },

  computed: {
    cprResourceOrderItemIds: function () {
      return this.editComponents.map((c) => c.id);
    },
  },
  methods: {
    geoPlaceName() {
      return this.prepareStore.geoPlace;
    },
  },
};
</script>
