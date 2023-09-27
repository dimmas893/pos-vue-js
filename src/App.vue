<template>
  <!-- <indexBE /> -->
  <!-- <Sidebar @toggle-sidebar="toggleSidebar" /> -->
  <!-- <div class="loading"></div> -->
  <router-view />
</template>
<script>
import indexBE from "./components/componentBE/template/Index.vue";
export default {
  name: "App",
  components: {
    indexBE,
  },
};
</script>
<style>
.active-link {
  width: 230px;
  background-color: #dfe3ec;
  color: #fff;
}
.active-link:hover {
  width: 230px; /* Ini untuk menghapus garis bawah pada tautan saat di-hover */
  border-radius: 7px;
}
.sidebar-item:hover {
  width: 230px;
  border-radius: 7px;
  /* Properti lain sesuai kebutuhan Anda */
}
</style>
