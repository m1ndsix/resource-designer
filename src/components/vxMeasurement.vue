<template>
  <q-card style="max-width: 1000px">
    <q-card-section class="row">
      <div class="text-h6">Измеритель</div>
      <q-space />
      <q-btn icon="close" flat round dense v-close-popup />
    </q-card-section>
    <q-card-section>
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
        @click="sendMeasurement"
        v-close-popup
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { usePrepareStore } from '../stores/prepare';
import { useOrderStore } from 'stores/order';
import { Notify } from 'quasar';

const prepareStore = usePrepareStore();
const orderStore = useOrderStore();

interface State {
  note: string | null;
}
const initialState: State = {
  note: null,
};
const state: State = reactive(initialState);

interface Props {
  cprResourceOrderItemIds: { cprResourceOrderItemId: number }[];
}
const props = withDefaults(defineProps<Props>(), {
  cprResourceOrderItemIds: () => [],
});

function sendMeasurement() {
  if (state.note && prepareStore.poRequest?.id) {
    prepareStore.sendMeasurement(
      orderStore.selectedOrder.id,
      128,
      'EMPLOYEE_MEASURER',
      state.note,
      props.cprResourceOrderItemIds
    );
  }

  function measurementNotify() {
    if (prepareStore.measurementResponse.errCode == 0) {
      prepareStore.notifyMessage(
        'Поручение на измерение отправлено',
        'positive'
      );
    } else {
      prepareStore.notifyMessage(
        'Ошибка:' + prepareStore.measurementResponse.errMsg,
        'negative'
      );
    }
  }
  setTimeout(() => {
    measurementNotify();
  }, 2000);
}
</script>

<style lang="sass" scoped></style>
