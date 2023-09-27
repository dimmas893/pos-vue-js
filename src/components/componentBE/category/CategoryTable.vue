<template>
  <div class="row mb-4">
    <div class="row mt-3">
      <div class="col-8">
        <div class="input-group mb-3">
          <input
            v-model="search"
            type="text"
            class="form-control"
            placeholder="Search"
            aria-label="Cari"
            aria-describedby="basic-addon1" />
          <div class="input-group-prepend">
            <span
              @click="loadData"
              style="cursor: pointer"
              class="input-group-text"
              id="basic-addon1"
              ><i class="bi bi-search"></i>
            </span>
          </div>
        </div>
      </div>

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
              <h5 class="card-title fw-semibold mb-4">Table category</h5>
            </div>
            <div class="col-lg-6 text-end">
              <router-link to="/admin/category/create" class="btn btn-success">
                <i class="bi bi-plus-circle"></i> Create
              </router-link>
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
                    <h6 class="fw-semibold mb-0">Name</h6>
                  </th>
                  <th class="border-bottom-0">
                    <h6 class="fw-semibold mb-0">Action</h6>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  class="col-md-4 mt-4"
                  v-for="(category, index) in categories"
                  :key="category.id">
                  <td>{{ calculatecategoryId(index) }}</td>
                  <td>{{ category.name }}</td>

                  <td>
                    <router-link
                      class="btn btn-info"
                      :to="'/admin/category/edit/' + category.id"
                      ><i class="bi bi-pencil-fill"></i>
                    </router-link>

                    <button
                      class="btn btn-danger mx-2"
                      @click="deletecategory(category.id)">
                      <i class="bi bi-trash3"></i>
                    </button>
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
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/dist/sweetalert2.min.css";

export default {
  name: "categoryTable",
  data() {
    return {
      categoryFilter: "",
      categories: [], // Data produk
      search: "", // Pencarian
      perPage: 10, // Jumlah item per halaman
      currentPage: 1, // Halaman saat ini
      totalPages: 1, // Total halaman
      link: [], // Informasi halaman
    };
  },
  methods: {
    deletecategory(categoryId) {
      const self = this;
      const deleteButton = $(`.btn-delete[data-id="${categoryId}"]`);
      const allDeleteButtons = $(".btn-delete"); // Mengambil semua tombol "Delete"

      // Simpan halaman saat ini sebelum menghapus
      const currentPageBeforeDelete = this.currentPage;

      // Menonaktifkan semua tombol "Delete" selain yang sedang diklik
      Swal.fire({
        title: "Konfirmasi",
        text: "Apakah Anda yakin ingin menghapus produk ini?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Ya, Hapus",
        cancelButtonText: "Tidak",
      }).then((result) => {
        // Mengaktifkan kembali semua tombol "Delete" setelah proses selesai
        if (result.isConfirmed) {
          allDeleteButtons.attr("disabled", true).html("disable klik");
          deleteButton.html("Loading...");

          axios
            .delete(this.$api + "/api/categories/" + categoryId)
            .then((response) => {
              if (response.status === 200) {
                // Setelah penghapusan berhasil, periksa jumlah data yang tersisa
                if (this.categories.length === 1) {
                  // Jika hanya ada satu data di halaman paginate, kembali ke halaman sebelumnya atau halaman saat ini - 1
                  if (currentPageBeforeDelete > 1) {
                    this.filter(currentPageBeforeDelete - 1);
                  } else {
                    this.loadData();
                  }
                } else {
                  // Jika masih ada data lain di halaman paginate, perbarui data
                  this.loadData();
                }
              } else {
                Swal.fire("Gagal!", "Gagal menghapus produk.", "error");
              }
            })
            .catch((error) => {
              console.error(error);
              Swal.fire(
                "Error!",
                "Terjadi kesalahan saat menghapus produk.",
                "error"
              );
            });
        }
      });
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
            "/api/categories?page=" +
            this.currentPage +
            "&perPage=" +
            this.perPage +
            "&search=" +
            this.search
        )
        .then((response) => {
          const currentPageBeforeFilter = this.currentPage; // Simpan halaman saat ini sebelum filter

          this.setcategories(response.data);

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
    calculatecategoryId(index) {
      return (this.currentPage - 1) * this.perPage + index + 1;
    },
    setcategories(data) {
      this.categories = data.data;
      this.totalPages = data.last_page;
      this.link = data.links;
    },
  },

  mounted() {
    this.loadData();
  },
};
</script>
