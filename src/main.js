import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import "./assets/template/libs/jquery/dist/jquery.min.js";
import "./assets/template/libs/bootstrap/dist/js/bootstrap.bundle.min.js";
import "./assets/template/js/sidebarmenu.js";
import "./assets/template/js/app.min.js";
// import "./assets/template/libs/apexcharts/dist/apexcharts.min.js";
import "./assets/template/libs/simplebar/dist/simplebar.js";
import "./assets/template/js/dashboard.js";
import "./assets/template/css/styles.min.css";
import "./assets/template/css/loading.css";
import VueToast from "vue-toast-notification";
import "vue-toast-notification/dist/theme-bootstrap.css";
import { LoadingPlugin } from "vue-loading-overlay";
import "vue-loading-overlay/dist/css/index.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// import "./assets/paginate.css";

const app = createApp(App);

app.use(router);

app.config.globalProperties.$api =
  "https://anandadimmasbudiarto.my.id/aplikasi/pos";

// Tambahkan loader sebagai variabel global
app.config.globalProperties.$loader = null;

app.use(VueToast);
app.use(LoadingPlugin);
app.mount("#app");
