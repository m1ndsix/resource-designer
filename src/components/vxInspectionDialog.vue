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
      <q-btn color="positive" label="Отправить" />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { reactive } from 'vue';

interface State {
  users: string[];
  selectedUser: string | null;
  note: string | null;
}
const initialState: State = {
  users: ['Иванов', 'Александров', 'Николаев'],
  selectedUser: null,
  note: null,
};
const state: State = reactive(initialState);
</script>

<style lang="sass" scoped></style>
