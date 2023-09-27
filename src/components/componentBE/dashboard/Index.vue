<template>
  <div class="row">
    <div class="col-lg-3">
      <!-- Monthly Earnings -->
      <div class="card">
        <div class="card-body">
          <div class="row alig n-items-start">
            <div class="col-8">
              <h5 class="card-title mb-9 fw-semibold">All Product</h5>
              <h4 class="fw-semibold mb-3">{{ product }}</h4>
            </div>
            <div class="col-4">
              <div class="d-flex justify-content-end">
                <div
                  class="text-white bg-secondary rounded-circle p-6 d-flex align-items-center justify-content-center">
                  P
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="col-lg-3">
      <!-- Monthly Earnings -->
      <div class="card">
        <div class="card-body">
          <div class="row alig n-items-start">
            <div class="col-8">
              <h5 class="card-title mb-9 fw-semibold">Product Ready</h5>
              <h4 class="fw-semibold mb-3">{{ productReady }}</h4>
            </div>
            <div class="col-4">
              <div class="d-flex justify-content-end">
                <div
                  class="text-white bg-secondary rounded-circle p-6 d-flex align-items-center justify-content-center">
                  PR
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="col-lg-3">
      <!-- Monthly Earnings -->
      <div class="card">
        <div class="card-body">
          <div class="row alig n-items-start">
            <div class="col-8">
              <h5 class="card-title mb-9 fw-semibold">All Category</h5>
              <h4 class="fw-semibold mb-3">{{ category }}</h4>
            </div>
            <div class="col-4">
              <div class="d-flex justify-content-end">
                <div
                  class="text-white bg-secondary rounded-circle p-6 d-flex align-items-center justify-content-center">
                  C
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-lg-3">
      <!-- Monthly Earnings -->
      <div class="card">
        <div class="card-body">
          <div class="row alig n-items-start">
            <div class="col-8">
              <h5 class="card-title mb-9 fw-semibold">Transaction</h5>
              <h4 class="fw-semibold mb-3">{{ formatHarga(transaction) }}</h4>
            </div>
            <div class="col-4">
              <div class="d-flex justify-content-end">
                <div
                  class="text-white bg-secondary rounded-circle p-6 d-flex align-items-center justify-content-center">
                  RP
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "dashboardBE",
  data() {
    return {
      product: "",
      category: "",
      transaction: "",
      productReady: "",
    };
  },

  methods: {
    formatHarga(angka) {
      const options = {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0, // Menyamakan jumlah desimal dengan format mata uang
      };

      return new Intl.NumberFormat("id-ID", options).format(angka);
    },
    dashboardData() {
      this.$loader = this.$loading.show({
        container: this.fullPage ? null : this.$refs.formContainer,
        color: "#0074e4",
      });
      axios
        .get(this.$api + "/api/dashboard")
        .then((response) => this.setDashboard(response.data))
        .finally(() => {
          // Matikan loading setelah selesai
          this.$loader.hide();
        });
    },
    setDashboard(data) {
      // console.log(data);
      this.product = data.product;
      this.category = data.category;
      this.transaction = data.transaction;
      this.productReady = data.productReady;
    },
  },

  mounted() {
    this.dashboardData(); // Panggil dashboardData sebagai fungsi
  },
};
</script>
