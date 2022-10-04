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
      <div class="col">
        <q-splitter v-model="splitterModel" style="height: 100vh">
          <template v-slot:before>
            <q-btn color="secondary">Назначить</q-btn>
            <q-tree
              ref="qtree"
              :nodes="prepareStore.positions"
              node-key="id"
              label-key="id"
              children-key="components"
              tick-strategy="leaf"
              v-model:selected="selected"
              @update:selected="onNodeSelected"
            >
              <template v-slot:default-header="prop">
                <div class="row items-center">
                  <div class="text-weight-bold text-primary">
                    {{ treeNodeHeader(prop.node) }}
                  </div>
                </div>
              </template>
              <template v-slot:default-body="prop">
                <span class="text-weight-bold">{{
                  treeNodeBody(prop.node)
                }}</span>
                <span
                  v-if="prop.node.poReqItemId"
                  style="display: block"
                  class="text-weight-bold"
                  >Адрес: ул. Абая, 1</span
                >
              </template>
            </q-tree>
          </template>
          <template v-slot:separator>
            <q-avatar
              color="primary"
              text-color="white"
              size="40px"
              icon="drag_indicator"
            />
          </template>
          <template v-slot:after>
            <q-btn color="negative">Отменить</q-btn>
            <q-list separator>
              <q-item clickable v-ripple>
                <q-item-section>
                  <q-item-label overline>Спецификация</q-item-label>
                  <q-item-label
                    >Прямая линия FTTH б/логина (1000776)</q-item-label
                  >
                </q-item-section>
              </q-item>

              <q-item clickable v-ripple>
                <q-item-section>
                  <q-item-label overline>Адрес</q-item-label>
                  <q-item-label>ул. Абая, 1</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable v-ripple>
                <q-item-section>
                  <q-item-label overline>Номер</q-item-label>
                  <q-item-label>87777777</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </template>
        </q-splitter>
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
    <q-dialog v-model="customPositionDialog">
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Линия</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
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
        </q-card-section>
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
      customPositionDialog: ref(false),
      shape: ref('ellipse'),
      splitterModel: ref(50),
      componentTab: ref(null),
      selected: ref(null),
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
    treeNodeHeader(node) {
      return node.poReqItemId
        ? `Компонент (ID): ${node.id}`
        : `Позиция (ID): ${node.id} | caSubscriptionId: ${node.caSubscriptionId}`;
    },
    treeNodeBody(node) {
      return node.poReqItemId
        ? `Тип: ${node.type.name_ru} | Статус: ${node.status}`
        : `Тип: ${node.type.name_ru}`;
    },
    onNodeSelected(v) {
      const node = this.$refs.qtree.getNodeByKey(v);
      if (node && node.poReqItemId) {
        this.customPositionDialog = true;
      } else {
        this.$refs.qtree.setExpanded(v, true);
      }
      this.selected = null;
    },
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
