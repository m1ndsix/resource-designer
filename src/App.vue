<template>
  <q-layout view="hhh lpr fff">
    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-btn flat to="/" label="Resource Designer" />
        <q-separator dark vertical inset />
        <q-space></q-space>
        <div>{{ $keycloak.userName }}</div>
        <q-btn
          color="white"
          flat
          size="md"
          @click="$keycloak.logoutFn()"
          icon="logout"
          >Выход</q-btn
        >
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup></script>
