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
          <div class="col">{{ prepareStore.poRequest.stateData.nameRu }}</div>
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
                    @click="rejectProductOfferRequestItem(prop.node, $event)"
                  />
                  <q-btn
                    dense
                    size="sm"
                    color="negative"
                    label="Отменить"
                    :disable="disableCancelBtn()"
                    @click="cancelRoPoReqWoItem"
                  />

                  <q-btn dense size="sm" @click="onInspect">
                    <div class="row items-center no-wrap text-teal">
                      <div>Обследовать</div>
                    </div>
                  </q-btn>
                  <q-btn dense no-caps size="sm" @click="lastInspect">
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
                    @click="(event) => onOpenEditItemDialog(event)"
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
                    <pre v-if="prop.node.resourceOrderItemId != -1">
 <b>Ресурс:</b> {{ resourceNumber(prop.node) }} </pre
                    >
                    <q-btn
                      v-if="prop.node.resourceOrderItemId != -1"
                      style="margin-left: 5px"
                      size="sm"
                      round
                      dense
                      color="info"
                      icon="info"
                      @click="
                        (event) => onOpenResourceInfoDialog(event, prop.node)
                      "
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
  <q-dialog v-model="openEditResourceForm">
    <vx-edit-resource-form
      :created-resources="prepareStore.createdResources"
      :current-item="currentItem"
      :existing-resources="prepareStore.existingResources"
      :streets="prepareStore.streets"
      :addresses="prepareStore.addresses"
      @on-service-area-selected="onServiceAreaSelected"
      @on-street-selected="onStreetSelected"
      @on-address-selected="onAddressSelected"
      @on-add-new-resource="onAddNewResource"
      @on-edit-component="onEditComponent"
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
      :prepared-components-new="preparedComponentsNew"
      :is-bulk-component-edit="isBulkComponentEdit"
      @on-edit-item="onEditItem"
    />
  </q-dialog>
  <q-dialog v-model="openResourceInfoDialog">
    <vx-resource-info :choosen-component="choosenComponent" />
  </q-dialog>
</template>

<script>
import { ref } from 'vue';
import { usePrepareStore } from 'stores/prepare';
import { useOrderStore } from 'src/stores/order';
import { useRouter } from 'vue-router';
import { Notify } from 'quasar';
import vxResourceForm from '../components/vxResourceForm.vue';
import vxEditResourceForm from '../components/vxEditResourceForm.vue';
import vxResultTable from '../components/vxResultTable.vue';
import vxInspectionDialog from '../components/vxInspectionDialog.vue';
import vxEditItem from '../components/vxEditItem.vue';
import vxResourceInfo from 'src/components/vxResourceInfo.vue';
import { MP_API, PC_API } from 'boot/api';

