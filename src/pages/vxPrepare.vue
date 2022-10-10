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
            <q-btn
              color="secondary"
              :disable="disableAppointBtn"
              @click="onAppoint()"
              >Назначить</q-btn
            >
            <q-tree
              ref="qtree"
              :nodes="prepareStore.positions"
              node-key="id"
              label-key="id"
              children-key="components"
              tick-strategy="leaf"
              v-model:ticked="tickedNodes"
              @update:ticked="onNodeTicked"
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
          <div class="text-h6">Новый ресурс создан!</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="customPositionDialog">
      <vx-resource-form
        :available-resources="[...prepareStore.availableResources]"
        @on-add-new-resource="onAddNewResource"
        @on-prepare-component="onPrepareComponent"
      />
    </q-dialog>
  </div>
</template>

<script>
import { ref } from 'vue';
import { usePrepareStore } from 'stores/prepare';
import VxResourceForm from '../components/vxResourceForm.vue';

export default {
  setup() {
    const prepareStore = usePrepareStore();
    return {
      alert: ref(false),
      customPositionDialog: ref(false),
      splitterModel: ref(50),
      tickedNodes: ref(null),
      prepareStore,
    };
  },
  components: {
    VxResourceForm,
  },
  data() {
    return {
      positionStatusMap: {},
    };
  },
  computed: {
    disableAppointBtn() {
      if (this.$refs.qtree) {
        return !this.$refs.qtree.getTickedNodes().length;
      }
      return false;
    },
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
    onNodeTicked(nodes) {
      this.prepareStore.selectedComponent = nodes;
    },
    onAppoint() {
      this.customPositionDialog = true;
      this.resetNewResource();
    },
    onAddNewResource(resource) {
      this.prepareStore.availableResources.push(resource);
      this.alert = true;
    },
    onPrepareComponent() {
      const tickedNodes = this.$refs.qtree.getTickedNodes();
      const componentsIds = tickedNodes
        .filter((node) => node.poReqItemId)
        .map((node) => node.id);
      const positionsIds = tickedNodes
        .filter((node) => node.poReqItemId)
        .map((node) => parseInt(node.poReqItemId));

      this.prepareStore.positions.forEach((pos) => {
        if (positionsIds.includes(pos.id)) {
          pos.components.forEach((comp) => {
            if (componentsIds.includes(comp.id)) {
              comp.status = 'Подготовлен';
            }
          });
        }
      });
      this.customPositionDialog = false;
    },
    resetNewResource() {
      this.prepareStore.newResource = {
        spec: null,
        equipment: null,
        port: null,
        name: null,
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
