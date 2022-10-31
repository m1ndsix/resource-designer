import { faker } from '@faker-js/faker/locale/ru';

let data = { 'cpr-resource-order-manual': [], 'product-offer-request': null };
// Create 20 orders
for (let i = 0; i < 20; i++) {
  let randomNumber = faker.random.numeric(6);
  let randomDate = faker.date.between(
    '2020-01-01T00:00:00.000Z',
    '2022-01-01T00:00:00.000Z'
  );
  let randomName = faker.name.fullName();
  data['cpr-resource-order-manual'].push({
    id: i,
    externalId: randomNumber,
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

console.log(JSON.stringify(data));
