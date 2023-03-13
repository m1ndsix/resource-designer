<template>
  <q-card style="max-width: 650px">
    <q-card-section class="row">
      <div class="text-h6">Назначение Ресурса</div>
      <q-space />
      <q-btn icon="close" flat round dense v-close-popup />
    </q-card-section>
    <q-card-section>
      <q-tabs
        v-model="state.resourceTab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="new" label="Создать Новый" />
        <q-tab name="existing" label="Выбрать существующий" />
        <q-tab name="created" label="Созданные в проекте" />
      </q-tabs>
      <q-separator />

      <q-tab-panels v-model="state.resourceTab" animated>
        <q-tab-panel name="new">
          <q-select
            style="width: 250px"
            v-model="state.newResource.value.spec"
            @update:model-value="onNewResourceSelect"
            :options="orderStore.cprSpecs"
            option-label="nameRu"
            option-value="nameRu"
            label="Выбор Спецификации"
          />
          <div class="row">
            <div class="col">
              <q-select
                style="width: 250px"
                v-model="state.newResource.value.equipment"
                @update:model-value="onNewResourceSelect"
                :options="prepareStore.physicalContainers"
                :option-label="
                  (container) =>
                    container.specificationData.nameRu +
                    ' ' +
                    container.physicalContainerNumber
                "
                option-value="physicalContainerNumber"
                label="Выбор ФК"
              />
            </div>
            <div class="col">
              <q-select
                style="width: 250px"
                dense
                v-model="state.equipmentFilter"
                @update:model-value="onServiceAreaSelected"
                :options="state.equipmentFilterOptions"
                label="Зона поиска"
              />
              <div
                v-if="
                  state.equipmentFilter &&
                  state.equipmentFilter.value === 'address'
                "
              >
                <q-select
                  style="width: 250px"
                  use-input
                  input-debounce="0"
                  v-model="state.selectedStreet"
                  @update:model-value="onStreetSelected"
                  @filter="streetOptionsFilter"
                  :options="state.filteredStreets"
                  option-value="id"
                  option-label="nameRu"
                  dense
                  label="Улица"
                />
                <q-select
                  v-if="state.selectedStreet"
                  style="width: 250px"
                  v-model="state.selectedAddress"
                  @update:model-value="onAddressSelected"
                  :options="props.addresses"
                  option-value="id"
                  :option-label="makeAddressLabel"
                  dense
                  label="Адрес"
                />
              </div>
            </div>
          </div>
          <q-select
            style="width: 250px"
            v-model="state.newResource.value.port"
            @update:model-value="onNewResourceSelect"
            :options="prepareStore.mountedPorts"
            :option-label="(container) => 'Порт ' + container.portNumber"
            label="Выбор Порта"
          />
        </q-tab-panel>

        <q-tab-panel name="existing">
          <q-option-group
            v-if="!!props.existingResources"
            v-model="state.selectedExistingResource"
            :options="props.existingResources"
            color="primary"
          >
            <template v-slot:label="opt">
              <div class="column">
                <span class="text-bold">{{ opt.label }}</span>
                <span class="text-caption">{{ opt.value.lineData }}</span>
              </div>
            </template>
          </q-option-group>
          <div v-else>Нет данных</div>
        </q-tab-panel>

        <q-tab-panel name="created">
          <q-option-group
            v-if="!!props.createdResources"
            v-model="state.selectedCreatedResource"
            :options="props.createdResources"
            color="primary"
          />
          <div v-else>Нет данных</div>
        </q-tab-panel>
      </q-tab-panels>
    </q-card-section>

    <q-separator />

    <q-card-actions class="row" align="right">
      <q-btn
        label="Подготовить"
        type="submit"
        color="primary"
        :disable="
          (!state.newResource.value.equipment ||
            !state.newResource.value.port ||
            !state.newResource.value.spec) &&
          !state.selectedExistingResource &&
          !state.selectedCreatedResource
        "
        @click="onPrepareComponent"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { Resource } from './models';
import { useOrderStore } from 'stores/order';
import { usePrepareStore } from 'stores/prepare';

/*
  Props
*/

