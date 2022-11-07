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
            <q-btn color="secondary" label="Сохранить" />
            <q-btn color="red" label="Отменить" />
          </div>
        </q-td>
      </template>
      <template v-slot:top>
        <div class="text-h4">
          Позиция заказа по адресу ул. Желтоксан {{ item.geoPlaceId }}
        </div>
        <q-space />
        <div class="q-pa-md">
          <div class="row q-gutter-sm">
            <q-btn-group>
              <q-btn color="primary" glossy label="Обследователь"></q-btn>
              <q-btn color="primary" outline label="Есть ТВ" disabled></q-btn>
            </q-btn-group>

            <q-btn-group>
              <q-btn color="primary" glossy label="Измеритель"></q-btn>
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
  </div>
  <br />
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

import { defineComponent } from 'vue';
export default defineComponent({
  props: ['item'],
  setup(props) {
    //console.log('PROPS = ' + props);
    return {
      columns,
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
