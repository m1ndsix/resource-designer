import { faker } from '@faker-js/faker/locale/ru';

let data = {
  'cpr-resource-order-manual': [],
  'product-offer-request': [],
  'po-req-item': {
    productOfferWithGeneralGeoPlace: [],
    productOfferWithP2PGeoPlace: [],
  },
};
// Create 20 orders
for (let i = 0; i < 20; i++) {
  let randomDate = faker.date.between(
    '2020-01-01T00:00:00.000Z',
    '2022-01-01T00:00:00.000Z'
  );
  let randomName = faker.name.fullName();
  data['cpr-resource-order-manual'].push({
    id: i,
    externalId: 123,
    productOfferRequestId: 50000 + i,
    stateId: 1,
    stateData: { id: 1, name: 'Новый' },
    expectedCompletionDate: null,
    completionDate: null,
    rejectReasonID: 0,
    rejectReasonData: {
      id: 0,
      nameRu: 'Не определено',
      nameKz: 'Не определено',
    },
    rejectDate: randomDate,
    items: [
      {
        id: i + 5,
        actionId: 1,
        actionData: { id: 1, name: 'Установка' },
        stateId: 4,
        stateData: { id: 4, name: 'Ресурс забронирован' },
        externalId: 999,
        compositePhysResSpecId: 7,
        physicalContainerId: 7,
        geoPlaceId: 7,
        transportCpeFuncSpecId: 7,
        externalProjectId: 7,
        externalCompositePhysResNum: 7,
        processUserId: 7,
        processDate: randomDate,
        createDate: randomDate,
        updateDate: randomDate,
        createUser: 'root user',
        updateUser: 'root user',
        createApp: 'dev app',
        updateApp: 'dev app',
      },
    ],
    createDate: randomDate,
    updateDate: randomDate,
    createUser: randomName,
    updateUser: randomName,
    createApp: 'dev app',
    updateApp: 'dev app',
  });
  data['product-offer-request'].push({
    id: 50000 + i,
    divisionId: 123,
    poReqStatusId: 1,
    poReqStatus: { name_ru: 'Новый' },
    resourceOrderId: 123,
    partyId: 123,
    commChannelId: 123,
    identificationNumber: '123',
    contactName: randomName,
    contactNumber: +77074753324,
    salesChannelId: 123,
    description: 'Тестовый заказ',
    createDate: randomDate,
    updateDate: randomDate,
    createUser: randomDate,
    updateUser: randomDate,
    createApp: randomDate,
    updateApp: randomDate,
  });
}
for (let j = 1; j < 4; j++) {
  let geoPlaceIdOne = faker.random.numeric(6);
  let geoPlaceIdTwo = faker.random.numeric(6);
  let geoPlaceIdThree = faker.random.numeric(6);
  let geoPlaceIdFour = faker.random.numeric(6);
  let geoPlaceNameOne = faker.address.streetAddress(true);
  let geoPlaceNameTwo = faker.address.streetAddress(true);
  let geoPlaceNameThree = faker.address.streetAddress(true);
  let geoPlaceNameFour = faker.address.streetAddress(true);

  let randomDate = faker.date.between(
    '2020-01-01T00:00:00.000Z',
    '2022-01-01T00:00:00.000Z'
  );
  let adressesGeneral = [
    'г.Алматы, мкр.Самал-2, 64, 1',
    'г.Алматы, ул.Абая, 53/б, 5',
    'г.Алматы, мкр.Орбита-4, 9, 29',
  ];
  let adressesP2P = [
    'г.Астана, мкр.Коктем-2, 6А, 403 - г.Алматы, мкр.Самал-2, 64, 1',
    'г.Астана, ул.Абылай Хана, 7, 15 - г.Алматы, ул.Абая, 53/б, 5',
    'г.Астана, мкр.Республики, 21, 112- г.Алматы, мкр.Орбита-4, 9, 29',
  ];

  let componentsOne = [
    {
      id: 70000 + j,
      typeId: j >= 1 && j <= 3 ? j : 3,
      type: {
        id: j >= 1 && j <= 3 ? j : 3,
        nameRu: j === 1 ? 'Установка' : j === 2 ? 'Замена' : 'Снятие',
        nameKz: j === 1 ? 'Установка' : j === 2 ? 'Замена' : 'Снятие',
      },
      poReqItemId: 60000 + j,
      geoPlaceId: j % 2 === 0 ? geoPlaceIdOne : geoPlaceIdTwo,
      geoPlaceName: j % 2 === 0 ? geoPlaceNameOne : geoPlaceNameTwo,
      poComponentId: 1234,
      poComponentName: 'iD TV с Элитным пакетом каналов дополнительный',
      oldPoStructId: 1234,
      oldPoStructName: 'test',
      newPoStructId: 4321,
      newPoStructName: 'test',
      resourceOrderItemId: 1234,
      oldNumber: '870762239094',
      newNumber: '877713535433',
      oldCount: 1234,
      newCount: 1234,
      elements: 1234,
      createDate: randomDate,
      updateDate: randomDate,
      createUser: randomDate,
      updateUser: randomDate,
      createApp: randomDate,
      updateApp: randomDate,
    },
    {
      id: 70001 + j,
      typeId: j >= 1 && j <= 3 ? j : 3,
      type: {
        id: j >= 1 && j <= 3 ? j : 3,
        nameRu: j === 1 ? 'Установка' : j === 2 ? 'Замена' : 'Снятие',
        nameKz: j === 1 ? 'Установка' : j === 2 ? 'Замена' : 'Снятие',
      },
      poReqItemId: 60000 + j,
      geoPlaceId: j % 2 === 0 ? geoPlaceIdOne : geoPlaceIdTwo,
      geoPlaceName: j % 2 === 0 ? geoPlaceNameOne : geoPlaceNameTwo,
      poComponentId: 1234,
      poComponentName: 'iD TV с Элитным пакетом каналов дополнительный',
      oldPoStructId: 1234,
      oldPoStructName: 'test',
      newPoStructId: 4321,
      newPoStructName: 'test',
      resourceOrderItemId: 1234,
      oldNumber: '870762239094',
      newNumber: '877713535433',
      oldCount: 1234,
      newCount: 1234,
      elements: 1234,
      createDate: randomDate,
      updateDate: randomDate,
      createUser: randomDate,
      updateUser: randomDate,
      createApp: randomDate,
      updateApp: randomDate,
    },
  ];
  let componentsTwo = [
    {
      id: 80000 + j,
      typeId: j >= 1 && j <= 3 ? j : 3,
      type: {
        id: j >= 1 && j <= 3 ? j : 3,
        nameRu: j === 1 ? 'Установка' : j === 2 ? 'Замена' : 'Снятие',
        nameKz: j === 1 ? 'Установка' : j === 2 ? 'Замена' : 'Снятие',
      },
      poReqItemId: 60000 + j,
      geoPlaceId: j % 2 === 0 ? geoPlaceIdThree : geoPlaceIdFour,
      geoPlaceName: j % 2 === 0 ? geoPlaceNameThree : geoPlaceNameFour,
      poComponentId: 1234,
      poComponentName: 'iD TV с Элитным пакетом каналов дополнительный',
      oldPoStructId: 1234,
      oldPoStructName: 'test',
      newPoStructId: 4321,
      newPoStructName: 'test',
      resourceOrderItemId: 1234,
      oldNumber: '870762239094',
      newNumber: '877713535433',
      oldCount: 1234,
      newCount: 1234,
      elements: 1234,
      createDate: randomDate,
      updateDate: randomDate,
      createUser: randomDate,
      updateUser: randomDate,
      createApp: randomDate,
      updateApp: randomDate,
    },
    {
      id: 70001 + j,
      typeId: j >= 1 && j <= 3 ? j : 3,
      type: {
        id: j >= 1 && j <= 3 ? j : 3,
        nameRu: j === 1 ? 'Установка' : j === 2 ? 'Замена' : 'Снятие',
        nameKz: j === 1 ? 'Установка' : j === 2 ? 'Замена' : 'Снятие',
      },
      poReqItemId: 60000 + j,
      geoPlaceId: j % 2 === 0 ? geoPlaceIdThree : geoPlaceIdFour,
      geoPlaceName: j % 2 === 0 ? geoPlaceNameThree : geoPlaceNameFour,
      poComponentId: 1234,
      poComponentName: 'iD TV с Элитным пакетом каналов дополнительный',
      oldPoStructId: 1234,
      oldPoStructName: 'test',
      newPoStructId: 4321,
      newPoStructName: 'test',
      resourceOrderItemId: 1234,
      oldNumber: '870762239094',
      newNumber: '877713535433',
      oldCount: 1234,
      newCount: 1234,
      elements: 1234,
      createDate: randomDate,
      updateDate: randomDate,
      createUser: randomDate,
      updateUser: randomDate,
      createApp: randomDate,
      updateApp: randomDate,
    },
  ];

  data['po-req-item']['productOfferWithGeneralGeoPlace'].push({
    id: 10000 + j,
    nameRu: adressesGeneral[j - 1],
    productOfferReqItems: [
      {
        id: 60000 + j,
        typeId: j >= 1 && j <= 3 ? j : 3,
        type: {
          id: j >= 1 && j <= 3 ? j : 3,
          nameRu: j === 1 ? 'Установка' : j === 2 ? 'Замена' : 'Снятие',
          nameKz: j === 1 ? 'Установка' : j === 2 ? 'Замена' : 'Снятие',
        },
        productOfferReqId: 50000 + j,
        geoPlaceId: j % 2 === 0 ? geoPlaceIdThree : geoPlaceIdFour,
        geoPlaceName: j % 2 === 0 ? geoPlaceNameThree : geoPlaceNameFour,
        oldProductOfferId: 1234,
        oldProductOfferName:
          j % 2 === 0 ? 'Silver LTE Prome Kcell(1 год)' : null,
        newProductOfferId: 4321,
        newProductOfferName: 'Light LTE Prome Kcell(1 год)',
        caSubscriptionId: 123,
        agreementId: 123,
        billingAccountId: 123,
        createDate: randomDate,
        updateDate: randomDate,
        createUser: randomDate,
        updateUser: randomDate,
        createApp: randomDate,
        updateApp: randomDate,
        itemComponents: componentsOne,
      },
    ],
  });
  data['po-req-item']['productOfferWithP2PGeoPlace'].push({
    id: 20000 + j,
    nameRu: adressesP2P[j - 1],
    productOfferReqItems: [
      {
        id: 80000 + j,
        typeId: j >= 1 && j <= 3 ? j : 3,
        type: {
          id: j >= 1 && j <= 3 ? j : 3,
          nameRu: j === 1 ? 'Установка' : j === 2 ? 'Замена' : 'Снятие',
          nameKz: j === 1 ? 'Установка' : j === 2 ? 'Замена' : 'Снятие',
        },
        productOfferReqId: 50000 + j,
        geoPlaceId: j % 2 === 0 ? geoPlaceIdOne : geoPlaceIdTwo,
        geoPlaceName: j % 2 === 0 ? geoPlaceNameOne : geoPlaceNameTwo,
        oldProductOfferId: 1234,
        oldProductOfferName:
          j % 2 === 0 ? 'Silver LTE Prome Kcell(1 год)' : null,
        newProductOfferId: 4321,
        newProductOfferName: 'Light LTE Prome Kcell(1 год)',
        caSubscriptionId: 123,
        agreementId: 123,
        billingAccountId: 123,
        createDate: randomDate,
        updateDate: randomDate,
        createUser: randomDate,
        updateUser: randomDate,
        createApp: randomDate,
        updateApp: randomDate,
        itemComponents: componentsTwo,
      },
    ],
  });
}

console.log(JSON.stringify(data));
