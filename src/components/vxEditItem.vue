<template>
  <q-card style="max-width: 1200px">
    <q-card-section class="row">
      <div class="text-h6">Редактирование позиции заказа</div>
      <q-space />
      <q-btn icon="close" flat round dense v-close-popup />
    </q-card-section>
    <q-table
      dense
      :rows="this.preparedComponentsNew"
      :columns="columns"
      :row-key="(row) => row[0].id"
      selection="multiple"
      :selected-rows-label="selectedRowsLabel"
      :hide-pagination="true"
      :visible-columns="visibleColumns"
      v-model:selected="selectedRows"
      style="margin: 10px"
    >
      <template v-slot:body-cell-actions="scope">
        <q-td>
          <div class="q-pa-sm q-gutter-sm">
            <q-btn
              color="primary"
              size="sm"
              label="Редакт."
              @click="editPositionItem(scope.row)"
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
        <div class="q-pa-sm" v-if="isBulkComponentEdit">
          <div class="row q-gutter-sm">
            <q-btn-group>
              <q-btn
                color="primary"
                glossy
                size="sm"
                label="Измеритель"
                :disable="disableMeasurement"
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
    name: 'actions',
    label: 'Действие над ресурсом',
    field: 'action',
    align: 'center',
  },
  {
    name: 'spec',
    align: 'center',
    label: 'Спецификация',
    field: (row) => row[0].resource?.spec.nameRu,
    sortable: true,
  },
  {
    name: 'action',
    align: 'center',
    label: 'Действие',
    field: (row) => row[0].baseCfsActionSpecData.nameRu,
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
    field: (row) => row[0].resource?.equipment.physicalContainerNumber,
    sortable: true,
  },
  {
    name: 'port',
    align: 'center',
    label: 'Порт',
    field: (row) => row[0].resource?.port.portNumber,
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
      columns,
      openMeasurementDialog: ref(false),
      openResourceForm: ref(false),
      prepareStore,
      selectedRows: ref([]),
    };
  },
  props: {
    preparedComponentsNew: Array,
    isBulkComponentEdit: Boolean,
  },
  components: { vxMeasurement },

  computed: {
    disableMeasurement() {
      return !this.selectedRows.length;
    },
    visibleColumns() {
      return this.isBulkComponentEdit
        ? [
            'actions',
            'spec',
            'action',
            'pc',
            'port',
            'tts',
            'measurement-result',
          ]
        : ['spec', 'action', 'pc', 'port', 'tts', 'measurement-result'];
    },
    cprResourceOrderItemIds() {
      console.log('this.selectedRows', this.selectedRows);
      console.log(
        'this.selectedRows[0][0].resourceOrderItemId',
        this.selectedRows[0][0].resourceOrderItemId
      );
      console.log(
        'this.selectedRows.map((c) => ({cprResourceOrderItemId: c[0].resourceOrderItemId,}',
        this.selectedRows.map((c) => ({
          cprResourceOrderItemId: c[0].resourceOrderItemId,
        }))
      );
      return this.selectedRows.map((c) => ({
        cprResourceOrderItemId: c[0].resourceOrderItemId,
      }));
    },
  },
  methods: {
    editPositionItem(row) {
      this.$emit('onEditItem', row);
    },
    geoPlaceName() {
      return this.prepareStore.geoPlace;
    },
    selectedRowsLabel(rowsNumber) {
      return rowsNumber === 1
        ? '1 Позиция выбрана'
        : `${rowsNumber} Позиций выбрано`;
    },
  },
};
</script>
