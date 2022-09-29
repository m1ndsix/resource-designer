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
        <q-list v-for="pos in positions" :key="pos.id">
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
          >
            <q-tabs
              v-model="currentComponent"
              vertical
              align="left"
              class="text-primary"
              v-for="com in components"
              :key="com.id"
            >
              <q-tab :name="com.id" :label="'Компонент (ID): ' + com.id">
                <div
                  style="
                    font-size: 0.75rem;
                    text-transform: none;
                    color: rgba(0, 0, 0, 0.54);
                  "
                >
                  Тип: {{ com.type.name_ru }}
                </div>
              </q-tab>
            </q-tabs>
          </q-expansion-item>
        </q-list>
      </div>
      <q-separator vertical />
      <div class="col">
        <q-tab-panels
          v-model="currentComponent"
          animated
          swipeable
          vertical
          transition-prev="jump-up"
          transition-next="jump-up"
        >
          <q-tab-panel v-for="com in components" :name="com.id" :key="com.id">
            <q-form @submit="onSubmit" @reset="onReset">
              <div class="row flex-center">
                <div class="col-auto">
                  <q-btn
                    round
                    size="sm"
                    icon="add"
                    color="primary"
                    title="Новая Позиция"
                  />
                </div>
                <div class="col q-ml-sm">
                  <q-select
                    style="width: 250px"
                    size="sm"
                    v-model="selectedPosOption"
                    :options="posOptions"
                    label="Доступные позиции"
                  />
                </div>
              </div>
              <q-select
                style="width: 250px"
                v-model="selectedPosOption"
                :options="posOptions"
                label="Выбор Спецификации"
              />
              <div class="row">
                <div class="col-auto">
                  <q-select
                    style="width: 250px"
                    v-model="selectedPosOption"
                    :options="posOptions"
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
                    v-model="selectedPosOption"
                    :options="posOptions"
                    label="Выбор Порта"
                  />
                </div>
                <q-space />
                <div class="col-auto">
                  <q-btn label="Подготовить" type="submit" color="primary" />
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
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    return {
      splitterModel: ref(30),
    };
  },
  data() {
    return {
      selectedPosOption: null,
      posOptions: ['1', '2', '3'],
      order: {
        id: 19593,
        poReqStatusId: 1,
        poReqStatus: {
          id: 1,
          name_ru: 'Новый',
          name_kz: 'Новый',
        },
        resourceOrderId: 0,
        partyId: 809185,
        commChannelId: 5,
        divisionId: 1,
        contactNumber: '7777777777',
        contactName: 'test',
        identificationNumber: '900408400706',
        salesChannelId: 105,
        externalId: 'l77czzl2',
        description: 'qwerty',
        createDate: '2022-08-24T08:33:26.000Z',
        updateDate: '2022-08-24T08:33:26.000Z',
        createUser: 'CRM',
        updateUser: 'CRM',
        createApp: 'CRM',
        updateApp: 'CRM',
      },
      positions: [
        {
          id: 36,
          typeId: 1,
          type: {
            id: 1,
            name_ru: 'Установка',
            name_kz: 'Установка',
          },
          productOfferReqId: 19593,
          geoPlaceId: 641475,
          oldProductOfferId: -1,
          newProductOfferId: 30598,
          caSubscriptionId: -1,
          createDate: '2022-08-24T08:35:30.697Z',
          updateDate: '2022-08-24T08:35:30.697Z',
          createUser: 'CRM',
          updateUser: 'CRM',
          createApp: 'CRM',
          updateApp: 'CRM',
        },
        {
          id: 37,
          typeId: 1,
          type: {
            id: 1,
            name_ru: 'Установка',
            name_kz: 'Установка',
          },
          productOfferReqId: 19593,
          geoPlaceId: 641475,
          oldProductOfferId: -1,
          newProductOfferId: 33801,
          caSubscriptionId: -1,
          createDate: '2022-09-07T04:00:29.827Z',
          updateDate: '2022-09-07T04:00:29.827Z',
          createUser: 'CRM',
          updateUser: 'CRM',
          createApp: 'CRM',
          updateApp: 'CRM',
        },
        {
          id: 38,
          typeId: 1,
          type: {
            id: 1,
            name_ru: 'Установка',
            name_kz: 'Установка',
          },
          productOfferReqId: 19593,
          geoPlaceId: 641475,
          oldProductOfferId: -1,
          newProductOfferId: 33763,
          caSubscriptionId: -1,
          createDate: '2022-09-07T04:06:58.220Z',
          updateDate: '2022-09-07T04:06:58.220Z',
          createUser: 'CRM',
          updateUser: 'CRM',
          createApp: 'CRM',
          updateApp: 'CRM',
        },
        {
          id: 39,
          typeId: 1,
          type: {
            id: 1,
            name_ru: 'Установка',
            name_kz: 'Установка',
          },
          productOfferReqId: 19593,
          geoPlaceId: 1112087,
          oldProductOfferId: -1,
          newProductOfferId: 30598,
          caSubscriptionId: -1,
          createDate: '2022-09-07T12:38:01.734Z',
          updateDate: '2022-09-07T12:38:01.734Z',
          createUser: 'CRM',
          updateUser: 'CRM',
          createApp: 'CRM',
          updateApp: 'CRM',
        },
      ],
      currentComponent: null,
      components: [
        {
          id: 58,
          typeId: 1,
          type: {
            id: 1,
            name_ru: 'Установка',
            name_kz: 'Установка',
          },
          poReqItemId: '38',
          geoPlaceId: 641475,
          poComponentId: 1031076,
          oldPoStructId: -1,
          newPoStructId: 0,
          resourceOrderItemId: -1,
          agreementId: -1,
          billingAccountId: -1,
          createDate: '2022-09-07T04:06:58.220Z',
          updateDate: '2022-09-07T04:06:58.220Z',
          createUser: 'CRM',
          updateUser: 'CRM',
          createApp: 'CRM',
          updateApp: 'CRM',
        },
        {
          id: 59,
          typeId: 1,
          type: {
            id: 1,
            name_ru: 'Установка',
            name_kz: 'Установка',
          },
          poReqItemId: '38',
          geoPlaceId: 641475,
          poComponentId: 1031076,
          oldPoStructId: -1,
          newPoStructId: 0,
          resourceOrderItemId: -1,
          agreementId: -1,
          billingAccountId: -1,
          createDate: '2022-09-07T04:06:58.220Z',
          updateDate: '2022-09-07T04:06:58.220Z',
          createUser: 'CRM',
          updateUser: 'CRM',
          createApp: 'CRM',
          updateApp: 'CRM',
        },
        {
          id: 60,
          typeId: 1,
          type: {
            id: 1,
            name_ru: 'Установка',
            name_kz: 'Установка',
          },
          poReqItemId: '38',
          geoPlaceId: 641475,
          poComponentId: 1031076,
          oldPoStructId: -1,
          newPoStructId: 0,
          resourceOrderItemId: -1,
          agreementId: -1,
          billingAccountId: -1,
          createDate: '2022-09-07T04:06:58.220Z',
          updateDate: '2022-09-07T04:06:58.220Z',
          createUser: 'CRM',
          updateUser: 'CRM',
          createApp: 'CRM',
          updateApp: 'CRM',
        },
      ],
    };
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
