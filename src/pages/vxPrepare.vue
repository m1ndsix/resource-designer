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
            {{ prepareStore.poRequest.poReqStatus.nameRu }}
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
      <div class="col info-section row flex-center">
        <div class="q-gutter-sm">
          <q-btn dense label="Подготовить" size="sm" color="secondary" />
          <q-btn dense label="Уточнить" size="sm" color="primary" />
          <q-btn dense label="Отменить" size="sm" color="negative" />
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <q-splitter v-model="splitterModel" style="height: 100vh">
          <template v-slot:before>
            <div class="row">
              <q-tree
                class="col"
                ref="qtree"
                node-key="nodeKey"
                tick-strategy="leaf"
                :nodes="prepareStore.dataTree"
                :filter="treeFilter"
                :filter-method="treeFilterMethod"
                v-model:ticked="tickedNodes"
                @update:ticked="onNodeTicked"
              >
                <template v-slot:default-header="prop">
                  <div class="row items-center">
                    <q-btn
                      v-if="prop.node.poReqItemId"
                      class="col q-mr-sm"
                      dense
                      size="sm"
                      color="secondary"
                      label="Проект"
                    />
                    <div class="text-weight-bold text-primary col-auto">
                      {{ prop.node.label }}
                    </div>
                    <div class="col-auto q-ml-sm">
                      <div
                        v-if="!prop.node.typeId"
                        class="row flex-center q-gutter-sm"
                      >
                        <q-checkbox
                          dense
                          label="Не назначенные"
                          v-model="treeFilter"
                        />
                        <q-btn
                          dense
                          size="sm"
                          color="secondary"
                          label="Назначить"
                          :disable="disableAppointBtn"
                          @click="onAppoint()"
                        />
                        <q-btn
                          dense
                          size="sm"
                          color="negative"
                          label="Отменить"
                        />
                        <q-btn dense size="sm">
                          <div class="row items-center no-wrap text-teal">
                            <div>Обследовать</div>
                            <q-separator vertical spaced />
                            <div style="margin-right: 5px">3</div>
                          </div>
                        </q-btn>
                        <q-btn
                          dense
                          no-caps
                          size="sm"
                          @click="() => (openResultTable = true)"
                        >
                          <div class="row items-center">
                            <div class="text-center text-teal">Есть ТВ</div>
                            <q-icon color="info" right name="info" />
                          </div>
                        </q-btn>
                      </div>

                      <div v-else class="row flex-center">
                        <q-chip
                          v-if="prop.node.typeId"
                          dense
                          text-color="white"
                          :color="positionTypeColor(prop.node.typeId)"
                        >
                          {{ positionTypeName(prop.node.typeId) }}
                        </q-chip>
                        <span class="text-negative">{{
                          prop.node.oldProductOfferName
                            ? prop.node.oldProductOfferName
                            : prop.node.oldNumber
                        }}</span>
                        <span
                          v-if="
                            prop.node.oldProductOfferName || prop.node.oldNumber
                          "
                          ><q-icon name="arrow_right_alt"
                        /></span>
                        <span class="text-positive">
                          {{
                            prop.node.newProductOfferName
                              ? prop.node.newProductOfferName
                              : prop.node.newNumber
                          }}</span
                        >
                      </div>
                    </div>
                  </div>
                </template>
                <!-- <template v-slot:default-body="prop">
                  <q-chip
                    v-if="prop.node.state"
                    dense
                    :color="prop.node.state === 'Новый' ? 'orange' : 'green'"
                    text-color="white"
                  >
                    {{ prop.node.state }}
                  </q-chip>
                </template> -->
              </q-tree>
            </div>
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
            <q-list separator>
              <q-expansion-item
                v-for="address in prepareStore.dataTree"
                :key="address.nodeKey"
                :label="address.label"
              >
                <q-expansion-item
                  v-for="pos in filterPositions(address.children)"
                  :key="pos.nodeKey"
                  :label="pos.label"
                  :header-inset-level="1"
                >
                  <q-table
                    hide-bottom
                    :rows="filterComponents(pos.children)"
                    :columns="voixPositionsCols"
                    row-key="id"
                  >
                    <template v-slot:body-cell-action="scope">
                      <q-td>
                        <q-btn
                          icon="close"
                          flat
                          round
                          dense
                          v-model="scope.selected"
                          color="negative"
                        />
                      </q-td>
                    </template>
                  </q-table>
                </q-expansion-item>
              </q-expansion-item>
            </q-list>
          </template>
        </q-splitter>
      </div>
    </div>
    <q-dialog v-model="openResourceForm">
      <vx-resource-form
        :created-resources="prepareStore.createdResources"
        :existing-resources="prepareStore.existingResources"
        @on-add-new-resource="onAddNewResource"
        @on-prepare-component="onPrepareComponent"
      />
    </q-dialog>
    <q-dialog v-model="openResultTable">
      <vx-result-table
        :created-resources="prepareStore.createdResources"
        :existing-resources="prepareStore.existingResources"
        @on-add-new-resource="onAddNewResource"
        @on-prepare-component="onPrepareComponent"
      />
    </q-dialog>
  </div>
