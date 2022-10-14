<template>
  <q-card>
    <q-card-section class="row">
      <div class="text-h6">Линия</div>
      <q-space />
      <q-btn icon="close" flat round dense v-close-popup />
    </q-card-section>
    <q-card-section>
      <q-select
        style="width: 250px"
        v-model="state.selectedAvailableResource"
        :options="props.availableResources"
        option-label="name"
        label="Доступные ресурсы"
      />
      <div v-if="state.selectedAvailableResource">
        <div class="selected-resource-info">
          <div class="row">
            <div class="col-auto">Спецификация:</div>
            <div class="col">
              {{ state.selectedAvailableResource.spec }}
            </div>
          </div>
          <div class="row">
            <div class="col-auto">ОРК:</div>
            <div class="col">
              {{ state.selectedAvailableResource.equipment }}
            </div>
          </div>
          <div class="row">
            <div class="col-auto">Порт:</div>
            <div class="col">
              {{ state.selectedAvailableResource.port }}
            </div>
          </div>
        </div>
      </div>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <q-expansion-item label="Новый ресурс">
        <q-select
          style="width: 250px"
          v-model="state.newResource.spec"
          :options="state.specs"
          label="Выбор Спецификации"
        />
        <div class="row">
          <div class="col">
            <q-select
              style="width: 250px"
              v-model="state.newResource.equipment"
              :options="state.equipment"
              label="Выбор ОРК"
            />
          </div>
          <div class="col">
            <q-radio
              v-model="state.equipmentSearchExtent"
              checked-icon="task_alt"
              unchecked-icon="panorama_fish_eye"
              val="building"
              label="По всему дому (По адресу)"
            />
            <q-radio
              v-model="state.equipmentSearchExtent"
              checked-icon="task_alt"
              unchecked-icon="panorama_fish_eye"
              val="entrance"
              label="по подъезду"
            />
            <q-radio
              v-model="state.equipmentSearchExtent"
              checked-icon="task_alt"
              unchecked-icon="panorama_fish_eye"
              val="usageLimit"
              label="по пределу обслуживания"
            />
          </div>
        </div>
        <div class="row flex-center">
          <div class="col">
            <q-select
              style="width: 250px"
              v-model="state.newResource.port"
              :options="state.ports"
              label="Выбор Порта"
            />
          </div>
          <div class="col-auto">
            <q-btn
              round
              size="sm"
              icon="add"
              color="primary"
              @click="onAddNewResource"
            >
              <q-tooltip>Создать новый ресурс</q-tooltip>
            </q-btn>
          </div>
        </div>
      </q-expansion-item>
    </q-card-section>

    <q-separator />

    <q-card-actions class="row" align="right">
      <q-btn
        label="Подготовить"
        type="submit"
        color="primary"
        :disable="!state.selectedAvailableResource"
        @click="onPrepareComponent"
      />
      <q-btn
        label="Отменить"
        disabled
        type="reset"
        color="negative"
        class="q-ml-sm"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { Resource } from './models';

/*
  Props
*/

interface Props {
  availableResources: Resource[];
}
const props = withDefaults(defineProps<Props>(), {
  availableResources: () => [],
});

/*
  Emits
*/

const emit = defineEmits(['onAddNewResource', 'onPrepareComponent']);

/*
  State
*/

interface State {
  selectedAvailableResource: Resource | null;
  newResource: Resource;
  specs: string[];
  equipment: string[];
  ports: string[];
  equipmentSearchExtent: string;
}
const initialState: State = {
  selectedAvailableResource: null,
  newResource: { name: null, spec: null, equipment: null, port: null },
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
  equipmentSearchExtent: 'usageLimit',
};
const state: State = reactive(initialState);

/*
  Computed
*/

// const disableToolTip = computed(() => {
//   return state.selectedAvailableResource
//     ? 'Подготовить'
//     : 'Выберите доступный ресурс';
// });

/*
  Methods
*/

function onAddNewResource() {
  state.newResource.name = `${state.newResource.equipment} | ${state.newResource.port}`;

  const isResourceAvailable =
    props.availableResources.findIndex((r) => {
      return r.name === state.newResource.name;
    }) > -1;
  if (isResourceAvailable) {
    // TODO: fix later
    console.log('Данный ресурс уже существует');
  } else {
    emit('onAddNewResource', { ...state.newResource });
    state.newResource = { name: null, spec: null, equipment: null, port: null };
  }
}

function onPrepareComponent() {
  emit('onPrepareComponent', state.selectedAvailableResource);
}
</script>

<style lang="sass" scoped>
.selected-resource-info
  .row
    .col-auto
      margin-right: 0.5em
      color: #666

    .col
      allign: left
      font-weight: 600
      color: #222
.col > .col
  display: flex
</style>