interface Props {
  existingResources: Resource[];
  createdResources: Resource[];
  streets: IdName[];
  addresses: Address[];
}
const props = withDefaults(defineProps<Props>(), {
  existingResources: () => [],
  createdResources: () => [],
  streets: () => [],
  addresses: () => [],
});

/*
  Store
*/
const orderStore = useOrderStore();
const prepareStore = usePrepareStore();

/*
  Emits
*/

const emit = defineEmits([
  'onServiceAreaSelected',
  'onAddNewResource',
  'onPrepareComponent',
  'onStreetSelected',
  'onAddressSelected',
]);

/*
  State
*/

interface State {
  resourceTab: string;
  selectedExistingResource: Resource | null;
  selectedCreatedResource: Resource | null;
  newResource: Resource;
  specs: string[];
  equipment: string[];
  ports: string[];
  equipmentFilter: EquipmentFilter | null;
  equipmentFilterOptions: EquipmentFilter[];
  selectedStreet: IdName | null;
  filteredStreets: IdName[];
  selectedAddress: Address | null;
}
interface EquipmentFilter {
  label: string;
  value: string;
}
interface IdName {
  id: number;
  nameKz: string;
  nameRu: string;
}
interface Address {
  id: number;
  house: number;
  subHouse: string | null;
}
const initialState: State = {
  resourceTab: 'new',
  selectedExistingResource: null,
  selectedCreatedResource: null,
  newResource: {
    label: null,
    value: {
      spec: null,
      equipment: null,
      port: null,
    },
  },
  equipmentFilter: null,
  equipmentFilterOptions: [
    { label: 'По всему дому', value: 'house' },
    { label: 'По подъезду', value: 'entrance' },
    { label: 'По пределу обслуживания', value: 'service' },
    { label: 'По адресу', value: 'address' },
    { label: 'По офисным пределам', value: 'office' },
  ],
  selectedStreet: null,
  filteredStreets: [],
};
const state: State = reactive(initialState);

/*
  Methods
*/

function resetNewResource() {
  state.newResource = {
    label: null,
    value: {
      spec: null,
      equipment: null,
      port: null,
    },
  };
}

function makeAddressLabel({ house, subHouse }) {
  if (subHouse) {
    return house + '/' + subHouse;
  } else {
    return house;
  }
}

function onServiceAreaSelected({ value }) {
  state.newResource.value.equipment = null;
  state.selectedStreet = null;
  state.selectedAddress = null;
  emit('onServiceAreaSelected', value);
}

function onStreetSelected({ id }) {
  state.newResource.value.equipment = null;
  state.selectedAddress = null;
  emit('onStreetSelected', id);
}

function onAddressSelected(address) {
  state.newResource.value.equipment = null;
  emit('onAddressSelected', address);
}

function streetOptionsFilter(val, update) {
  if (val === '') {
    update(() => {
      state.filteredStreets = props.streets;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    state.filteredStreets = props.streets.filter(
      (v) => v.nameRu.toLowerCase().indexOf(needle) > -1
    );
  });
}

function onNewResourceSelect(data) {
  state.selectedExistingResource = null;
  state.selectedCreatedResource = null;
  if (data.physicalContainerNumber) {
    //prepareStore.fetchMountedPorts(data.id, 1, 10, 0);
    prepareStore.fetchMountedPortsByParentPc(data.id);
  }
}

function onPrepareComponent() {
  if (state.resourceTab === 'new') {
    const newRes = state.newResource.value;
    state.newResource.label = `${newRes.spec.nameRu} | ${newRes.equipment.physicalContainerNumber} | ${newRes.port}`;
    const isResourceCreated =
      props.createdResources.findIndex((res) => {
        return res.label === state.newResource.label;
      }) > -1;
    if (!isResourceCreated) {
      emit('onAddNewResource', { ...state.newResource });
    }
    emit('onPrepareComponent', newRes);
    resetNewResource();
  } else if (state.resourceTab === 'created') {
    emit('onPrepareComponent', state.selectedCreatedResource);
  } else {
    emit('onPrepareComponent', state.selectedExistingResource);
  }
}
</script>

<style lang="sass" scoped></style>
