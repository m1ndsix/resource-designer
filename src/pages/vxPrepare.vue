<template>
  <div>
    <div v-if="prepareStore.poRequest" class="row header">
      <div class="col info-section">
        <div class="row">
          <div class="col">Номер заказа:</div>
          <div class="col">{{ prepareStore.poRequest.id }}</div>
        </div>
        <div class="row">
          <div class="col">Состояние:</div>
          <div class="col">Новый</div>
        </div>
        <div class="row">
          <div class="col">Клиент:</div>
          <div class="col">{{ prepareStore.poRequest.partyId }}</div>
        </div>
      </div>
      <div class="col info-section">
        <div class="row">
          <div class="col">Единица предприятия:</div>
          <div class="col">{{ prepareStore.poRequest.divisionId }}</div>
        </div>
        <div class="row">
          <div class="col">Канал Продаж:</div>
          <div class="col">{{ prepareStore.poRequest.salesChannelId }}</div>
        </div>
      </div>
      <div class="col info-section">
        <div class="row">
          <div class="col">Конт. тел.:</div>
          <div class="col">{{ prepareStore.poRequest.mobilePhoneNumber }}</div>
        </div>
        <div class="row">
          <div class="col">ФИО/Наименование:</div>
          <div class="col">{{ prepareStore.poRequest.contactName }}</div>
        </div>
      </div>
      <div class="col info-section row flex-center">
        <div class="q-gutter-sm">
          <q-btn
            dense
            label="Завершить Поручение"
            size="sm"
            color="secondary"
            @click="onCompleteWorkOrder"
          />
          <q-btn
            dense
            label="Вернуться к Списку"
            size="sm"
            color="primary"
            @click="onRouteToOrderPage"
          />
        </div>
      </div>
    </div>

    <div class="row">
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
                v-if="prop.node.typeId"
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
                  v-if="prop.node.nodeType === 'address'"
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
                    :disable="disableAppointBtn()"
                    @click="onAppoint"
                  />
                  <q-btn
                    dense
                    size="sm"
                    color="dark"
                    label="Отказать"
                    @click="rejectProductOfferRequestItem(prop.node)"
                  />
                  <q-btn dense size="sm" color="negative" label="Отменить" />
                  <q-btn
                    dense
                    size="sm"
                    @click="() => (openInspectionDialog = true)"
                  >
                    <div class="row items-center no-wrap text-teal">
                      <div>Обследовать</div>
                    </div>
                  </q-btn>
                  <q-btn
                    dense
                    no-caps
                    size="sm"
                    @click="() => (openResultTable = true)"
                  >
                    <div class="row items-center">
                      <div class="text-center text-teal">
                        {{ lastTechInspectionResultType }}
                      </div>
                      <q-separator vertical spaced />
                      <div
                        style="margin-right: 5px"
                        title="Количество обследований"
                      >
                        {{ techInspectionsCount }}
                      </div>
                    </div>
                  </q-btn>
                  <q-btn
                    style="margin-left: 5px"
                    size="sm"
                    round
                    dense
                    color="info"
                    icon="info"
                    @click="(event) => onOpenEditItemDialog(event, prop.node)"
                  />
                </div>

                <div
                  v-if="
                    prop.node.nodeType === 'position' ||
                    prop.node.nodeType === 'component'
                  "
                  class="row flex-center"
                >
                  <!-- Action -->
                  <q-chip
                    dense
                    text-color="white"
                    :color="colorizeActionChip(prop.node)"
                  >
                    {{ nameActionChip(prop.node) }}
                  </q-chip>
                  <!-- Name -->
                  <div v-if="prop.node.nodeType === 'position'">
                    <span class="text-negative">{{ oldName(prop.node) }}</span>
                    <span v-if="showUpdateArrow(prop.node)"
                      ><q-icon name="arrow_right_alt"
                    /></span>
                    <span class="text-positive"> {{ newName(prop.node) }}</span>
                  </div>

                  <!-- Component -->
                  <div
                    v-if="prop.node.nodeType === 'component'"
                    class="row items-center"
                  >
                    <pre><b>Сервис:</b> <span>{{ serviceName(prop.node) + ' | ' }}</span><b>Продукт:</b> </pre>
                    <q-select
                      v-if="isProductSpecsMultiple(prop.node)"
                      dense
                      label="Продукт"
                      v-model="selectedProduct"
                      :options="prop.node.productSpecificationData"
                      option-label="nameRu"
                    />
                    <span v-else>{{ productName(prop.node) }}</span>
                    <pre v-if="prop.node.state === 'Подготовлен'">
 <b>Ресурс:</b> {{ resourceName(prop.node) }} </pre
                    >
                    <q-btn
                      v-if="prop.node.state === 'Подготовлен'"
                      style="margin-left: 5px"
                      size="sm"
                      round
                      dense
                      color="info"
                      icon="info"
                      @click="(event) => onOpenEditItemDialog(event, prop.node)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </template>
        </q-tree>
      </div>
    </div>
  </div>
  <q-dialog v-model="openResourceForm">
    <vx-resource-form
      :created-resources="prepareStore.createdResources"
      :current-item="currentItem"
      :existing-resources="prepareStore.existingResources"
      :streets="prepareStore.streets"
      :addresses="prepareStore.addresses"
      @on-service-area-selected="onServiceAreaSelected"
      @on-street-selected="onStreetSelected"
      @on-address-selected="onAddressSelected"
      @on-add-new-resource="onAddNewResource"
      @on-prepare-component="onPrepareComponent"
    />
  </q-dialog>
  <q-dialog v-model="openResultTable">
    <vx-result-table />
  </q-dialog>
  <q-dialog v-model="openInspectionDialog">
    <vx-inspection-dialog />
  </q-dialog>
  <q-dialog v-model="openEditItemDialog">
    <vx-edit-item
      :edit-components="editComponents"
      :is-bulk-component-edit="isBulkComponentEdit"
      @on-edit-item="onEditItem"
    />
  </q-dialog>
