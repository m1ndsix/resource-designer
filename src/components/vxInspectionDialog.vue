<template>
  <q-card style="max-width: 1000px">
    <q-card-section class="row">
      <div class="text-h6">Обследовать</div>
      <q-space />
      <q-btn icon="close" flat round dense v-close-popup />
    </q-card-section>
    <q-card-section>
      <q-select
        style="width: 250px"
        v-model="state.selectedUser"
        :options="state.users"
        option-label="name"
        option-value="employeeId"
        label="Сотрудник"
      >
      </q-select>
      <q-input
        style="width: 500px"
        v-model="state.note"
        filled
        clearable
        type="textarea"
        label="Введите примечание"
      />
    </q-card-section>
    <q-separator />

    <q-card-actions align="right">
      <q-btn
        color="positive"
        label="Отправить"
        v-close-popup
        @click="requestTechInspection()"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue';
import { useOrderStore } from 'stores/order';

const orderStore = useOrderStore();

interface State {
  users: Employee[];
  selectedUser: Employee | null;
  note: string | null;
}
interface Employee {
  name: string;
  employeeId: number;
}
const initialState: State = {
  users: [],
  selectedUser: null,
  note: null,
};
const state: State = reactive(initialState);

onMounted(() => {
  orderStore.fetchInspectors('japparov.s@telecom.kz').then(({ data }) => {
    state.users = data;
  });
});

function requestTechInspection() {
  if (orderStore.selectedOrder && state.note && state.selectedUser) {
    orderStore.requestTechInspection(
      orderStore.selectedOrder.id,
      state.selectedUser.employeeId,
      state.note
    );
  }
}
</script>

<style lang="sass" scoped></style>
