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
      <div class="row" v-if="prepareStore.dataTree[0].children.length == 0">
        <q-spinner-hourglass size="40px" color="primary" />
      </div>
      <div class="row" v-if="prepareStore.dataTree[0].children.length != 0">
        <q-tree
          class="col"
          ref="qtree"
          node-key="nodeKey"
          tick-strategy="leaf"
          v-model:expanded="expanded"
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
      @on-prepare-created="onPrepareCreated"
      @on-prepare-existed="onPrepareExisted"
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
      @on-edit-comp-new="onEditCompNew"
      @on-edit-comp-exst="onEditCompExst"
      @on-edit-comp-crt="onEditCompCrt"
      @on-prepare-existed="onPrepareExisted"
      @on-prepare-created="onPrepareCreated"
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
import { Dialog } from 'quasar';
import vxResourceForm from '../components/vxResourceForm.vue';
import vxEditResourceForm from '../components/vxEditResourceForm.vue';
import vxResultTable from '../components/vxResultTable.vue';
import vxInspectionDialog from '../components/vxInspectionDialog.vue';
import vxEditItem from '../components/vxEditItem.vue';
import vxResourceInfo from 'src/components/vxResourceInfo.vue';
import { MP_API, PC_API, POR_API, CPR_RO_API } from 'boot/api';