</template>

<script>
import { ref } from 'vue';
import { usePrepareStore } from 'stores/prepare';
import { useOrderStore } from 'src/stores/order';
import { useRouter } from 'vue-router';
import { Notify } from 'quasar';
import vxResourceForm from '../components/vxResourceForm.vue';
import vxResultTable from '../components/vxResultTable.vue';
import vxInspectionDialog from '../components/vxInspectionDialog.vue';
import vxEditItem from '../components/vxEditItem.vue';

export default {
  setup() {
    const prepareStore = usePrepareStore();
    const orderStore = useOrderStore();
    const router = useRouter();
    return {
      currentItem: ref(null),
      treeFilter: ref(false),
      openResourceForm: ref(false),
      openResultTable: ref(false),
      openInspectionDialog: ref(false),
      openEditItemDialog: ref(false),
      editComponents: ref([]),
      isBulkComponentEdit: ref(false),
      splitterModel: ref(70),
      showAppointed: ref(false),
      tickedNodes: ref(null),
      selectedProduct: ref(null),
      prepareStore,
      orderStore,
      router,
      voixPositionsCols: [
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
    vxInspectionDialog,
    vxEditItem,
  },
  mounted() {
    if (!this.poRequest) {
      this.prepareStore.fetchPORequest(
        this.orderStore.selectedOrder.productOfferRequestId
      );
      this.prepareStore.fetchGeoPlaceInfo(
        this.orderStore.selectedOrder.geoPlace.id
      );
      this.prepareStore.fetchProductInfo(
        this.orderStore.selectedOrder.productOfferRequestId,
        this.orderStore.selectedOrder.geoPlace.id
      );
      this.prepareStore.fetchCPRInfo(
        this.orderStore.selectedOrder.geoPlace.id,
        0,
        10
      );
      this.prepareStore.dataTree = [
        {
          label: 'ПП с одним адресом',
          nodeKey: 'productOfferWithGeneralGeoPlace',
          noTick: true,
          children: [],
        },
        {
          label: 'ПП с несколькими адресами',
          nodeKey: 'productOfferWithP2PGeoPlace',
          noTick: true,
          children: [],
        },
      ];
    }
  },
  computed: {
    lastTechInspectionResultType() {
      const inspections = this.orderStore.techInspections;
      return !!inspections.length
        ? inspections[inspections.length - 1].resultTypeData.nameRu
        : 'Не определено';
    },
    techInspectionsCount() {
      return this.orderStore.techInspections.length;
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
    disableAppointBtn() {
      if (this.$refs.qtree) {
        const tickedNodes = this.$refs.qtree.getTickedNodes();
        const hasAppointed = tickedNodes.some(
          (node) => node.state === 'Подготовлен'
        );
        return !tickedNodes.length || hasAppointed;
      }
      return true;
    },
    colorizeActionChip(node) {
      let color;
      let action =
        node.nodeType === 'position'
          ? node.productOfferActionData.id
          : node.baseCfsActionSpecData.id;
      switch (action) {
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
    nameActionChip(node) {
      return node.nodeType === 'position'
        ? node.productOfferActionData.nameRu
        : node.baseCfsActionSpecData.nameRu;
    },
    oldName(node) {
      let name = node.oldProductOfferData.nameRu;
      let action = node.productOfferActionData.id;
      return action !== 1 ? name : null;
    },
    showUpdateArrow(node) {
      return node.productOfferActionData.id === 2;
    },
    newName(node) {
      let name = node.newProductOfferData.nameRu;
      let action = node.productOfferActionData.id;
      return action !== 3 ? name : null;
    },
    serviceName(node) {
      const id = node.baseCfsSpecData.id;
      if (id) {
        const spec = this.orderStore.baseCfsSpecs.find(
          (spec) => spec.id === id
        );
        return spec ? spec.nameRu : 'Не определено';
      }
      return 'Не определено';
    },
    productName(node) {
      const id = node.productSpecificationData.id;
      if (id) {
        const spec = this.orderStore.productSpecs.find(
          (spec) => spec.id === id
        );
        return spec ? spec.nameRu : 'Не определено';
      }
      return 'Не определено';
    },
    resourceName(node) {
      return node.state === 'Подготовлен' ? '77777777' : null;
    },
    isProductSpecsMultiple(node) {
      const productSpecs = node.productSpecificationData;
      return Array.isArray(productSpecs) && !!productSpecs.length;
    },
    onNodeTicked(nodes) {
      this.prepareStore.selectedComponent = nodes;
    },
    onCompleteWorkOrder() {
      this.orderStore
        .validateWorkOrder(
          this.orderStore.selectedOrder.id,
          this.orderStore.selectedOrder.cprResourceOrderPoReqId
        )
        .then((response) => {
          //response[0] - statusCode
          //response[1] - errCode
          if (response[0] == 200 && response[1] == 0) {
            this.orderStore.patchWorkOrder(
              this.orderStore.selectedOrder.cprResourceOrderPoReqId,
              this.orderStore.selectedOrder.id,
              5
            );
            console.log('positive validation');
            Notify.create({
              message: 'This is a "positive" type notification.',
              type: 'positive',
              position: 'top',
            });
          } else {
            console.log('negative validation');
            Notify.create({
              message: 'This is a "negative" type notification.',
              type: 'negative',
              position: 'top',
            });
          }
        });
    },
    onRouteToOrderPage() {
      this.router.push('/');
    },
    onEditItem(item) {
      this.currentItem = item;
      this.openResourceForm = true;
    },
    onOpenEditItemDialog(event, node) {
      event.stopPropagation();

      if (node.nodeType === 'address') {
        this.editComponents = node.children
          .flatMap((position) => position.children)
          .filter((component) => component.state === 'Подготовлен');
        this.isBulkComponentEdit = true;
      } else {
        this.editComponents = [node];
        this.isBulkComponentEdit = false;
      }

      this.openEditItemDialog = true;
    },
    onAppoint(event) {
      event.stopPropagation();
      this.openResourceForm = true;
    },
    onStreetSelected(id) {
      this.prepareStore.fetchAddresses(id);
    },
    onAddressSelected(address) {
      this.prepareStore.fetchPhysicalContainers(
        this.prepareStore.geoPlaceInfo.generalGeoAddress.toponymId,
        address.house,
        address.subHouse,
        null,
        null
      );
    },
    onServiceAreaSelected(area) {
      /*
        Улица - toponymId
        Дом - geoAddressNum
        Подъезд - entrance
        Квартира -geoSubAddressNum
      */
      let { entrance, geoAddressNum, geoSubAddressNum, toponymId } =
        this.prepareStore.geoPlaceInfo.generalGeoAddress;
      if (area === 'service') {
        this.prepareStore.fetchPhysicalContainers(
          toponymId,
          geoAddressNum,
          null,
          entrance,
          geoSubAddressNum
        );
      } else if (area === 'entrance') {
        this.prepareStore.fetchPhysicalContainers(
          toponymId,
          geoAddressNum,
          null,
          entrance
        );
      } else if (area === 'house') {
        this.prepareStore.fetchPhysicalContainers(toponymId, geoAddressNum);
      } else if (area === 'address') {
        // TODO: fix later, for now do nothing;
      }
    },
    onAddNewResource(resource) {
      this.prepareStore.createdResources.push(resource);
    },
    onPrepareComponent(resource) {
      const tickedNodes = this.$refs.qtree.getTickedNodes();
      const componentsIds = tickedNodes.map((node) => node.id);
      const positionIds = tickedNodes.map((node) => node.poReqItemId);

      this.prepareStore.dataTree.forEach((poType) => {
        poType.children.forEach((address) => {
          address.children.forEach((pos) => {
            pos.children.forEach((comp) => {
              if (componentsIds.includes(comp.id)) {
                comp.state = 'Подготовлен';
                comp.resource = resource;
              }
            });
          });
        });
      });
      let { cprResourceOrderPoReqId, id, geoPlace } =
        this.orderStore.selectedOrder;
      this.prepareStore.createPosition({
        cprRoPoReqId: cprResourceOrderPoReqId,
        cprRoPoReqWoId: id,
        cprActionSpecId: 1,
        compositePhysResSpecId: resource.spec.id,
        physicalContainerId: resource.equipment.id,
        geoPlaceId: geoPlace.id,
        transportCpeFuncSpecId: -1,
        wiringTypeId: resource.equipment.wiringTypeId,
        compositePhysResId: -1,
        compositePhysResNum: '7777777',
        compositePhysResFullNum: '7777777',
        mountedPortId: resource.port.id,
        poRequestItemId: positionIds[0], // TODO: need to work with multiple positions,
        poReqItemCompIds: componentsIds,
      });

      this.openResourceForm = false;
    },
    rejectProductOfferRequestItem(item) {
      this.prepareStore.patchPORequest(
        this.orderStore.selectedOrder.productOfferRequestId,
        16 // TODO: what should be here?
      );
    },
    cancelProductOfferRequestItem() {
      this.orderStore.patchWorkOrder(
        this.orderStore.cprResourceOrderPoReqId,
        this.orderStore.selectedOrder.id,
        2
      );
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
