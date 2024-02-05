<template>
  <q-card style="max-width: 1200px">
    <q-card-section class="row">
      <div class="text-h6">Редактирование позиции заказа</div>
      <q-space />
      <q-btn icon="close" flat round dense v-close-popup />
    </q-card-section>
    <q-table
      dense
      :rows="prepareStore.preparedComponentsNew"
      :columns="columns"
      row-key="id"
      :loading="prepareStore.preparedTableLoading"
      selection="multiple"
      :selected-rows-label="selectedRowsLabel"
      :hide-pagination="true"
      :visible-columns="visibleColumns"
      v-model:selected="selectedRows"
      style="margin: 10px"
    >
      <template v-slot:loading>
        <q-inner-loading showing color="primary" />
      </template>
      <template v-slot:body-cell-actions="scope">
        <q-td>
          <div class="q-pa-sm q-gutter-sm">
            <q-btn
              color="primary"
              size="sm"
              label="Редакт."
              @click="editPositionItem(scope.row)"
            />

            <q-btn
              color="negative"
              size="sm"
              label="Отменить"
              @click="cancelPositionItem(scope.row)"
            />
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

import { ref } from 'vue';
import { usePrepareStore } from 'stores/prepare';
import { useOrderStore } from 'src/stores/order';
import vxMeasurement from './vxMeasurement.vue';
import { MP_API, PC_API } from 'boot/api';

export default {
  setup() {
    const prepareStore = usePrepareStore();
    const orderStore = useOrderStore();
    return {
      columns,
      openMeasurementDialog: ref(false),
      openResourceForm: ref(false),
      prepareStore,
      orderStore,
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
      this.orderStore.selectedOrder.cprResourceOrderPoReqItems.forEach(
        (element) => {
          element.compositePhysResId != -1
            ? MP_API.get('/mounted-port', {
                params: {
                  compositePhysResId: element.compositePhysResId,
                  limit: 1,
                  offset: 0,
                },
              }).then((mPortResult) => {
                if (mPortResult.data) {
                  element.portNumber = mPortResult.data[0].portNumber;
                  PC_API.get(
                    `/physical-container/${mPortResult.data[0].physicalContainerId}`
                  ).then(({ data }) => {
                    console.log('physCon', data);
                    element.physicalContainerNumber =
                      data.physicalContainerNumber;
                  });
                } else {
                  console.log('Порт не найден');
                }
              })
            : MP_API.get('/mounted-port', {
                params: {
                  cprResourceOrderItemId: element.id,
                  limit: 1,
                  offset: 0,
                },
              }).then((mPortResult) => {
                if (mPortResult.data) {
                  element.portNumber = mPortResult.data[0].portNumber;
                  PC_API.get(
                    `/physical-container/${mPortResult.data[0].physicalContainerId}`
                  ).then(({ data }) => {
                    console.log('physCon', data);
                    element.physicalContainerNumber =
                      data.physicalContainerNumber;
                  });
                } else {
                  console.log('Порт не найден');
                }
              });
        }
      );
      this.prepareStore.createdResources_2 = [];
      setTimeout(() => {
        this.orderStore.selectedOrder.cprResourceOrderPoReqItems.forEach(
          (element) => {
            console.log('!!!!element', element);
            const createdResource = {
              label:
                element.compositePhysResSpecData.nameRu +
                ' ' +
                element.physicalContainerNumber +
                ' Порт ' +
                element.portNumber,
              value: {
                id: element.id,
                compositePhysResId: element.compositePhysResId,
                compositePhysResNum: element.compositePhysResNum,
                compositePhysResFullNum: element.compositePhysResFullNum,
                compositePhysResSpecId: element.compositePhysResSpecData.id,
                physicalContainerId: element.physicalContainerId,
                transportCpeFuncSpecId: element.transportCpeFuncSpecData.id,
                wiringTypeId: element.wiringTypeData.id,
              },
            };

            this.prepareStore.createdResources_2.push(createdResource);
          }
        );
      }, 1500);
      console.log('editPositionItem');
      console.log(
        'this.prepareStore.createdResources_2',
        this.prepareStore.createdResources_2
      );
      this.$emit('onEditItem', row);
    },
    cancelPositionItem(row) {
      let unBookPort = true;

      this.prepareStore.preparedComponentsNew.forEach((element) => {
        if (
          (row.id != element.id &&
            row.resourceOrderItemId === element.resourceOrderItemId) ||
          (row.id != element.id &&
            row.compositePhysResId === element.compositePhysResId)
        ) {
          unBookPort = false;
        }
      });

      this.orderStore.patchWorkOrderItem(
        this.orderStore.selectedOrder.cprResourceOrderPoReqId,
        this.orderStore.selectedOrder.id,
        row.resourceOrderItemId,
        2,
        row.poReqItemId,
        row.id,
        unBookPort,
        row.compositePhysResId
      );
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
