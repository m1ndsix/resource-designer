<template>
  <q-card style="max-width: 1000px">
    <q-card-section class="row">
      <div class="text-h6">Редактирование позиции заказа</div>
      <q-space />
      <q-btn icon="close" flat round dense v-close-popup />
    </q-card-section>
    <q-table
      :rows="this.tickedComponents"
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
        <div class="text-h6">
          {{
            prepareStore.geoPlaceInfo.generalGeoAddress.generalGeoAddressNameRU
          }}
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

            <q-btn-group>
              <q-btn color="primary" glossy label="Проверка линии"></q-btn>
              <q-btn color="primary" outline label="ЛД" disabled>
                <q-tooltip>
                  {TOWN:727;STATION:272; MAN:ECI; OLT:4/00/08/01;ODF:2/03/08/13;
                  LD:ОРШ 272/07: 00/ODF-1/00/29, 00/ODF-5/00/118,
                  00/ODF-5/00/121, 00/ODF-1/00/138; ОРКсп 272/07/29/3:
                  00/00/1х8/7; OU:0;ONUPORTNUM:0; (DSL,IPTV,FXS); 6.518 км}
                </q-tooltip>
              </q-btn>
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
    label: 'Выбрать',
    field: (row) => row.selected,
    align: 'left',
  },
  { name: 'actions', label: 'Действие', field: 'action', align: 'center' },
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
    label: 'Физический контейнер',
    field: (row) => row.resource.equipment.physicalContainerNumber,
    sortable: true,
  },
  {
    name: 'port',
    align: 'center',
    label: 'Порт',
    field: (row) => row.resource.port.portNumber,
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
    tickedComponents: Object,
  },
  components: { vxMeasurement },

  computed: {
    cprResourceOrderItemIds: function () {
      return this.tickedComponents.map((c) => c.id);
    },
  },
  methods: {
    geoPlaceName() {
      return this.prepareStore.geoPlace;
    },
  },
};
</script>
