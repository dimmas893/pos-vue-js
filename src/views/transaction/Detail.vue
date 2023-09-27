<template>
  <div class="row">
    <div class="col-lg-12 d-flex align-items-stretch">
      <div class="card w-100">
        <div class="card-body p-4">
          <div class="row">
            <div class="col-lg-6">
              <h5 class="card-title fw-semibold mb-4">Table transaction</h5>
            </div>
            <div class="col-lg-6 text-end">
              <!-- Tombol di pojok kanan atas -->
              <router-link to="/admin/transaction" class="btn btn-primary">
                Kembali</router-link
              >
            </div>
          </div>

          <div class="table-responsive">
            <table class="table text-nowrap mb-0 align-middle w-100">
              <thead class="text-dark fs-4">
                <tr>
                  <th class="border-bottom-0">
                    <h6 class="fw-semibold mb-0">Invoice</h6>
                  </th>
                  <th class="border-bottom-0">
                    <h6 class="fw-semibold mb-0">Total</h6>
                  </th>
                  <th class="border-bottom-0">
                    <h6 class="fw-semibold mb-0">Tanggal</h6>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr class="col-md-4 mt-4">
                  <td>{{ transactions.invoice }}</td>
                  <td>{{ formatHarga(transactions.total) }}</td>
                  <td>{{ formatTanggal(transactions.created_at) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="row">
    <div class="col-lg-12 d-flex align-items-stretch">
      <div class="card w-100">
        <div class="card-body p-4">
          <div class="row">
            <div class="col-lg-6">
              <h5 class="card-title fw-semibold mb-4">
                Detail item transaction
              </h5>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table text-nowrap mb-0 align-middle w-100">
              <thead class="text-dark fs-4">
                <tr>
                  <th class="border-bottom-0">
                    <h6 class="fw-semibold mb-0">Name product</h6>
                  </th>

                  <th class="border-bottom-0">
                    <h6 class="fw-semibold mb-0">Qty</h6>
                  </th>
                  <th class="border-bottom-0">
                    <h6 class="fw-semibold mb-0">Price</h6>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  class="col-md-4 mt-4"
                  v-for="transaction in transactionDetail"
                  :key="transaction.id">
                  <td>{{ transaction.product.name }}</td>
                  <td>{{ transaction.qty }}</td>
                  <td>{{ formatHarga(transaction.price) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "detailTransactionPage",
  data() {
    return {
      transactionDetail: [],
      transactions: {},
    };
  },
  methods: {
    formatTanggal(isoDate) {
      // Menggunakan objek Date untuk menguraikan tanggal ISO
      const date = new Date(isoDate);

      // Daftar nama bulan dalam bahasa Indonesia
      const namaBulan = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
      ];

      // Memformat tanggal dengan format "DD MMMM YYYY"
      const tanggalFormatted =
        date.getDate() +
        " " +
        namaBulan[date.getMonth()] +
        " " +
        date.getFullYear();

      return tanggalFormatted;
    },
    formatHarga(angka) {
      const options = {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0, // Menyamakan jumlah desimal dengan format mata uang
      };

      return new Intl.NumberFormat("id-ID", options).format(angka);
    },
    filter(page) {
      this.currentPage = page; // Set halaman saat ini
      this.loadData(); // Memuat data sesuai dengan halaman yang dipilih
    },
    loadData() {
      this.$loader = this.$loading.show({
        container: this.fullPage ? null : this.$refs.formContainer,
        color: "#0074e4",
      });
      axios
        .get(this.$api + "/api/transaction/" + this.$route.params.id)
        .then((response) => {
          const currentPageBeforeFilter = this.currentPage; // Simpan halaman saat ini sebelum filter

          this.settransactions(response.data);

          // Jika hanya ada satu halaman setelah filter, pindah ke halaman terakhir yang berisi data
          if (response.data.last_page === 1) {
            this.currentPage = response.data.last_page;
          } else {
            // Jika tidak, periksa jika halaman saat ini masih valid
            if (this.currentPage > response.data.last_page) {
              // Jika tidak valid, atur halaman saat ini ke halaman terakhir yang berisi data
              this.currentPage = response.data.last_page;
            }
          }

          // Jika halaman sebelum filter berbeda dengan halaman saat ini, perbarui data
          if (currentPageBeforeFilter !== this.currentPage) {
            this.loadData();
          }
        })
        .finally(() => {
          this.$loader.hide();
        });
    },
    calculatetransactionId(index) {
      return (this.currentPage - 1) * this.perPage + index + 1;
    },
    settransactions(data) {
      // console.log(data);
      this.transactions = data.order;
      this.transactionDetail = data.orderDetail;
    },
  },

  mounted() {
    this.loadData();
  },
};
</script>