export default {
  setup() {
    const prepareStore = usePrepareStore();
    const orderStore = useOrderStore();
    const router = useRouter();

    return {
      currentItem: ref([]),
      currentItemId: ref(null),
      currentPortId: ref(null),
      treeFilter: ref(false),
      openResourceForm: ref(false),
      openEditResourceForm: ref(false),
      openResultTable: ref(false),
      openInspectionDialog: ref(false),
      openEditItemDialog: ref(false),
      openResourceInfoDialog: ref(false),
      choosenComponent: ref([]),
      editComponents: ref([]),
      editComponentsCopy: ref([]),
      filteredByResource: ref([]),
      isBulkComponentEdit: ref(false),
      splitterModel: ref(70),
      showAppointed: ref(false),
      tickedNodes: ref(null),
      selectedProduct: ref(null),
      currentResource: ref([]),
      currentComponents: ref([]),
      preparedComponentsNew: ref([]),
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
    vxEditResourceForm,
    vxResultTable,
    vxInspectionDialog,
    vxEditItem,
    vxResourceInfo,
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
        return node.nodeType === 'address' || node.resourceOrderItemId === -1;
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
        console.log('tickedNodes', tickedNodes);
        if (tickedNodes.length > 0) {
          if (
            this.orderStore.selectedOrder.cprResourceOrderPoReqItems.length > 0
          ) {
            const leng =
              this.orderStore.selectedOrder.cprResourceOrderPoReqItems.length;
            for (let i = 0; i < leng; i++) {
              const hasAppointed2 = tickedNodes.some(
                (node) =>
                  node.resourceOrderItemId ===
                  this.orderStore.selectedOrder.cprResourceOrderPoReqItems[i].id
              );
              if (hasAppointed2) {
                return hasAppointed2;
              }
            }
          }
        }
        return !tickedNodes.length;
      }
      return true;
    },
    disableCancelBtn() {
      if (this.$refs.qtree) {
        const tickedNodes = this.$refs.qtree.getTickedNodes();
        console.log('tickedNodes', tickedNodes);
        if (tickedNodes.length >= 0) {
          const hasAppointed2 = tickedNodes.some(
            (node) => node.resourceOrderItemId === -1
          );
          if (hasAppointed2) {
            return hasAppointed2;
          }
        }
        return !tickedNodes.length;
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
    resourceNumber(node) {
      return node.resourceOrderItemId != -1 ? node.newNumber : null;
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
          //response[2] - errMsg
          if (response[0] == 200 && response[1] == 0) {
            this.orderStore.patchWorkOrder(
              this.orderStore.selectedOrder.cprResourceOrderPoReqId,
              this.orderStore.selectedOrder.id,
              5
            );
            Notify.create({
              message: 'Поручение завершено',
              type: 'positive',
              position: 'top',
            });
          } else {
            Notify.create({
              message: 'Ошибка:' + response[2],
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
      console.log('item', item);
      console.log('resourceOrderItemId', item[0].resourceOrderItemId);
      this.currentItem = [];
      this.currentItemId = null;
      this.currentPortId = null;
      this.currentItem.push(item);
      this.currentItemId = item[0].resourceOrderItemId;
      this.currentPortId = item[0].resource.port.id;
      this.openEditResourceForm = true;
    },
    onOpenEditItemDialog(event) {
      event.stopPropagation();
      this.isBulkComponentEdit = true;
      this.openEditItemDialog = true;
    },
    onOpenResourceInfoDialog(event, node) {
      this.choosenComponent = [];
      this.choosenComponent.push(node);
      this.prepareStore.infoTableLoading = true;
      MP_API.get('/mounted-port', {
        params: {
          cprResourceOrderItemId: this.choosenComponent[0].resourceOrderItemId,
          limit: 1,
          offset: 0,
        },
      }).then((mPortResult) => {
        if (mPortResult.data) {
          this.choosenComponent[0].portNumber = mPortResult.data[0].portNumber;
          PC_API.get(
            `/physical-container/${mPortResult.data[0].physicalContainerId}`
          ).then(({ data }) => {
            this.choosenComponent[0].physicalContainerNumber =
              data.physicalContainerNumber;
            this.prepareStore.infoTableLoading = false;
          });
        } else {
          Notify.create({
            message: 'Ошибка: Порт не найден',
            type: 'negative',
            position: 'top',
          });
          console.log('Порт не найден');
          this.prepareStore.infoTableLoading = false;
        }
      });

      this.choosenComponent[0].state = 'Подготовлен';

      event.stopPropagation();
      this.openResourceInfoDialog = true;
    },
    onAppoint(event) {
      event.stopPropagation();
      this.openResourceForm = true;
    },
    onInspect(event) {
      event.stopPropagation();
      this.openInspectionDialog = true;
    },
    lastInspect(event) {
      event.stopPropagation();
      this.openResultTable = true;
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
    async onPrepareComponent(resource, currentItem) {
      let componentsIds = null;
      let positionIds = null;
      const tickedNodes = this.$refs.qtree.getTickedNodes();

      if (tickedNodes.length > 0) {
        componentsIds = tickedNodes.map((node) => node.id);
        positionIds = tickedNodes.map((node) => node.poReqItemId);
      } else if (currentItem.length > 0) {
        componentsIds = currentItem[0].map((node) => node.id);
        positionIds = currentItem[0].map((node) => node.poReqItemId);
      }
      this.tickedNodes = [];
      this.prepareStore.dataTree.forEach((poType) => {
        poType.children.forEach((address) => {
          address.children.forEach((pos) => {
            pos.children.forEach((comp) => {
              if (componentsIds.includes(comp.id)) {
                comp.state = 'Подготовлен';
                comp.resource = resource;
                setTimeout(() => {
                  comp.resourceOrderItemId =
                    this.prepareStore.resourceOrderItemId;
                }, 1000);
                this.currentComponents.push(comp);
              }
            });
          });
        });
      });

      for (let i = 0; i < this.preparedComponentsNew.length; i++) {
        if (
          this.preparedComponentsNew[i][0].resource?.port.portNumber ==
          this.currentComponents[0].resource.port.portNumber
        ) {
          this.preparedComponentsNew.splice(i, 1);
        }
      }
      this.preparedComponentsNew.push(this.currentComponents);
      this.currentComponents = [];

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
        currentPortId: this.currentPortId,
        poRequestItemId: positionIds[0], // TODO: need to work with multiple positions,
        poReqItemCompIds: componentsIds,
      });
      this.currentPortId = null;
      this.openResourceForm = false;
      this.orderStore.getOrder(
        this.orderStore.selectedOrder.cprResourceOrderPoReqId,
        this.orderStore.selectedOrder.id
      );
      setTimeout(() => {
        this.prepareStore.fetchProductInfo(
          this.orderStore.selectedOrder.productOfferRequestId,
          this.orderStore.selectedOrder.geoPlace.id
        );
      }, 1000);
    },
    onEditComponent(resource, currentItem) {
      let componentsIds = null;
      let positionIds = null;
      const tickedNodes = this.$refs.qtree.getTickedNodes();
      //TODO добавить отмену галочек при открытии окна редактировании
      if (tickedNodes.length > 0) {
        componentsIds = tickedNodes.map((node) => node.id);
        positionIds = tickedNodes.map((node) => node.poReqItemId);
      } else if (currentItem.length > 0) {
        componentsIds = currentItem[0].map((node) => node.id);
        positionIds = currentItem[0].map((node) => node.poReqItemId);
      }
      this.tickedNodes = [];
      this.prepareStore.dataTree.forEach((poType) => {
        poType.children.forEach((address) => {
          address.children.forEach((pos) => {
            pos.children.forEach((comp) => {
              if (componentsIds.includes(comp.id)) {
                comp.state = 'Подготовлен';
                comp.resource = resource;
                setTimeout(() => {
                  comp.resourceOrderItemId =
                    this.prepareStore.resourceOrderItemId;
                }, 500);
                this.currentComponents.push(comp);
              }
            });
          });
        });
      });

      for (let i = 0; i < this.preparedComponentsNew.length; i++) {
        if (
          this.preparedComponentsNew[i][0].resource?.port.portNumber ==
          this.currentComponents[0].resource.port.portNumber
        ) {
          this.preparedComponentsNew.splice(i, 1);
        }
      }
      this.preparedComponentsNew.push(this.currentComponents);
      this.currentComponents = [];

      let { cprResourceOrderPoReqId, id } = this.orderStore.selectedOrder;

      console.log(
        'this.orderStore.selectedOrder',
        this.orderStore.selectedOrder
      );

      this.prepareStore.editPosition({
        cprRoPoReqId: cprResourceOrderPoReqId,
        cprRoPoReqWoId: id,
        cprRoPoReqWoItemId: this.currentItemId,
        compositePhysResSpecId: resource.spec.id,
        physicalContainerId: resource.equipment.id,
        transportCpeFuncSpecId: -1,
        wiringTypeId: resource.equipment.wiringTypeId,
        compositePhysResId: -1,
        compositePhysResNum: '7777777',
        compositePhysResFullNum: '7777776',
        mountedPortId: resource.port.id,
        currentPortId: this.currentPortId,

        poRequestItemId: positionIds[0], // TODO: need to work with multiple positions,
        poReqItemCompIds: componentsIds,
      });
      this.currentPortId = null;
      this.openEditResourceForm = false;
    },
    rejectProductOfferRequestItem(item, event) {
      event.stopPropagation();
      this.prepareStore.patchPORequest(
        item.children[0].productOfferReqId,
        item.children[0].id
      );
    },
    cancelRoPoReqWoItem(event) {
      event.stopPropagation();

      const tickedNodes = this.$refs.qtree.getTickedNodes();
      const allNodes =
        this.$refs.qtree.nodes[0].children[0].children[0].children;
      let unBookPort = true;
      const unTickedNodes = [];

      allNodes.forEach((nodeElement) => {
        if (!tickedNodes.some((x) => x.id === nodeElement.id)) {
          unTickedNodes.push(nodeElement);
        }
      });

      tickedNodes.forEach((tickedElement) => {
        unTickedNodes.forEach((untickedElement) => {
          if (
            tickedElement.resourceOrderItemId ===
            untickedElement.resourceOrderItemId
          ) {
            unBookPort = false;
          }
        });

        this.orderStore.patchWorkOrderItem(
          this.orderStore.selectedOrder.cprResourceOrderPoReqId,
          this.orderStore.selectedOrder.id,
          tickedElement.resourceOrderItemId,
          2,
          tickedElement.poReqItemId,
          tickedElement.id,
          unBookPort
        );
      });

      this.orderStore.getOrder(
        this.orderStore.selectedOrder.cprResourceOrderPoReqId,
        this.orderStore.selectedOrder.id
      );

      setTimeout(() => {
        this.prepareStore.fetchProductInfo(
          this.orderStore.selectedOrder.productOfferRequestId,
          this.orderStore.selectedOrder.geoPlace.id
        );
      }, 1000);
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