export default {
  setup() {
    const prepareStore = usePrepareStore();
    const orderStore = useOrderStore();
    const router = useRouter();

    return {
      expanded: ref([prepareStore.dataTree[0].nodeKey]),
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
      tickedNodes: ref([]),
      selectedProduct: ref(null),
      currentResource: ref([]),
      preparedComponentsNew: ref([]),
      prepareStore,
      orderStore,
      router,
      createdResource_2: {
        label: null,
        value: {
          id: null,
        },
      },
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
      if (this.orderStore.selectedOrder) {
        console.log(
          'this.orderStore.selectedOrder',
          this.orderStore.selectedOrder
        );
        console.log(
          'this.orderStore.selectedOrder.geoPlace.id',
          this.orderStore.selectedOrder.geoPlace.id
        );
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
        console.log(
          'this.prepareStore.existingResources',
          this.prepareStore.existingResources
        );
        console.log(
          'this.prepareStore.dataTree[0]',
          this.prepareStore.dataTree[0]
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
      } else {
        this.onConfirm();
      }
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
                    this.orderStore.selectedOrder.cprResourceOrderPoReqItems[i]
                      .id ||
                  node.compositePhysResId ===
                    this.orderStore.selectedOrder.cprResourceOrderPoReqItems[i]
                      .compositePhysResId
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
          console.log('response', response);
          //response[0] - statusCode
          //response[1] - errCode
          //response[2] - errMsg
          if (response[0] == 200 && response[1] == 0) {
            this.orderStore.patchWorkOrder(
              this.orderStore.selectedOrder.cprResourceOrderPoReqId,
              this.orderStore.selectedOrder.id,
              5
            );
            // console.log(
            //   'this.orderStore.selectedOrder',
            //   this.orderStore.selectedOrder
            // );
            // console.log(
            //   'this.orderStore.selectedOrder.cprResourceOrderPoReqId',
            //   this.orderStore.selectedOrder.cprResourceOrderPoReqId
            // );
            this.prepareStore.patchPORState(
              this.orderStore.selectedOrder.productOfferRequestId,
              4
            );
            this.prepareStore.notifyMessage('Поручение завершено', 'positive');
          } else {
            this.prepareStore.notifyMessage(
              'Ошибка:' + response[2],
              'negative'
            );
          }
        });
    },
    onRouteToOrderPage() {
      this.router.push('/');
    },
    onEditItem(item) {
      this.prepareStore.editItem = item;
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

      this.choosenComponent[0].state = 'Подготовлен';

      event.stopPropagation();
      this.openResourceInfoDialog = true;
    },
    onAppoint(event) {
      event.stopPropagation();
      console.log(
        'this.prepareStore.existingResources',
        this.prepareStore.existingResources
      );
      console.log(
        'this.prepareStore.preparedComponentsNew',
        this.prepareStore.preparedComponentsNew
      );

      this.orderStore.selectedOrder.cprResourceOrderPoReqItems.forEach(
        (element) => {
          console.log('element.id', element.id);
          element.compositePhysResId != -1
            ? MP_API.get('/mounted-port', {
                params: {
                  compositePhysResId: element.compositePhysResId,
                  limit: 1,
                  offset: 0,
                },
              }).then((mPortResult) => {
                if (mPortResult.data) {
                  console.log('mPortResult.data', mPortResult.data);
                  console.log(
                    'mPortResult.data[0].physicalContainerId',
                    mPortResult.data[0].physicalContainerId
                  );
                  element.portNumber = mPortResult.data[0].portNumber;
                  // element.portId = mPortResult.data[0].id;
                  // element.portNumber = mPortResult.data[0].portNumber;
                  PC_API.get(
                    `/physical-container/${mPortResult.data[0].physicalContainerId}`
                  ).then(({ data }) => {
                    console.log('physCon', data);
                    element.physicalContainerNumber =
                      data.physicalContainerNumber;

                    // this.prepareStore.createdResources.push(element);
                    // element.physicalContainerNumber =
                    //   data.physicalContainerNumber;
                    // this.preparedComponentsNew.push(element);
                  });
                } else {
                  console.log('Порт не найден');
                }
              })
            : MP_API.get('/mounted-port', {
                params: {
                  cprResourceOrderItemId: element.id,
                  limit: 1,
                  offset: 0,
                },
              }).then((mPortResult) => {
                if (mPortResult.data) {
                  console.log('mPortResult.data', mPortResult.data);
                  console.log(
                    'mPortResult.data[0].physicalContainerId',
                    mPortResult.data[0].physicalContainerId
                  );
                  element.portNumber = mPortResult.data[0].portNumber;
                  // element.portId = mPortResult.data[0].id;
                  // element.portNumber = mPortResult.data[0].portNumber;
                  PC_API.get(
                    `/physical-container/${mPortResult.data[0].physicalContainerId}`
                  ).then(({ data }) => {
                    console.log('physCon', data);
                    element.physicalContainerNumber =
                      data.physicalContainerNumber;

                    // this.prepareStore.createdResources.push(element);
                    // element.physicalContainerNumber =
                    //   data.physicalContainerNumber;
                    // this.preparedComponentsNew.push(element);
                  });
                } else {
                  console.log('Порт не найден');
                }
              });
          // MP_API.get('/mounted-port', {
          //   params: {
          //     cprResourceOrderItemId: element.id,
          //     limit: 1,
          //     offset: 0,
          //   },
          // }).then((mPortResult) => {
          //   if (mPortResult.data) {
          //     console.log('mPortResult.data', mPortResult.data);
          //     console.log(
          //       'mPortResult.data[0].physicalContainerId',
          //       mPortResult.data[0].physicalContainerId
          //     );
          //     element.portNumber = mPortResult.data[0].portNumber;
          //     // element.portId = mPortResult.data[0].id;
          //     // element.portNumber = mPortResult.data[0].portNumber;
          //     PC_API.get(
          //       `/physical-container/${mPortResult.data[0].physicalContainerId}`
          //     ).then(({ data }) => {
          //       console.log('physCon', data);
          //       element.physicalContainerNumber = data.physicalContainerNumber;

          //       // this.prepareStore.createdResources.push(element);
          //       // element.physicalContainerNumber =
          //       //   data.physicalContainerNumber;
          //       // this.preparedComponentsNew.push(element);
          //     });
          //   } else {
          //     console.log('Порт не найден');
          //   }
          // });
        }
      );
      this.prepareStore.createdResources_2 = [];
      setTimeout(() => {
        this.orderStore.selectedOrder.cprResourceOrderPoReqItems.forEach(
          (element) => {
            console.log('!!!!element', element);
            const createdResource = {
              label:
                element.compositePhysResSpecData.nameRu +
                ' ' +
                element.physicalContainerNumber +
                ' Порт ' +
                element.portNumber,
              value: {
                id: element.id,
                compositePhysResId: element.compositePhysResId,
                compositePhysResNum: element.compositePhysResNum,
                compositePhysResFullNum: element.compositePhysResFullNum,
                compositePhysResSpecId: element.compositePhysResSpecData.id,
                physicalContainerId: element.physicalContainerId,
                transportCpeFuncSpecId: element.transportCpeFuncSpecData.id,
                wiringTypeId: element.wiringTypeData.id,
              },
            };

            this.prepareStore.createdResources_2.push(createdResource);
          }
        );
      }, 1500);

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
    },

    async onPrepareCreated(resource, currentItem) {
      console.log('onPrepareCreated');
      console.log('resource', resource);
      console.log('currentItem', currentItem);
      const tickedNodes = this.$refs.qtree.getTickedNodes();
      let componentsIds = null;
      let positionIds = null;

      if (tickedNodes.length > 0) {
        componentsIds = tickedNodes.map((node) => node.id);
        positionIds = tickedNodes.map((node) => node.poReqItemId);
      } else if (currentItem.length > 0) {
        componentsIds = currentItem[0].map((node) => node.id);
        positionIds = currentItem[0].map((node) => node.poReqItemId);
      }
      console.log('componentsIds', componentsIds);
      console.log('positionIds', positionIds);
      this.tickedNodes = [];
      if (resource.compositePhysResId == -1) {
        for (let i = 0; i < componentsIds.length; i++) {
          POR_API.patch(
            `/po-req-item/${positionIds[0]}/po-req-item-component/${componentsIds[i]}`,
            {
              resourceOrderItemId: resource.id,
            }
          )
            .then(() => {
              if (
                componentsIds[i] === componentsIds[componentsIds.length - 1]
              ) {
                useOrderStore().getOrder(
                  useOrderStore().selectedOrder.cprResourceOrderPoReqId,
                  useOrderStore().selectedOrder.id
                );
                this.prepareStore.fetchProductInfo(
                  this.orderStore.selectedOrder.productOfferRequestId,
                  this.orderStore.selectedOrder.geoPlace.id
                );
              }
              this.prepareStore.notifyMessage('Успешно назначен', 'positive');
            })
            .catch((error) => {
              console.log(error);
              this.prepareStore.notifyMessage('Ошибка назначения', 'negative');
            });
        }
      } else {
        for (let i = 0; i < componentsIds.length; i++) {
          MP_API.get('/mounted-port', {
            params: {
              compositePhysResId: resource.compositePhysResId,
              limit: 1,
              offset: 0,
            },
          }).then((mPortResult) => {
            POR_API.patch(
              `/po-req-item/${positionIds[0]}/po-req-item-component/${componentsIds[i]}`,
              {
                resourceOrderItemId: mPortResult.data[0].cprResourceOrderItemId,
              }
            )
              .then(() => {
                if (
                  componentsIds[i] === componentsIds[componentsIds.length - 1]
                ) {
                  useOrderStore().getOrder(
                    useOrderStore().selectedOrder.cprResourceOrderPoReqId,
                    useOrderStore().selectedOrder.id
                  );
                  this.prepareStore.fetchProductInfo(
                    this.orderStore.selectedOrder.productOfferRequestId,
                    this.orderStore.selectedOrder.geoPlace.id
                  );
                }
                this.prepareStore.notifyMessage('Успешно назначен', 'positive');
              })
              .catch((error) => {
                console.log(error);
                this.prepareStore.notifyMessage(
                  'Ошибка назначения',
                  'negative'
                );
              });

            console.log('mPortResult', mPortResult);
            console.log(
              'mPortResult.data[0].cprResourceOrderItemId',
              mPortResult.data[0].cprResourceOrderItemId
            );

            // MP_API.get('/mounted-port', {
            //   params: {
            //     compositePhysResId: resource.compositePhysResId,
            //     limit: 1,
            //     offset: 0,
            //   },
            // }).then((mPortResult) => {
            //   POR_API.patch(
            //     `/po-req-item/${currentItem.poReqItemId}/po-req-item-component/${currentItem.id}`,
            //     {
            //       resourceOrderItemId: mPortResult.data[0].cprResourceOrderItemId,
            //     }
            //   )
            //     .then(() => {
            //       let { cprResourceOrderPoReqId, id } =
            //         this.orderStore.selectedOrder;
            //       this.prepareStore.editPosCrtRes({
            //         cprRoPoReqId: cprResourceOrderPoReqId,
            //         cprRoPoReqWoId: id,
            //         cprRoPoReqWoItemId: currentItem.resourceOrderItemId,
            //         compositePhysResSpecId: resource.compositePhysResSpecId,
            //         physicalContainerId: resource.physicalContainerId,
            //         transportCpeFuncSpecId: resource.transportCpeFuncSpecId,
            //         wiringTypeId: resource.wiringTypeId,
            //         compositePhysResId: resource.compositePhysResId,
            //         compositePhysResNum: resource.compositePhysResNum,
            //         compositePhysResFullNum: resource.compositePhysResFullNum,
            //         mountedPortId: resource.port.id,
            //         currentPortId: currentItem.portId,
            //         poRequestItemId: currentItem.id,
            //         poReqItemCompIds: currentItem.poReqItemId,
            //       });
            //       useOrderStore().getOrder(
            //         useOrderStore().selectedOrder.cprResourceOrderPoReqId,
            //         useOrderStore().selectedOrder.id
            //       );
            //       this.prepareStore.fetchProductInfo(
            //         this.orderStore.selectedOrder.productOfferRequestId,
            //         this.orderStore.selectedOrder.geoPlace.id
            //       );
            //       this.prepareStore.notifyMessage('Успешно назначен', 'positive');
            //     })
            //     .catch((error) => {
            //       console.log(error);
            //       this.prepareStore.notifyMessage('Ошибка назначения', 'negative');
            //     });
            // console.log('mPortResult', mPortResult);
            // console.log(
            //   'mPortResult.data[0].cprResourceOrderItemId',
            //   mPortResult.data[0].cprResourceOrderItemId
            // );
            console.log(
              'this.prepareStore.preparedComponentsNew',
              this.prepareStore.preparedComponentsNew
            );
            // console.log('componentsIds', currentItem.id);
            // console.log('positionIds', currentItem.poReqItemId);
            // console.log('currentItem', currentItem);
            console.log('resource.id', resource.id);
            console.log('resource.id', resource.id);
            console.log(
              'resource.compositePhysResId',
              resource.compositePhysResId
            );
          });
        }
      }
      this.openResourceForm = false;
    },

    onPrepareExisted(resource) {
      let componentsIds = null;
      let positionIds = null;
      let sameCPR = false;
      const tickedNodes = this.$refs.qtree.getTickedNodes();
      const allNodes =
        this.$refs.qtree.nodes[0].children[0].children[0].children;

      for (let i = 0; allNodes.length > i; i++) {
        if (resource.compositePhysResId === allNodes[i].compositePhysResId) {
          sameCPR = true; // choosen resource already appointed on other component
        }
      }

      if (tickedNodes.length > 0) {
        componentsIds = tickedNodes.map((node) => node.id);
        positionIds = tickedNodes.map((node) => node.poReqItemId);
      }

      if (sameCPR) {
        // ГОТОВО
        // Если назначающий ресурс уже имеется на других компонентах
        for (let i = 0; i < componentsIds.length; i++) {
          MP_API.get('/mounted-port', {
            params: {
              compositePhysResId: resource.compositePhysResId,
              limit: 1,
              offset: 0,
            },
          }).then((mPortResult) => {
            POR_API.patch(
              `/po-req-item/${positionIds[0]}/po-req-item-component/${componentsIds[i]}`,
              {
                resourceOrderItemId: mPortResult.data[0].cprResourceOrderItemId,
              }
            )
              .then(() => {
                if (
                  componentsIds[i] === componentsIds[componentsIds.length - 1]
                ) {
                  useOrderStore().getOrder(
                    useOrderStore().selectedOrder.cprResourceOrderPoReqId,
                    useOrderStore().selectedOrder.id
                  );
                  this.prepareStore.fetchProductInfo(
                    this.orderStore.selectedOrder.productOfferRequestId,
                    this.orderStore.selectedOrder.geoPlace.id
                  );
                }
                this.tickedNodes = [];
                this.prepareStore.notifyMessage('Успешно назначен', 'positive');
              })
              .catch((error) => {
                console.log(error);
                this.prepareStore.notifyMessage(
                  'Ошибка назначения',
                  'negative'
                );
              });
          });
        }
      } else {
        // ГОТОВО
        // Если назначающий ресурс отсутствует на других компонентах
        MP_API.get('/mounted-port', {
          params: {
            compositePhysResId: resource.compositePhysResId,
            limit: 1,
            offset: 0,
          },
        }).then((mPortResult) => {
          console.log('mPortResult', mPortResult);
          if (mPortResult.data) {
            resource.portId = mPortResult.data[0].id;
            resource.physicalContainerId =
              mPortResult.data[0].physicalContainerId;

            this.tickedNodes = [];

            let { cprResourceOrderPoReqId, id, geoPlace } =
              this.orderStore.selectedOrder;

            this.currentPortId = null;
            this.openResourceForm = false;
            this.prepareStore.createPosExisRes({
              cprRoPoReqId: cprResourceOrderPoReqId,
              cprRoPoReqWoId: id,
              cprActionSpecId: 1,
              compositePhysResSpecId: resource.compositePhysResSpecId,
              physicalContainerId: resource.physicalContainerId,
              geoPlaceId: geoPlace.id,
              transportCpeFuncSpecId: resource.transportCpeFuncSpecId,
              wiringTypeId: resource.wiringTypeId,
              compositePhysResId: resource.compositePhysResId,
              compositePhysResNum: resource.resourceNumber,
              compositePhysResFullNum: resource.resourceFullNumber,
              poRequestItemId: positionIds[0], // TODO: need to work with multiple positions,
              poReqItemCompIds: componentsIds,
              resourceOrderItemId: resource.resourceOrderItemId,
            });
          } else {
            this.prepareStore.notifyMessage(
              'Ошибка: Порт не найден',
              'negative'
            );
            console.log('Порт не найден');
            // this.prepareStore.infoTableLoading = false;
          }
        });
      }
      this.openResourceForm = false;
    },

    onEditCompNew(resource, currentItem) {
      console.log('resource', resource);
      console.log('currentItem', currentItem);

      let sameROItemId = false; // in case if currentitem resource also active on other components, therefore no need to unbook port
      let compCPR = false; // in case if current item with cpr id

      for (let i = 0; this.prepareStore.preparedComponentsNew.length > i; i++) {
        if (
          currentItem.id != this.prepareStore.preparedComponentsNew[i].id &&
          currentItem.resourceOrderItemId ===
            this.prepareStore.preparedComponentsNew[i].resourceOrderItemId
        ) {
          sameROItemId = true; // other component has same resource as current's edit component
        }

        if (currentItem.compositePhysResId != -1) {
          compCPR = true; // current component has port from existing resource
        }
      }

      if (sameROItemId) {
        /*
          (sameResOnOther)
          на редактируемом компоненте назначен ресурс который есть на других компонентах
          отменять позицию не нужно
          нужно редактировать компонент
        */
        console.log('sameROItemId', sameROItemId);
        if (compCPR) {
          /*
            (compCPR)
            на компоненте назначен существующий ресурс
          */
          console.log('compCPR', compCPR);
        } else {
          /*
            (not compCPR)
            на компоненте назначен новый ресурс
          */
          console.log('not compCPR', compCPR);
        }
      } else {
        console.log('not sameROItemId', sameROItemId);
        if (compCPR) {
          /*
            (compCPR)
            на компоненте назначен существующий ресурс
          */
          console.log('compCPR', compCPR);
        } else {
          /*
            (not compCPR)
            на компоненте назначен новый ресурс
          */
          console.log('not compCPR', compCPR);
        }
      }

      // let { cprResourceOrderPoReqId, id } = this.orderStore.selectedOrder;

      // this.prepareStore.editPosNewRes({
      //   cprRoPoReqId: cprResourceOrderPoReqId,
      //   cprRoPoReqWoId: id,
      //   cprRoPoReqWoItemId: currentItem.resourceOrderItemId,
      //   compositePhysResSpecId: resource.spec.id,
      //   physicalContainerId: resource.equipment.id,
      //   transportCpeFuncSpecId: -1,
      //   wiringTypeId: resource.equipment.wiringTypeId,
      //   compositePhysResId: -1,
      //   compositePhysResNum: '7777777',
      //   compositePhysResFullNum: '7777776',
      //   mountedPortId: resource.port.id,
      //   currentPortId: currentItem.portId,
      //   poRequestItemId: currentItem.id,
      //   poReqItemCompIds: currentItem.poReqItemId,
      // });
      this.openEditResourceForm = false;
    },

    onEditCompExst(resource, currentItem) {
      let sameCPR = false; // in case if need to create new postion or using already appointed one and just asign data to product offer component
      let sameROItemId = false; // in case if currentitem resource also active on other components, therefore no need to unbook port
      let withCPR = false; // in case if current item with cpr id
      let componentsIds = [];
      let positionId = null;
      componentsIds.push(currentItem.id);
      positionId = currentItem.poReqItemId;

      for (let i = 0; this.prepareStore.preparedComponentsNew.length > i; i++) {
        if (
          currentItem.id != this.prepareStore.preparedComponentsNew[i].id &&
          resource.compositePhysResId ===
            this.prepareStore.preparedComponentsNew[i].compositePhysResId
        ) {
          sameCPR = true; // choosen resource already appointed on other component
        }

        if (
          currentItem.id != this.prepareStore.preparedComponentsNew[i].id &&
          currentItem.resourceOrderItemId ===
            this.prepareStore.preparedComponentsNew[i].resourceOrderItemId
        ) {
          sameROItemId = true; // other component has same resource as current's edit component
        }

        if (currentItem.compositePhysResId != -1) {
          withCPR = true; // current component has port from existing resource
          console.log('withCPR = true');
        }
      }
      if (resource.compositePhysResId != currentItem.compositePhysResId) {
        // choosen resource already appointed on current component
        if (sameROItemId) {
          // выбранный компонент имеет resourceOrderItemId который есть на других компонентах

          if (sameCPR) {
            //
            // ГОТОВО
            //
            console.log('sameROItemId, sameCPR');
            MP_API.get('/mounted-port', {
              params: {
                compositePhysResId: resource.compositePhysResId,
                limit: 1,
                offset: 0,
              },
            }).then((mPortResult) => {
              POR_API.patch(
                `/po-req-item/${positionId}/po-req-item-component/${componentsIds[0]}`,
                {
                  resourceOrderItemId:
                    mPortResult.data[0].cprResourceOrderItemId,
                }
              )
                .then(() => {
                  useOrderStore().getOrder(
                    useOrderStore().selectedOrder.cprResourceOrderPoReqId,
                    useOrderStore().selectedOrder.id
                  );
                  this.prepareStore.fetchProductInfo(
                    this.orderStore.selectedOrder.productOfferRequestId,
                    this.orderStore.selectedOrder.geoPlace.id
                  );
                  this.prepareStore.notifyMessage(
                    'Успешно назначен',
                    'positive'
                  );
                })
                .catch((error) => {
                  console.log(error);
                  this.prepareStore.notifyMessage(
                    'Ошибка назначения ресурса на компонент',
                    'negative'
                  );
                });
            });
          } else {
            console.log('sameROItemId');

            //
            // ГОТОВО
            //
            // если выбранного существующего ресурса для назначения нет на назначенных компонентах
            // тогда нужно будет создать новую позицию и назначить на компонент ресурс
            // console.log('NEED TO CREATE POSITION');
            //
            // Создается новая позиция для компонента
            // но не разбронируется порт который был на редактируемом компоненте
            //

            MP_API.get('/mounted-port', {
              params: {
                compositePhysResId: resource.compositePhysResId,
                limit: 1,
                offset: 0,
              },
            }).then((mPortResult) => {
              console.log('mPortResult', mPortResult);
              if (mPortResult.data) {
                resource.physicalContainerId =
                  mPortResult.data[0].physicalContainerId;
                let { cprResourceOrderPoReqId, id, geoPlace } =
                  this.orderStore.selectedOrder;

                this.prepareStore.createPosExisRes({
                  cprRoPoReqId: cprResourceOrderPoReqId,
                  cprRoPoReqWoId: id,
                  cprActionSpecId: 1,
                  compositePhysResSpecId: resource.compositePhysResSpecId,
                  physicalContainerId: resource.physicalContainerId,
                  geoPlaceId: geoPlace.id,
                  transportCpeFuncSpecId: resource.transportCpeFuncSpecId,
                  wiringTypeId: resource.wiringTypeId,
                  compositePhysResId: resource.compositePhysResId,
                  compositePhysResNum: resource.resourceNumber,
                  compositePhysResFullNum: resource.resourceFullNumber,
                  poRequestItemId: positionId,
                  poReqItemCompIds: componentsIds,
                  resourceOrderItemId: resource.resourceOrderItemId,
                });
              }
            });
          }
        } else {
          //
          // ГОТОВО
          //

          // если редактируемый компонент назначен из сфр(из существующего ресурса), тогда не нужно снимать бронь с его порта
          // если редактируемый компонент назначен не из сфр(из существующего ресурса), а создаынным новым, тогда нужно будет снять бронь с порта и отчистить resourceOrderItemId на нем

          if (sameCPR) {
            if (withCPR) {
              //
              // ГОТОВО
              //
              //
              // выбранный существующий ресурс для назначения уже есть на других компонентах
              // тогда патчим компонент в продукт оффере на resourceOrderItemId от выбранного ресурса
              // если редактируемый компонент имеет ресурс с СФР то есть до этого был назначен из сущ рес
              // тогда отменяем позицию на редактируемом компоненте и не отменяем отменяем порт, то есть не чистим на нем все данные связанные с ресурсом
              let { cprResourceOrderPoReqId, id } =
                this.orderStore.selectedOrder;
              for (
                let i = 0;
                this.orderStore.selectedOrder.cprResourceOrderPoReqItems
                  .length > i;
                i++
              ) {
                if (
                  this.orderStore.selectedOrder.cprResourceOrderPoReqItems[i]
                    .compositePhysResId === currentItem.compositePhysResId
                ) {
                  CPR_RO_API.patch(
                    `/cpr-resource-order-po-req/${cprResourceOrderPoReqId}/work-order/${id}/item/${this.orderStore.selectedOrder.cprResourceOrderPoReqItems[i].id}`,
                    { stateId: 2 }
                  )
                    .then(() => {
                      MP_API.get('/mounted-port', {
                        params: {
                          compositePhysResId: resource.compositePhysResId,
                          limit: 1,
                          offset: 0,
                        },
                      })
                        .then((mPortResult) => {
                          POR_API.patch(
                            `/po-req-item/${positionId}/po-req-item-component/${componentsIds[0]}`,
                            {
                              resourceOrderItemId:
                                mPortResult.data[0].cprResourceOrderItemId,
                            }
                          )
                            .then(() => {
                              useOrderStore().getOrder(
                                useOrderStore().selectedOrder
                                  .cprResourceOrderPoReqId,
                                useOrderStore().selectedOrder.id
                              );
                              this.prepareStore.fetchProductInfo(
                                this.orderStore.selectedOrder
                                  .productOfferRequestId,
                                this.orderStore.selectedOrder.geoPlace.id
                              );
                              this.prepareStore.notifyMessage(
                                'Успешно назначен',
                                'positive'
                              );
                            })
                            .catch((error) => {
                              console.log(error);
                              this.prepareStore.notifyMessage(
                                'Ошибка назначения ресурса на компонент',
                                'negative'
                              );
                            });
                        })
                        .catch((error) => {
                          console.log(error);
                          this.prepareStore.notifyMessage(
                            'Ошибка получения порта',
                            'negative'
                          );
                        });
                    })
                    .catch((error) => {
                      console.log(error);
                      this.prepareStore.notifyMessage(
                        'Ошибка отмены позиции',
                        'negative'
                      );
                    });
                }
              }
            } else {
              //
              // ГОТОВО
              //
              // выбранный существующий ресурс для назначения уже есть на других компонентах
              // тогда патчим компонент в продукт оффере на resourceOrderItemId от выбранного ресурса
              // если редактируемый компонент имеет ресурс без СФР то есть до этого не был назначен из сущ рес
              // так же отменяем позицию на редактируемом компоненте и отменяем порт, то есть чистим на нем все данные связанные с ресурсом

              //
              // Не создается новая позиция для компонента,
              // а редактируется уже созданая данными выбранного существующего ресурса,
              // но не разбронируется порт который был на редактируемом компоненте
              //

              let { cprResourceOrderPoReqId, id } =
                this.orderStore.selectedOrder;

              CPR_RO_API.patch(
                `/cpr-resource-order-po-req/${cprResourceOrderPoReqId}/work-order/${id}/item/${currentItem.resourceOrderItemId}`,
                { stateId: 2 }
              )
                .then(() => {
                  MP_API.get('/mounted-port', {
                    params: {
                      cprResourceOrderItemId: currentItem.resourceOrderItemId,
                      limit: 1,
                      offset: 0,
                    },
                  })
                    .then((mPortResult) => {
                      if (mPortResult.data) {
                        MP_API.patch(
                          `/mounted-port/${mPortResult.data[0].id}`,
                          {
                            usageStateId: 1,
                            cprResourceOrderItemId: -1,
                          }
                        )
                          .then(() => {
                            MP_API.get('/mounted-port', {
                              params: {
                                compositePhysResId: resource.compositePhysResId,
                                limit: 1,
                                offset: 0,
                              },
                            })
                              .then((mPortResult) => {
                                POR_API.patch(
                                  `/po-req-item/${positionId}/po-req-item-component/${componentsIds[0]}`,
                                  {
                                    resourceOrderItemId:
                                      mPortResult.data[0]
                                        .cprResourceOrderItemId,
                                  }
                                )
                                  .then(() => {
                                    useOrderStore().getOrder(
                                      useOrderStore().selectedOrder
                                        .cprResourceOrderPoReqId,
                                      useOrderStore().selectedOrder.id
                                    );

                                    this.prepareStore.fetchProductInfo(
                                      this.orderStore.selectedOrder
                                        .productOfferRequestId,
                                      this.orderStore.selectedOrder.geoPlace.id
                                    );

                                    this.prepareStore.notifyMessage(
                                      'Успешно назначен',
                                      'positive'
                                    );
                                  })
                                  .catch((error) => {
                                    console.log(error);
                                    this.prepareStore.notifyMessage(
                                      'Ошибка назначения',
                                      'negative'
                                    );
                                  });
                              })
                              .catch((error) => {
                                usePrepareStore().notifyMessage(
                                  'Ошибка получения порта',
                                  'negative'
                                );
                                console.log(error);
                              });
                          })
                          .catch((error) => {
                            usePrepareStore().notifyMessage(
                              'Ошибка редактирования порта',
                              'negative'
                            );
                            console.log(error);
                          });
                      }
                    })
                    .catch((error) => {
                      usePrepareStore().notifyMessage(
                        'Порт не найден',
                        'negative'
                      );
                      console.log(error);
                    });
                })
                .catch((error) => {
                  usePrepareStore().notifyMessage(
                    'Ошибка отмены позиции',
                    'negative'
                  );
                  console.log(error);
                });
            }
          } else {
            // если выбранного существующего ресурса для назначения нет на других назначенных компонентах
            if (withCPR) {
              // если редактируемый компонент назначен СУЩЕСТВУЮЩИМ ресурсом
              //
              // ГОТОВО
              //
              // компонент назначен из раздела существующих, то есть у него есть СФР, тогда не нужно трогать порт,
              // делаем только редактирование позиции на новые данные из выбранного ресурса
              // и присваиваем resourceOrderItemId с выбранного сущ ресурса к компоненту из продукт оффера
              for (
                let i = 0;
                this.orderStore.selectedOrder.cprResourceOrderPoReqItems
                  .length > i;
                i++
              ) {
                if (
                  this.orderStore.selectedOrder.cprResourceOrderPoReqItems[i]
                    .compositePhysResId === currentItem.compositePhysResId
                ) {
                  POR_API.patch(
                    `/po-req-item/${positionId}/po-req-item-component/${componentsIds[0]}`,
                    {
                      resourceOrderItemId: resource.resourceOrderItemId,
                    }
                  )
                    .then(() => {
                      let { cprResourceOrderPoReqId, id } =
                        this.orderStore.selectedOrder;
                      this.prepareStore.editPosExRes({
                        cprRoPoReqId: cprResourceOrderPoReqId,
                        cprRoPoReqWoId: id,
                        cprRoPoReqWoItemId:
                          this.orderStore.selectedOrder
                            .cprResourceOrderPoReqItems[i].id,
                        compositePhysResSpecId: resource.compositePhysResSpecId,
                        physicalContainerId: resource.physicalContainerId,
                        transportCpeFuncSpecId: resource.transportCpeFuncSpecId,
                        wiringTypeId: resource.wiringTypeId,
                        compositePhysResId: resource.compositePhysResId,
                        compositePhysResNum: resource.resourceNumber,
                        compositePhysResFullNum: resource.resourceFullNumber,
                      });
                    })
                    .catch((error) => {
                      console.log(error);
                      this.prepareStore.notifyMessage(
                        'Ошибка назначения ресурса на компонент',
                        'negative'
                      );
                    });
                }
              }
            } else {
              //
              // ГОТОВО
              //
              // если редактируемый компонент назначен НОВЫМ ресурсом, тогда нужно снять порт с брони и отчистить данные
              // делаем редактирование позиции на новые данные из выбранного ресурса
              // и присваиваем resourceOrderItemId с выбранного сущ ресурса к компоненту из продукт оффера
              //
              POR_API.patch(
                `/po-req-item/${positionId}/po-req-item-component/${componentsIds[0]}`,
                {
                  resourceOrderItemId: resource.resourceOrderItemId,
                }
              )
                .then(() => {
                  MP_API.get('/mounted-port', {
                    params: {
                      cprResourceOrderItemId: currentItem.resourceOrderItemId,
                      limit: 1,
                      offset: 0,
                    },
                  })
                    .then((mPortResult) => {
                      if (mPortResult.data) {
                        MP_API.patch(
                          `/mounted-port/${mPortResult.data[0].id}`,
                          {
                            usageStateId: 1,
                            cprResourceOrderItemId: -1,
                          }
                        )
                          .then(() => {
                            let { cprResourceOrderPoReqId, id } =
                              this.orderStore.selectedOrder;
                            this.prepareStore.editPosExRes({
                              cprRoPoReqId: cprResourceOrderPoReqId,
                              cprRoPoReqWoId: id,
                              cprRoPoReqWoItemId:
                                currentItem.resourceOrderItemId,
                              compositePhysResSpecId:
                                resource.compositePhysResSpecId,
                              physicalContainerId: resource.physicalContainerId,
                              transportCpeFuncSpecId:
                                resource.transportCpeFuncSpecId,
                              wiringTypeId: resource.wiringTypeId,
                              compositePhysResId: resource.compositePhysResId,
                              compositePhysResNum: resource.resourceNumber,
                              compositePhysResFullNum:
                                resource.resourceFullNumber,
                            });
                          })
                          .catch((error) => {
                            console.log(error);
                            this.prepareStore.notifyMessage(
                              'Ошибка редактирования порта',
                              'negative'
                            );
                          });
                      }
                    })
                    .catch((error) => {
                      console.log(error);
                      this.prepareStore.notifyMessage(
                        'Ошибка получения порта',
                        'negative'
                      );
                    });
                })
                .catch((error) => {
                  console.log(error);
                  this.prepareStore.notifyMessage(
                    'Ошибка назначения ресурса на компонент',
                    'negative'
                  );
                });
            }
          }
        }
      } else {
        this.prepareStore.notifyMessage(
          'Ошибка назначения: Выбран идентичный ресурс тому что назначен на компоненте',
          'negative'
        );
      }
      this.openEditResourceForm = false;
    },

    onEditCompCrt(resource, currentItem) {
      let sameResOnOther = false; // in case if currentitem resource also active on other components, therefore no need to unbook port
      let compCPR = false; // in case if current item with cpr id
      let resCPR = false; // if resource with cpr id
      console.log('onEditCompCrt');
      console.log('resource', resource);
      console.log('currentItem', currentItem);
      for (let i = 0; this.prepareStore.preparedComponentsNew.length > i; i++) {
        if (
          currentItem.id != this.prepareStore.preparedComponentsNew[i].id &&
          currentItem.portNumber ===
            this.prepareStore.preparedComponentsNew[i].portNumber
        ) {
          sameResOnOther = true; // other component has same resource as current's edit component
        }
        if (currentItem.compositePhysResId != -1) {
          compCPR = true; // current component has port from existing resource
        }
        if (resource.compositePhysResId != -1) {
          resCPR = true; // resource has port from existing resource
        }
      }

      if (resource.portNumber != currentItem.portNumber) {
        if (sameResOnOther) {
          /*
            (sameResOnOther)
            на редактируемом компоненте назначен ресурс который есть на других компонентах
            отменять позицию не нужно
            нужно редактировать компонент
          */
          if (compCPR) {
            /*
              (compCPR)
              на компоненте назначен существующий ресурс
             */
            if (resCPR) {
              // ГОТОВО
              /*
                (compCPR, resCPR)
                назначающий ресурс из существующих
                редактируемый компонент назначен существующим
                нужнл отредактировать компонент в продукт оффере новыми данными
              */

              MP_API.get('/mounted-port', {
                params: {
                  compositePhysResId: resource.compositePhysResId,
                  limit: 1,
                  offset: 0,
                },
              }).then((mPortResult) => {
                POR_API.patch(
                  `/po-req-item/${currentItem.poReqItemId}/po-req-item-component/${currentItem.id}`,
                  {
                    resourceOrderItemId:
                      mPortResult.data[0].cprResourceOrderItemId,
                  }
                )
                  .then(() => {
                    useOrderStore().getOrder(
                      useOrderStore().selectedOrder.cprResourceOrderPoReqId,
                      useOrderStore().selectedOrder.id
                    );
                    this.prepareStore.fetchProductInfo(
                      this.orderStore.selectedOrder.productOfferRequestId,
                      this.orderStore.selectedOrder.geoPlace.id
                    );
                    this.prepareStore.notifyMessage(
                      'Успешно назначен',
                      'positive'
                    );
                  })
                  .catch((error) => {
                    console.log(error);
                    this.prepareStore.notifyMessage(
                      'Ошибка назначения ресурса на компонент',
                      'negative'
                    );
                  });
              });
            } else {
              // ГОТОВО
              /*
                (compCPR, not resCPR)
                назначающий ресурс из новых
                редактируемый компонент назначен существующим
                нужнл отредактировать компонент в продукт оффере новыми данными
              */

              POR_API.patch(
                `/po-req-item/${currentItem.poReqItemId}/po-req-item-component/${currentItem.id}`,
                {
                  resourceOrderItemId: resource.id,
                }
              )
                .then(() => {
                  useOrderStore().getOrder(
                    useOrderStore().selectedOrder.cprResourceOrderPoReqId,
                    useOrderStore().selectedOrder.id
                  );
                  this.prepareStore.fetchProductInfo(
                    this.orderStore.selectedOrder.productOfferRequestId,
                    this.orderStore.selectedOrder.geoPlace.id
                  );
                  this.prepareStore.notifyMessage(
                    'Успешно назначен',
                    'positive'
                  );
                })
                .catch((error) => {
                  console.log(error);
                  this.prepareStore.notifyMessage(
                    'Ошибка назначения ресурса на компонент',
                    'negative'
                  );
                });
            }
          } else {
            /*
              (not compCPR)
              на компоненте назначен новый ресурс
             */
            if (resCPR) {
              // ГОТОВО
              /*
                (not compCPR, resCPR)
                назначающий ресурс из существующих
                редактируемый компонент назначен новым
                далее отредактировать компонент в продукт оффере новыми данными
              */

              MP_API.get('/mounted-port', {
                params: {
                  compositePhysResId: resource.compositePhysResId,
                  limit: 1,
                  offset: 0,
                },
              }).then((mPortResult) => {
                POR_API.patch(
                  `/po-req-item/${currentItem.poReqItemId}/po-req-item-component/${currentItem.id}`,
                  {
                    resourceOrderItemId:
                      mPortResult.data[0].cprResourceOrderItemId,
                  }
                )
                  .then(() => {
                    useOrderStore().getOrder(
                      useOrderStore().selectedOrder.cprResourceOrderPoReqId,
                      useOrderStore().selectedOrder.id
                    );
                    this.prepareStore.fetchProductInfo(
                      this.orderStore.selectedOrder.productOfferRequestId,
                      this.orderStore.selectedOrder.geoPlace.id
                    );
                    this.prepareStore.notifyMessage(
                      'Успешно назначен',
                      'positive'
                    );
                  })
                  .catch((error) => {
                    console.log(error);
                    this.prepareStore.notifyMessage(
                      'Ошибка назначения ресурса на компонент',
                      'negative'
                    );
                  });
              });
            } else {
              // ГОТОВО
              /*
                (not compCPR, not resCPR)
                назначающий ресурс из новых
                редактируемый компонент назначен новым
                далее отредактировать компонент в продукт оффере новыми данными
              */

              POR_API.patch(
                `/po-req-item/${currentItem.poReqItemId}/po-req-item-component/${currentItem.id}`,
                {
                  resourceOrderItemId: resource.id,
                }
              )
                .then(() => {
                  useOrderStore().getOrder(
                    useOrderStore().selectedOrder.cprResourceOrderPoReqId,
                    useOrderStore().selectedOrder.id
                  );
                  this.prepareStore.fetchProductInfo(
                    this.orderStore.selectedOrder.productOfferRequestId,
                    this.orderStore.selectedOrder.geoPlace.id
                  );
                  this.prepareStore.notifyMessage(
                    'Успешно назначен',
                    'positive'
                  );
                })
                .catch((error) => {
                  console.log(error);
                  this.prepareStore.notifyMessage(
                    'Ошибка назначения ресурса на компонент',
                    'negative'
                  );
                });
            }
          }
        } else {
          /*
            (not sameResOnOther)
            на редактируемом компоненте назначен ресурс которого нет на других компонентах
            нужно отменить позицию
            нужно редактировать компонент
           */
          if (compCPR) {
            /*
              (compCPR)
              на компоненте назначен существующий ресурс
             */
            if (resCPR) {
              //ГОТОВО
              /*
                (compCPR, resCPR)
                назначающий ресурс из существующих
                редактируемый компонент назначен существующим и назначающий ресурс из существующих
                нужно отменить позицию на редактируемом компоненте
                далее отредактировать компонент в продукт оффере новыми данными
              */

              let { cprResourceOrderPoReqId, id } =
                this.orderStore.selectedOrder;
              for (
                let i = 0;
                this.orderStore.selectedOrder.cprResourceOrderPoReqItems
                  .length > i;
                i++
              ) {
                if (
                  this.orderStore.selectedOrder.cprResourceOrderPoReqItems[i]
                    .compositePhysResId === currentItem.compositePhysResId
                ) {
                  CPR_RO_API.patch(
                    `/cpr-resource-order-po-req/${cprResourceOrderPoReqId}/work-order/${id}/item/${this.orderStore.selectedOrder.cprResourceOrderPoReqItems[i].id}`,
                    { stateId: 2 }
                  )
                    .then(() => {
                      MP_API.get('/mounted-port', {
                        params: {
                          compositePhysResId: resource.compositePhysResId,
                          limit: 1,
                          offset: 0,
                        },
                      })
                        .then((mPortResult) => {
                          POR_API.patch(
                            `/po-req-item/${currentItem.poReqItemId}/po-req-item-component/${currentItem.id}`,
                            {
                              resourceOrderItemId:
                                mPortResult.data[0].cprResourceOrderItemId,
                            }
                          )
                            .then(() => {
                              useOrderStore().getOrder(
                                useOrderStore().selectedOrder
                                  .cprResourceOrderPoReqId,
                                useOrderStore().selectedOrder.id
                              );
                              this.prepareStore.fetchProductInfo(
                                this.orderStore.selectedOrder
                                  .productOfferRequestId,
                                this.orderStore.selectedOrder.geoPlace.id
                              );
                              this.prepareStore.notifyMessage(
                                'Успешно назначен',
                                'positive'
                              );
                            })
                            .catch((error) => {
                              console.log(error);
                              this.prepareStore.notifyMessage(
                                'Ошибка назначения ресурса на компонент',
                                'negative'
                              );
                            });
                        })
                        .catch((error) => {
                          console.log(error);
                          this.prepareStore.notifyMessage(
                            'Ошибка получения порта',
                            'negative'
                          );
                        });
                    })
                    .catch((error) => {
                      console.log(error);
                      this.prepareStore.notifyMessage(
                        'Ошибка отмены позиции',
                        'negative'
                      );
                    });
                }
              }
            } else {
              // ГОТОВО
              /*
                (compCPR, not resCPR)
                назначающий ресурс из новых
                редактируемый компонент назначен существующим и назначающий ресурс из новых
                нужно отменить позицию на редактируемом компоненте
                далее отредактировать компонент в продукт оффере новыми данными
              */

              let { cprResourceOrderPoReqId, id } =
                this.orderStore.selectedOrder;
              for (
                let i = 0;
                this.orderStore.selectedOrder.cprResourceOrderPoReqItems
                  .length > i;
                i++
              ) {
                if (
                  this.orderStore.selectedOrder.cprResourceOrderPoReqItems[i]
                    .compositePhysResId === currentItem.compositePhysResId
                ) {
                  CPR_RO_API.patch(
                    `/cpr-resource-order-po-req/${cprResourceOrderPoReqId}/work-order/${id}/item/${this.orderStore.selectedOrder.cprResourceOrderPoReqItems[i].id}`,
                    { stateId: 2 }
                  )
                    .then(() => {
                      POR_API.patch(
                        `/po-req-item/${currentItem.poReqItemId}/po-req-item-component/${currentItem.id}`,
                        {
                          resourceOrderItemId: resource.id,
                        }
                      )
                        .then(() => {
                          useOrderStore().getOrder(
                            useOrderStore().selectedOrder
                              .cprResourceOrderPoReqId,
                            useOrderStore().selectedOrder.id
                          );
                          this.prepareStore.fetchProductInfo(
                            this.orderStore.selectedOrder.productOfferRequestId,
                            this.orderStore.selectedOrder.geoPlace.id
                          );
                          this.prepareStore.notifyMessage(
                            'Успешно назначен',
                            'positive'
                          );
                        })
                        .catch((error) => {
                          console.log(error);
                          this.prepareStore.notifyMessage(
                            'Ошибка назначения ресурса на компонент',
                            'negative'
                          );
                        });
                    })
                    .catch((error) => {
                      console.log(error);
                      this.prepareStore.notifyMessage(
                        'Ошибка отмены позиции',
                        'negative'
                      );
                    });
                }
              }
            }
          } else {
            /*
              (not compCPR)
              на компоненте назначен новый ресурс
             */
            if (resCPR) {
              // ГОТОВО
              /*
                (not compCPR, resCPR)
                назначающий ресурс из существующих
                редактируемый компонент назначен новым и назначающий ресурс из существующих
                нужно отменить позицию на редактируемом компоненте
                нужно разбронировать порт
                далее отредактировать компонент в продукт оффере новыми данными существующего
                нужно найти порт и взять оттуда resourceOrderItemId чтобы назначить его на компонент
              */

              let { cprResourceOrderPoReqId, id } =
                this.orderStore.selectedOrder;

              CPR_RO_API.patch(
                `/cpr-resource-order-po-req/${cprResourceOrderPoReqId}/work-order/${id}/item/${currentItem.resourceOrderItemId}`,
                { stateId: 2 }
              )
                .then(() => {
                  MP_API.get('/mounted-port', {
                    params: {
                      cprResourceOrderItemId: currentItem.resourceOrderItemId,
                      limit: 1,
                      offset: 0,
                    },
                  })
                    .then((mPortResult) => {
                      if (mPortResult.data) {
                        MP_API.patch(
                          `/mounted-port/${mPortResult.data[0].id}`,
                          {
                            usageStateId: 1,
                            cprResourceOrderItemId: -1,
                          }
                        )
                          .then(() => {
                            MP_API.get('/mounted-port', {
                              params: {
                                compositePhysResId: resource.compositePhysResId,
                                limit: 1,
                                offset: 0,
                              },
                            }).then((mPortResult) => {
                              POR_API.patch(
                                `/po-req-item/${currentItem.poReqItemId}/po-req-item-component/${currentItem.id}`,
                                {
                                  resourceOrderItemId:
                                    mPortResult.data[0].cprResourceOrderItemId,
                                }
                              )
                                .then(() => {
                                  useOrderStore().getOrder(
                                    useOrderStore().selectedOrder
                                      .cprResourceOrderPoReqId,
                                    useOrderStore().selectedOrder.id
                                  );
                                  this.prepareStore.fetchProductInfo(
                                    this.orderStore.selectedOrder
                                      .productOfferRequestId,
                                    this.orderStore.selectedOrder.geoPlace.id
                                  );
                                  this.prepareStore.notifyMessage(
                                    'Успешно назначен',
                                    'positive'
                                  );
                                })
                                .catch((error) => {
                                  console.log(error);
                                  this.prepareStore.notifyMessage(
                                    'Ошибка назначения ресурса на компонент',
                                    'negative'
                                  );
                                });
                            });
                          })
                          .catch((error) => {
                            console.log(error);
                            this.prepareStore.notifyMessage(
                              'Ошибка редактирования порта',
                              'negative'
                            );
                          });
                      }
                    })
                    .catch((error) => {
                      console.log(error);
                      this.prepareStore.notifyMessage(
                        'Ошибка получения порта',
                        'negative'
                      );
                    });
                })
                .catch((error) => {
                  console.log(error);
                  this.prepareStore.notifyMessage(
                    'Ошибка отмены позиции',
                    'negative'
                  );
                });
            } else {
              // ГОТОВО
              /*
                (not compCPR, not resCPR)
                назначающий ресурс из новых
                редактируемый компонент назначен новым
                нужно отменить позицию на редактируемом компоненте
                нужно разбронировать порт
                далее отредактировать компонент в продукт оффере новыми данными
              */

              let { cprResourceOrderPoReqId, id } =
                this.orderStore.selectedOrder;

              CPR_RO_API.patch(
                `/cpr-resource-order-po-req/${cprResourceOrderPoReqId}/work-order/${id}/item/${currentItem.resourceOrderItemId}`,
                { stateId: 2 }
              )
                .then(() => {
                  MP_API.get('/mounted-port', {
                    params: {
                      cprResourceOrderItemId: currentItem.resourceOrderItemId,
                      limit: 1,
                      offset: 0,
                    },
                  })
                    .then((mPortResult) => {
                      if (mPortResult.data) {
                        MP_API.patch(
                          `/mounted-port/${mPortResult.data[0].id}`,
                          {
                            usageStateId: 1,
                            cprResourceOrderItemId: -1,
                          }
                        )
                          .then(() => {
                            POR_API.patch(
                              `/po-req-item/${currentItem.poReqItemId}/po-req-item-component/${currentItem.id}`,
                              {
                                resourceOrderItemId: resource.id,
                              }
                            )
                              .then(() => {
                                useOrderStore().getOrder(
                                  useOrderStore().selectedOrder
                                    .cprResourceOrderPoReqId,
                                  useOrderStore().selectedOrder.id
                                );
                                this.prepareStore.fetchProductInfo(
                                  this.orderStore.selectedOrder
                                    .productOfferRequestId,
                                  this.orderStore.selectedOrder.geoPlace.id
                                );
                                this.prepareStore.notifyMessage(
                                  'Успешно назначен',
                                  'positive'
                                );
                              })
                              .catch((error) => {
                                console.log(error);
                                this.prepareStore.notifyMessage(
                                  'Ошибка назначения ресурса на компонент',
                                  'negative'
                                );
                              });
                          })
                          .catch((error) => {
                            console.log(error);
                            this.prepareStore.notifyMessage(
                              'Ошибка редактирования порта',
                              'negative'
                            );
                          });
                      }
                    })
                    .catch((error) => {
                      console.log(error);
                      this.prepareStore.notifyMessage(
                        'Ошибка получения порта',
                        'negative'
                      );
                    });
                })
                .catch((error) => {
                  console.log(error);
                  this.prepareStore.notifyMessage(
                    'Ошибка отмены позиции',
                    'negative'
                  );
                });
            }
          }
        }
      } else {
        this.prepareStore.notifyMessage(
          'Ошибка назначения: Выбран идентичный ресурс тому что назначен на компоненте',
          'negative'
        );
      }
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
        console.log('unBookPort', unBookPort);
        this.orderStore.patchWorkOrderItem(
          this.orderStore.selectedOrder.cprResourceOrderPoReqId,
          this.orderStore.selectedOrder.id,
          tickedElement.resourceOrderItemId,
          2,
          tickedElement.poReqItemId,
          tickedElement.id,
          unBookPort,
          tickedElement.compositePhysResId
        );
      });
      this.tickedNodes = [];
    },
    onConfirm() {
      Dialog.create({
        title: 'Ошибка',
        message: 'Заказ не выбран, вернуться к странице заказов?',
        cancel: true,
        persistent: true,
      })
        .onOk(() => {
          this.router.push('/');
        })
        .onOk(() => {
          // console.log('>>> second OK catcher')
        })
        .onCancel(() => {
          // console.log('>>>> Cancel')
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
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
