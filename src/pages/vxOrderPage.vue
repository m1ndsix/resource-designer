<template>
  <ag-grid-vue
    class="ag-theme-alpine"
    style="height: 700px"
    :columnDefs="columnDefs.value"
    :rowData="rowData.value"
    :defaultColDef="defaultColDef"
    rowSelection="multiple"
    animateRows="true"
    @cell-clicked="cellWasClicked"
    @grid-ready="onGridReady"
  >
  </ag-grid-vue>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue3';
import { reactive, onMounted, ref } from 'vue';
import { CPR_RO_API } from 'boot/api';
import { useOrderStore } from 'stores/order';
import { useRouter } from 'vue-router';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

export default {
  name: 'App',
  components: {
    AgGridVue,
  },
  setup() {
    const orderStore = useOrderStore();
    const router = useRouter();
    const gridApi = ref(null);
    const rowData = reactive({});
    const onGridReady = (params) => {
      gridApi.value = params.api;
    };

    const columnDefs = reactive({
      value: [
        { headerName: '№ Поручения', field: 'id' },
        {
          headerName: '№ Запроса на ПП',
          field: 'productOfferRequestId',
        },
        {
          headerName: 'ФИО',
          field: 'contactName',
          minWidth: 250,
        },
        {
          headerName: 'Адрес',
          field: 'geoPlace.nameRu',
          minWidth: 350,
        },
        {
          headerName: 'Состояние',
          field: 'stateData.nameRu',
        },
        {
          field: 'createDate',
          headerName: 'Создан',
          cellClass: 'dateLong',
          floatingFilter: true,
          valueFormatter: (params) => {
            var createDate = new Date(params.value);
            var day = createDate.getDate().toString().padStart(2, '0');
            var month = (createDate.getMonth() + 1).toString().padStart(2, '0');
            var year = createDate.getFullYear().toString();
            var hour = createDate.getHours().toString().padStart(2, '0');
            var min = createDate.getMinutes().toString().padStart(2, '0');
            var sec = createDate.getSeconds().toString().padStart(2, '0');
            return (
              day +
              '/' +
              month +
              '/' +
              year +
              ' ' +
              hour +
              ':' +
              min +
              ':' +
              sec
            );
          },
        },
        {
          headerName: 'Исполнитель',
          field: 'createUser',
        },
      ],
    });

    const defaultColDef = {
      sortable: true,
      filter: true,
      flex: 1,
      resizable: true,
      floatingFilter: true,
    };

    const excelStyles = [
      {
        id: 'dateLong',
        dataType: 'DateTime',
        numberFormat: {
          format: 'dd/mm/yyy h:mm:ss AM/PM',
        },
      },
    ];

    onMounted(() => {
      CPR_RO_API.get(
        '/cpr-resource-order-po-req/work-order?limit=10&offset=0'
      ).then(({ data }) => {
        if (data && data.length > 0) {
          rowData.value = data;
        }
      });
    });

    return {
      onGridReady,
      columnDefs,
      rowData,
      defaultColDef,
      excelStyles,
      cellWasClicked: (event) => {
        orderStore.selectedOrder = { ...event.data };
        orderStore.patchWorkOrder(
          event.data.cprResourceOrderPoReqId,
          event.data.id,
          2
        );
        router.push('/prepare');
      },
    };
  },
};
</script>

<style lang="scss"></style>
