<template>
  <q-layout view="hhh lpr fff">
    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-btn flat to="/" label="Design Manager" />
        <q-separator dark vertical inset />
        <q-tabs>
          <q-route-tab to="/edit-item" label="Редактирование позиции" />
        </q-tabs>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts"></script>
