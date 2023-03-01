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
                :options="orderStore.physicalContainers"
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
                @update:model-value="onNewResourceSelect"
                :options="state.equipmentFilterOptions"
                label="Зона поиска"
              />
            </div>
          </div>
          <q-select
            style="width: 250px"
            v-model="state.newResource.value.port"
            @update:model-value="onNewResourceSelect"
            :options="state.ports"
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
}
const props = withDefaults(defineProps<Props>(), {
  existingResources: () => [],
  createdResources: () => [],
});

/*
  Store
*/
const orderStore = useOrderStore();
const prepareStore = usePrepareStore();

/*
  Emits
*/

const emit = defineEmits(['onAddNewResource', 'onPrepareComponent']);

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
}
interface EquipmentFilter {
  label: string;
  value: string;
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
  specs: ['Прямая линия FTTH б/логина (1000776)', 'Прямая линия ETTH(1000784)'],
  equipment: [
    'ОРК 229/06/2/1',
    'ОРК 229/06/2/2',
    'ОРК 229/06/2/3',
    'ОРК 229/06/2/4',
    'ОРК 229/06/2/5',
    'ОРК 229/06/2/6',
  ],
  ports: ['Порт: 1', 'Порт: 2', 'Порт: 3', 'Порт: 4', 'Порт: 5'],
  equipmentFilter: null,
  equipmentFilterOptions: [
    { label: 'По всему дому', value: 'house' },
    { label: 'По подъезду', value: 'entrance' },
    { label: 'По пределу обслуживания', value: 'service' },
    { label: 'По адресу', value: 'address' },
    { label: 'По офисным пределам', value: 'office' },
  ],
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

function onNewResourceSelect(data) {
  console.log(data);
  state.selectedExistingResource = null;
  state.selectedCreatedResource = null;
  if (data.physicalContainerNumber) {
    prepareStore.fetchMountedPorts(data.id, 1, 10, 0);
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
