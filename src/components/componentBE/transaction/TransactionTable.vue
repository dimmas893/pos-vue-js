<template>
  <div class="row mb-4">
    <div class="row mt-3">
      <div class="col-8"></div>

      <div class="col-4" id="myTable_length">
        <select v-model="perPage" @change="loadData" class="form-control">
          <option value="10" selected>10</option>
          <option value="20">20</option>
          <option value="30">30</option>
        </select>
      </div>
    </div>
  </div>
  <div class="row">
    <div class="col-lg-12 d-flex align-items-stretch">
      <div class="card w-100">
        <div class="card-body p-4">
          <div class="row">
            <div class="col-lg-6">
              <h5 class="card-title fw-semibold mb-4">transaction</h5>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table text-nowrap mb-0 align-middle w-100">
              <thead class="text-dark fs-4">
                <tr>
                  <th class="border-bottom-0">
                    <h6 class="fw-semibold mb-0">Id</h6>
                  </th>
                  <th class="border-bottom-0">
                    <h6 class="fw-semibold mb-0">Invoice</h6>
                  </th>
                  <th class="border-bottom-0">
                    <h6 class="fw-semibold mb-0">Total</h6>
                  </th>
                  <th class="border-bottom-0">
                    <h6 class="fw-semibold mb-0">Tanggal</h6>
                  </th>
                  <th class="border-bottom-0">
                    <h6 class="fw-semibold mb-0">Action</h6>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  class="col-md-4 mt-4"
                  v-for="(transaction, index) in transactions"
                  :key="transaction.id">
                  <td>{{ calculatetransactionId(index) }}</td>
                  <td>{{ transaction.invoice }}</td>
                  <td>{{ formatHarga(transaction.total) }}</td>
                  <td>{{ formatTanggal(transaction.created_at) }}</td>

                  <td>
                    <router-link
                      class="btn btn-info"
                      :to="'/admin/transaction/detail/' + transaction.id"
                      ><i class="bi bi-eye"></i>
                    </router-link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <nav aria-label="Page navigation">
          <ul class="pagination">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <a class="page-link" @click="filter(currentPage - 1)" href="#">
                Kembali
              </a>
            </li>
            <li
              class="page-item"
              v-for="(paginate, index) in link"
              :key="index"
              :class="{ active: paginate.active }">
              <!-- Hanya tampilkan label yang berupa angka -->
              <a
                class="page-link"
                @click="filter(paginate.label)"
                v-if="paginate.label.match(/^\d+$/)"
                href="#">
                {{ paginate.label }}
              </a>
            </li>
            <li
              class="page-item"
              :class="{ disabled: currentPage === totalPages }">
              <a class="page-link" @click="filter(currentPage + 1)" href="#">
                Selanjutnya
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import "sweetalert2/dist/sweetalert2.min.css";

export default {
  name: "transactionTable",
  data() {
    return {
      transactionFilter: "",
      transactions: [], // Data produk
      search: "", // Pencarian
      perPage: 10, // Jumlah item per halaman
      currentPage: 1, // Halaman saat ini
      totalPages: 1, // Total halaman
      link: [], // Informasi halaman
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
        .get(
          this.$api +
            "/api/transaction?page=" +
            this.currentPage +
            "&perPage=" +
            this.perPage
        )
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
      this.transactions = data.data;
      this.totalPages = data.last_page;
      this.link = data.links;
    },
  },

  mounted() {
    this.loadData();
  },
};
</script>
