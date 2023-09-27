<template>
  <div class="container">
    <div class="row">
      <div class="col-6">
        <router-link to="/login">Login</router-link>
      </div>
      <div class="col-6">
        <router-link to="/admin/dashboard">dashboard</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "homeView",
};
</script>
