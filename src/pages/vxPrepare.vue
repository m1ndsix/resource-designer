<template>
  <div>
    <div v-if="prepareStore.poRequest" class="row header">
      <div class="col info-section">
        <div class="row">
          <div class="col">ID Коммуникации:</div>
          <div class="col">{{ prepareStore.poRequest.id }}</div>
        </div>
        <div class="row">
          <div class="col">Статус:</div>
          <div class="col">
            {{ prepareStore.poRequest.poReqStatus.name_ru }}
          </div>
        </div>
        <div class="row">
          <div class="col">ID Участника:</div>
          <div class="col">{{ prepareStore.poRequest.partyId }}</div>
        </div>
      </div>
      <div class="col info-section">
        <div class="row">
          <div class="col">Адрес Коммуникации:</div>
          <div class="col">{{ prepareStore.poRequest.commChannelId }}</div>
        </div>
        <div class="row">
          <div class="col">ID Дивизиона:</div>
          <div class="col">{{ prepareStore.poRequest.divisionId }}</div>
        </div>
        <div class="row">
          <div class="col">ID Отдела Продаж:</div>
          <div class="col">{{ prepareStore.poRequest.salesChannelId }}</div>
        </div>
      </div>
      <div class="col info-section">
        <div class="row">
          <div class="col">Идент. номер:</div>
          <div class="col">
            {{ prepareStore.poRequest.identificationNumber }}
          </div>
        </div>
        <div class="row">
          <div class="col">Конт. тел.:</div>
          <div class="col">{{ prepareStore.poRequest.contactNumber }}</div>
        </div>
        <div class="row">
          <div class="col">ФИО/Наименование:</div>
          <div class="col">{{ prepareStore.poRequest.contactName }}</div>
        </div>
      </div>
      <div class="col info-section">
        <div class="row">
          <div class="col">Внешний ID:</div>
          <div class="col">{{ prepareStore.poRequest.externalId }}</div>
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
              :nodes="prepareStore.dataTree"
              node-key="nodeKey"
              tick-strategy="leaf"
              v-model:ticked="tickedNodes"
              @update:ticked="onNodeTicked"
            >
              <template v-slot:default-header="prop">
                <div class="row items-center">
                  <div class="text-weight-bold text-primary">
                    {{ prop.node.label }}
                  </div>
                </div>
              </template>
              <template v-slot:default-body="prop">
                <q-chip
                  v-if="prop.node.type && prop.node.type.nameRu"
                  dense
                  color="blue"
                  text-color="white"
                >
                  {{ prop.node.type.nameRu }}
                </q-chip>
                <q-chip
                  v-if="prop.node.state"
                  dense
                  :color="prop.node.state === 'Новый' ? 'orange' : 'green'"
                  text-color="white"
                >
                  {{ prop.node.state }}
                </q-chip>
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
              <q-expansion-item
                v-for="address in prepareStore.dataTree"
                :key="address.nodeKey"
                :label="'Геоместорасположение (ID): ' + address.nodeKey"
              >
                <q-expansion-item
                  v-for="pos in filterPositions(address.children)"
                  :key="pos.nodeKey"
                  :label="'Позиция: ' + pos.id.toString()"
                  :header-inset-level="1"
                >
                  <q-table
                    hide-bottom
                    :rows="filterComponents(pos.children)"
                    :columns="voixPositionsCols"
                    row-key="id"
                  >
                  </q-table>
                </q-expansion-item>
              </q-expansion-item>
            </q-list>
          </template>
        </q-splitter>
      </div>
    </div>
    <q-btn style="position: fixed; bottom: 10px; right: 10px" color="primary"
      >Далее</q-btn
    >
    <q-dialog v-model="openResourceForm">
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
import { useOrderStore } from 'src/stores/order';

export default {
  setup() {
    const prepareStore = usePrepareStore();
    const orderStore = useOrderStore();

    return {
      openResourceForm: ref(false),
      splitterModel: ref(50),
      tickedNodes: ref(null),
      prepareStore,
      orderStore,
      voixPositionsCols: [
        {
          name: 'id',
          required: true,
          label: 'ID компонента',
          align: 'left',
          field: (row) => row.id,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: 'spec',
          required: true,
          label: 'Спецификация',
          align: 'left',
          field: (row) => row.resource.spec,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: 'equipment',
          required: true,
          label: 'Оборудование',
          align: 'left',
          field: (row) => row.resource.equipment,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: 'port',
          required: true,
          label: 'Порт',
          align: 'left',
          field: (row) => row.resource.port,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: 'address',
          required: true,
          label: 'Адрес',
          align: 'left',
          field: (row) => 'ул. Абая, 1/б',
          format: (val) => `${val}`,
          sortable: true,
        },
      ],
    };
  },
  components: {
    VxResourceForm,
  },
  mounted() {
    this.prepareStore.fetchPORequest(
      this.orderStore.selectedOrder.productOfferRequestId
    );
    this.prepareStore.fetchPositions(
      this.orderStore.selectedOrder.productOfferRequestId
    );
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
    filterPositions(positions) {
      return positions.filter(
        (pos) => pos.children.findIndex((comp) => !!comp.resource) > -1
      );
    },
    filterComponents(components) {
      return components.filter((comp) => !!comp.resource);
    },
    onNodeTicked(nodes) {
      this.prepareStore.selectedComponent = nodes;
    },
    onAppoint() {
      this.openResourceForm = true;
    },
    onAddNewResource(resource) {
      this.prepareStore.availableResources.push(resource);
    },
    onPrepareComponent(resource) {
      const tickedNodes = this.$refs.qtree.getTickedNodes();
      const componentsIds = tickedNodes.map((node) => node.id);
      const positionsIds = tickedNodes.map((node) => node.poReqItemId);

      this.prepareStore.dataTree.forEach((address) => {
        address.children.forEach((pos) => {
          if (positionsIds.includes(pos.id)) {
            pos.children.forEach((comp) => {
              if (componentsIds.includes(comp.id)) {
                comp.state = 'Подготовлен';
                comp.resource = resource;
              }
            });
          }
        });
      });
      this.openResourceForm = false;
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