</template>

<script>
import { ref } from 'vue';
import { usePrepareStore } from 'stores/prepare';
import { useOrderStore } from 'src/stores/order';
import vxResourceForm from '../components/vxResourceForm.vue';
import vxResultTable from '../components/vxResultTable.vue';

export default {
  setup() {
    const prepareStore = usePrepareStore();
    const orderStore = useOrderStore();
    return {
      treeFilter: ref(false),
      openResourceForm: ref(false),
      openResultTable: ref(false),
      splitterModel: ref(70),
      showAppointed: ref(false),
      tickedNodes: ref(null),
      prepareStore,
      orderStore,
      voixPositionsCols: [
        { name: 'action', field: 'action', align: 'left' },
        {
          name: 'id',
          label: 'ID компонента',
          align: 'left',
          field: (row) => row.id,
          sortable: true,
        },
        {
          name: 'spec',
          label: 'Спецификация',
          align: 'left',
          field: (row) => row.resource.spec,
          sortable: true,
        },
        {
          name: 'equipment',
          required: true,
          label: 'Оборудование',
          align: 'left',
          field: (row) => row.resource.equipment,
          sortable: true,
        },
        {
          name: 'port',
          label: 'Порт',
          align: 'left',
          field: (row) => row.resource.port,
          sortable: true,
        },
      ],
    };
  },
  components: {
    vxResourceForm,
    vxResultTable,
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
    treeFilterMethod(node, onlyAppointed) {
      if (onlyAppointed) {
        return node.state === 'Новый';
      } else {
        return true;
      }
    },
    filterPositions(positions) {
      return positions.filter(
        (pos) => pos.children.findIndex((comp) => !!comp.resource) > -1
      );
    },
    filterComponents(components) {
      return components.filter((comp) => !!comp.resource);
    },
    positionTypeColor(typeId) {
      let color;
      switch (typeId) {
        case 1:
          color = 'blue';
          break;
        case 2:
          color = 'orange';
          break;
        case 3:
          color = 'red';
      }
      return color;
    },
    positionTypeName(typeId) {
      let name;
      switch (typeId) {
        case 1:
          name = 'Установка';
          break;
        case 2:
          name = 'Замена';
          break;
        case 3:
          name = 'Снятие';
      }
      return name;
    },
    onNodeTicked(nodes) {
      this.prepareStore.selectedComponent = nodes;
    },
    onAppoint() {
      this.openResourceForm = true;
    },
    onAddNewResource(resource) {
      this.prepareStore.createdResources.push(resource);
    },
    onPrepareComponent(resource) {
      console.log(resource);
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
    .col:first-child
      padding-left: 0.25em
      color: #666

    .col:last-child
      padding-right: 0.5em
      font-weight: 600
      color: #222
</style>
