<template>
  <div
    class="page-wrapper"
    id="main-wrapper"
    :data-layout="isMobile ? 'horizontal' : 'vertical'"
    :data-navbarbg="isMobile ? 'skin6' : 'skin7'"
    :data-sidebartype="isMobile ? 'mini-sidebar' : 'full'"
    :data-sidebar-position="isMobile ? 'fixed' : 'static'"
    :data-header-position="isMobile ? 'static' : 'fixed'">
    <div v-if="showTooltip" ref="tooltip">
      <!-- Sidebar Start -->
      <aside class="left-sidebar">
        <!-- Sidebar scroll-->
        <div class="sidenav">
          <div
            class="brand-logo d-flex align-items-center justify-content-between">
            <a href="#" class="text-nowrap logo-img">
              <img
                src="../../../assets/template/images/logos/dark-logo.svg"
                width="180"
                alt="" />
            </a>
            <div
              class="close-btn d-xl-none d-block sidebartoggler cursor-pointer"
              @click="toggleSidebar"
              id="sidebarCollapse">
              <i class="ti ti-x fs-8"></i>
            </div>
          </div>
          <!-- Sidebar navigation-->
          <nav class="sidebar-nav scroll-sidebar" data-simplebar="">
            <ul id="sidebarnav">
              <li class="nav-small-cap">
                <i class="ti ti-dots nav-small-cap-icon fs-4"></i>
                <span class="hide-menu">Home</span>
              </li>
              <li class="sidebar-item">
                <router-link
                  class="sidebar-link"
                  to="/admin/dashboard"
                  exact
                  aria-expanded="false"
                  active-class="active-link">
                  <span>
                    <i class="ti ti-layout-dashboard"></i>
                  </span>
                  <span class="hide-menu">Dashboard</span>
                </router-link>
              </li>
              <li class="nav-small-cap">
                <i class="ti ti-dots nav-small-cap-icon fs-4"></i>
                <span class="hide-menu">CMS</span>
              </li>
              <li class="sidebar-item">
                <router-link
                  class="sidebar-link"
                  to="/admin/product"
                  exact
                  aria-expanded="false"
                  active-class="active-link">
                  <span class="custom-icon">
                    <!-- Langkah 1: Tambahkan kelas CSS -->
                    <i class="bi bi-card-heading"></i>
                  </span>
                  <span class="hide-menu">Product</span>
                </router-link>
              </li>
              <li class="sidebar-item">
                <router-link
                  class="sidebar-link"
                  to="/admin/category"
                  exact
                  aria-expanded="false"
                  active-class="active-link">
                  <span class="custom-icon">
                    <i class="bi bi-c-circle"></i>
                  </span>
                  <span class="hide-menu">Category</span>
                </router-link>
              </li>
              <li class="nav-small-cap">
                <i class="ti ti-dots nav-small-cap-icon fs-4"></i>
                <span class="hide-menu">HISTORY</span>
              </li>
              <li class="sidebar-item">
                <router-link
                  class="sidebar-link"
                  to="/admin/transaction"
                  exact
                  aria-expanded="false"
                  active-class="active-link">
                  <span class="custom-icon">
                    <i class="bi bi-journal-bookmark"></i>
                  </span>
                  <span class="hide-menu">Transaction</span>
                </router-link>
              </li>

              <li class="nav-small-cap">
                <i class="ti ti-dots nav-small-cap-icon fs-4"></i>
                <span class="hide-menu">POS</span>
              </li>

              <li class="sidebar-item">
                <router-link
                  class="sidebar-link"
                  to="/admin/aplikasi"
                  exact
                  aria-expanded="false"
                  active-class="active-link">
                  <span class="custom-icon">
                    <i class="bi bi-display"></i>
                  </span>
                  <span class="hide-menu">Aplikasi</span>
                </router-link>
              </li>
            </ul>
          </nav>
          <!-- End Sidebar navigation -->
        </div>
        <!-- End Sidebar scroll-->
      </aside>
      <!--  Sidebar End -->
    </div>
    <!--  Main wrapper -->

    <div class="body-wrapper">
      <div :class="{ 'fixed-top': isMobile }">
        <header class="app-header">
          <nav class="navbar navbar-expand-lg navbar-light">
            <ul class="navbar-nav">
              <li class="nav-item d-block d-xl-none">
                <a
                  class="nav-link nav-icon-hover"
                  id="headerCollapse"
                  href="javascript:void(0)"
                  @click="toggleTooltip">
                  <i :class="showTooltip ? 'bi bi-x-lg' : 'ti ti-menu-2'"></i>
                </a>

                <!-- <button ref="button" @click="toggleTooltip">Toggle Tooltip</button> -->
              </li>
              <!-- <li class="nav-item">
                <a class="nav-link nav-icon-hover" href="javascript:void(0)">
                  <i class="ti ti-bell-ringing"></i>
                  <div class="notification bg-primary rounded-circle"></div>
                </a>
              </li> -->
            </ul>
            <div
              class="navbar-collapse justify-content-end px-0"
              id="navbarNav">
              <ul
                class="navbar-nav flex-row ms-auto align-items-center justify-content-end">
                {{
                  user.name
                }}
                <li class="nav-item dropdown">
                  <a
                    class="nav-link nav-icon-hover"
                    href="javascript:void(0)"
                    id="drop2"
                    data-bs-toggle="dropdown"
                    aria-expanded="false">
                    <img
                      src="../../../assets/template/images/profile/user-1.jpg"
                      alt=""
                      width="35"
                      height="35"
                      class="rounded-circle" />
                  </a>
                  <div
                    class="dropdown-menu dropdown-menu-end dropdown-menu-animate-up"
                    aria-labelledby="drop2">
                    <div class="message-body">
                      <a
                        class="btn btn-outline-danger mx-3 mt-2 d-block"
                        @click="logout"
                        >Logout
                      </a>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </nav>
        </header>
      </div>
      <div class="container-fluid">
        <div class="content">
          <RouterView />
        </div>
      </div>
    </div>
  </div>
