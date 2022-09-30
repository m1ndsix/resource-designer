<template>
  <div>
    <div class="row header">
      <div class="col info-section">
        <div class="row">
          <div class="col">Номер(id):</div>
          <div class="col">19593</div>
        </div>
        <div class="row">
          <div class="col">Статус:</div>
          <div class="col">Новый</div>
        </div>
        <div class="row">
          <div class="col">partyId:</div>
          <div class="col">809185</div>
        </div>
      </div>
      <div class="col info-section">
        <div class="row">
          <div class="col">commChannelId:</div>
          <div class="col">5</div>
        </div>
        <div class="row">
          <div class="col">divisionId:</div>
          <div class="col">1</div>
        </div>
        <div class="row">
          <div class="col">salesChannelId:</div>
          <div class="col">105</div>
        </div>
      </div>
      <div class="col info-section">
        <div class="row">
          <div class="col">Идент. номер:</div>
          <div class="col">900408400706</div>
        </div>
        <div class="row">
          <div class="col">Конт. тел.:</div>
          <div class="col">7777777777</div>
        </div>
        <div class="row">
          <div class="col">ФИО/Наименование:</div>
          <div class="col">test</div>
        </div>
      </div>
      <div class="col info-section">
        <div class="row">
          <div class="col">externalId:</div>
          <div class="col">l77czzl2</div>
        </div>
        <div class="row">
          <div class="col">Description:</div>
          <div class="col">qwerty</div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-auto" style="height: 100vh">
        <q-list v-for="pos in prepareStore.positions" :key="pos.id">
          <q-expansion-item
            group="positions"
            expand-separator
            :label="
              'Позиция ID: ' +
              pos.id +
              ' | caSubscriptionId: ' +
              pos.caSubscriptionId
            "
            :caption="'Тип: ' + pos.type.name_ru"
            @click="onChangePosition(pos)"
          >
            <q-tabs
              v-model="componentTab"
              vertical
              class="text-primary"
              v-for="com in prepareStore.components"
              :key="com.id"
            >
              <q-tab
                :name="com.id"
                :label="'Компонент (ID): ' + com.id"
                @click="onChangeComponent(com)"
              >
                <div
                  style="
                    font-size: 0.75rem;
                    text-transform: none;
                    color: rgba(0, 0, 0, 0.54);
                  "
                >
                  Тип: {{ com.type.name_ru }} | Статус: {{ com.status }}
                </div>
              </q-tab>
            </q-tabs>
          </q-expansion-item>
        </q-list>
      </div>
      <q-separator vertical />
      <div class="col">
        <q-tab-panels
          v-model="componentTab"
          animated
          swipeable
          vertical
          transition-prev="jump-up"
          transition-next="jump-up"
        >
          <q-tab-panel
            v-for="com in prepareStore.components"
            :name="com.id"
            :key="com.id"
          >
            <q-form>
              <div class="row flex-center">
                <div class="col-auto">
                  <q-btn
                    round
                    size="sm"
                    icon="add"
                    color="primary"
                    title="Новая Позиция"
                    @click="onAddNewCustomPosition"
                  />
                </div>
                <div class="col q-ml-sm">
                  <q-select
                    style="width: 250px"
                    v-model="prepareStore.selectedCustomPosition"
                    :options="prepareStore.customPositions"
                    option-label="id"
                    label="Доступные позиции"
                  />
                </div>
              </div>
              <q-select
                style="width: 250px"
                v-model="prepareStore.selectedCustomPosition.spec"
                :options="specs"
                label="Выбор Спецификации"
              />
              <div class="row">
                <div class="col-auto">
                  <q-select
                    style="width: 250px"
                    v-model="prepareStore.selectedCustomPosition.equipment"
                    :options="equipment"
                    label="Выбор ОРК"
                  />
                </div>
                <div class="col">
                  <q-radio
                    v-model="shape"
                    checked-icon="task_alt"
                    unchecked-icon="panorama_fish_eye"
                    val="line"
                    label="По всему дому (По адресу)"
                  />
                  <q-radio
                    v-model="shape"
                    checked-icon="task_alt"
                    unchecked-icon="panorama_fish_eye"
                    val="rectangle"
                    label="по подъезду"
                  />
                  <q-radio
                    v-model="shape"
                    checked-icon="task_alt"
                    unchecked-icon="panorama_fish_eye"
                    val="ellipse"
                    label="по пределу обслуживания"
                  />
                </div>
              </div>
              <div class="row flex-center">
                <div class="col-auto">
                  <q-select
                    style="width: 250px"
                    v-model="prepareStore.selectedCustomPosition.port"
                    :options="ports"
                    label="Выбор Порта"
                  />
                </div>
                <q-space />
                <div class="col-auto">
                  <q-btn
                    label="Подготовить"
                    type="submit"
                    color="primary"
                    @click="onPreparePosition"
                  />
                </div>
                <div class="col-auto">
                  <q-btn
                    label="Отменить"
                    disabled
                    type="reset"
                    color="negative"
                    class="q-ml-sm"
                  />
                </div>
              </div>
            </q-form>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
    <q-btn style="position: fixed; bottom: 10px; right: 10px" color="primary"
      >Далее</q-btn
    >
    <q-dialog v-model="alert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Новая позиция создана!</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref } from 'vue';
import { usePrepareStore } from 'stores/prepare';

export default {
  setup() {
    const prepareStore = usePrepareStore();
    return {
      alert: ref(false),
      shape: ref('ellipse'),
      componentTab: ref(null),
      prepareStore,
    };
  },
  data() {
    return {
      counter: 0, // TODO: remove later
      specs: [
        'Прямая линия FTTH б/логина (1000776)',
        'Прямая линия ETTH(1000784)',
      ],
      equipment: [
        'ОРК 229/06/2/1',
        'ОРК 229/06/2/2',
        'ОРК 229/06/2/3',
        'ОРК 229/06/2/4',
        'ОРК 229/06/2/5',
        'ОРК 229/06/2/6',
      ],
      ports: ['Порт: 1', 'Порт: 2', 'Порт: 3', 'Порт: 4', 'Порт: 5'],
      positionStatusMap: {},
    };
  },
  methods: {
    onChangePosition(position) {
      this.prepareStore.selectedPosition = position;
      this.resetCustomPosition();
    },
    onChangeComponent(component) {
      this.prepareStore.selectedComponent = component;
      this.resetCustomPosition();
    },
    onAddNewCustomPosition() {
      this.counter++;
      let cusPos = { ...this.prepareStore.selectedCustomPosition };
      cusPos.id = this.counter;

      this.prepareStore.customPositions.push(cusPos);
      this.alert = true;
    },
    onPreparePosition() {
      this.prepareStore.selectedComponent.status = 'Подготовлен';
    },
    resetCustomPosition() {
      this.prepareStore.selectedCustomPosition = {
        spec: '',
        equipment: '',
        port: '',
        id: '',
      };
    },
  },
};
</script>

<style lang="sass" scoped>
.header > .info-section
  padding: 5px
  background: #FFFEF4
  border-bottom: 1px solid #BCB8B8
  border-right: 1px solid #BCB8B8

  .row
    margin: 0

    .col:first-child
      padding-left: 0.25em
      color: #666

    .col:last-child
      padding-right: 0.5em
      font-weight: 600
      color: #222
.col > .col
  display: flex
</style>
