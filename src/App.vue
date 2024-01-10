<template>
  <q-layout view="hhh lpr fff">
    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-btn flat to="/" label="Resource Designer" />
        <q-separator dark vertical inset />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts"></script>