</template>
<style>
/* CSS Anda yang sudah ada */

/* Tambahkan CSS berikut untuk padding hanya pada mode mobile */
@media (max-width: 768px) {
  .content {
    padding-top: 60px;
  }
}
.custom-icon {
  font-size: 20px; /* Ganti dengan ukuran yang Anda inginkan */
}
</style>
<script>
import axios from "axios";

export default {
  data() {
    return {
      isMobile: window.innerWidth <= 768,
      showTooltip: false,
      popperInstance: null,
      isLoading: false,
      fullPage: true,
      // State loggedIn with localStorage
      loggedIn: localStorage.getItem("loggedIn"),
      // State token
      token: localStorage.getItem("token"),
      // State user loggedIn
      user: [],
      // State loading
      loading: false,
    };
  },
  created() {
    axios
      .get(this.$api + "/api/user", {
        headers: { Authorization: "Bearer " + this.token },
      })
      .then((response) => {
        // Assign response to state user
        this.user = response.data;
      });
  },
  methods: {
    logout() {
      // Menampilkan loading
      this.$loader = this.$loading.show({
        container: this.fullPage ? null : this.$refs.formContainer,
        color: "#0074e4",
      });
      axios
        .get(this.$api + "/api/logout")
        .then(() => {
          // Remove localStorage
          localStorage.removeItem("loggedIn");
          // Redirect
          // window.location.href = "/login";

          return this.$router.push({ name: "login" });
        })
        .finally(() => {
          this.$loader.hide(); // Matikan loading setelah selesai
        });
    },
    toggleTooltip() {
      this.showTooltip = !this.showTooltip;
    },
    destroyTooltip() {
      if (this.popperInstance) {
        this.popperInstance.destroy();
        this.popperInstance = null;
      }
    },
    checkMobile() {
      this.isMobile = window.innerWidth <= 768; // Ganti angka 768 sesuai dengan breakpoint Anda
      this.showTooltip = !this.isMobile; // Tampilkan Sidebar jika bukan mode mobile
    },
  },

  mounted() {
    window.addEventListener("resize", this.checkMobile);
    this.checkMobile(); // Panggil checkMobile saat halaman dimuat
  },
};
</script>
<style>
.sidenav {
  position: fixed;
}
</style>
