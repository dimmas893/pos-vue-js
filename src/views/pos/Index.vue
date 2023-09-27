<template>
  <div>
    <div class="row">
      <!-- Bagian pertama - Gambar -->
      <div class="col-lg-6 col-md-12">
        <div class="row">
          <div class="row">
            <div class="col">
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
                    @click="searchData"
                    style="cursor: pointer"
                    class="input-group-text"
                    id="basic-addon1"
                    ><i class="bi bi-search"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <!-- Dropdown filter untuk bestseller -->
          <div class="col-6">
            <select
              v-model="categoryFilter"
              @change="searchData"
              class="form-control">
              <option value="" selected>--- All category ---</option>
              <option v-for="category in categories" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>
          <div class="col-6" id="myTable_length">
            <select v-model="perPage" @change="searchData" class="form-control">
              <option value="9" selected>select entry</option>
              <option value="20">20</option>
              <option value="30">30</option>
            </select>
          </div>
          <!-- Untuk perangkat mobile (lebar layar < 992px), setiap item akan menempati satu kolom penuh -->
          <div
            class="col-lg-4 col-md-12 mt-3"
            v-for="product in products"
            :key="product.id">
            <div class="card overflow-hidden rounded-2">
              <div class="position-relative">
                <a href="javascript:void(0)">
                  <img
                    :src="getProductImageUrl(product.image)"
                    class="card-img-top rounded-0"
                    alt="..."
                    :width="'50px'" />
                </a>
              </div>
              <div class="card-body pt-3 p-4">
                <h6 class="fw-semibold fs-4">{{ product.name }}</h6>
                <div class="d-flex align-items-center justify-content-between">
                  <h6 class="fw-semibold fs-4 mb-0">
                    {{ formatHarga(product.price) }} ({{ product.stock }}
                    stock)
                  </h6>
                </div>
              </div>
              <button
                :data-id="product.id"
                :disabled="loading"
                @click="createCart(product.id)"
                class="btn btn-success btn-delete">
                Add
              </button>
            </div>
          </div>
        </div>
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

      <!-- Bagian kedua - Card Kosong -->
      <div class="col-lg-6 col-md-12">
        <div class="row">
          <div class="col-lg-12 d-flex align-items-stretch">
            <div class="card w-100">
              <div class="card-body p-4">
                <div class="row">
                  <div class="col-lg-6">
                    <h5 class="card-title fw-semibold mb-4">Table Pesanan</h5>
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
                          <h6 class="fw-semibold mb-0">Qty</h6>
                        </th>

                        <th class="border-bottom-0">
                          <h6 class="fw-semibold mb-0">Price</h6>
                        </th>
                        <th class="border-bottom-0">
                          <h6 class="fw-semibold mb-0">Action</h6>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        class="col-md-4 mt-4"
                        v-for="(cart, index) in carts"
                        :key="cart.id">
                        <td>{{ index + 1 }}</td>
                        <td>{{ cart.product.name }}</td>
                        <td>{{ cart.qty }}</td>
                        <td>{{ cart.price }}</td>
                        <td>
                          <button
                            class="btn btn-danger"
                            @click="deleteCart(cart.id)">
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
        </div>
        <div class="row">
          <div class="col-12">
            <div class="card">
              <div class="card-header">
                <p>
                  <b>Total Harga: {{ formatHarga(totalPrice) }}</b>
                </p>
              </div>
              <div class="card-body">
                <input
                  type="text"
                  v-model="uang"
                  class="form-control"
                  :class="{
                    'text-black': angka() === parseFloat(totalPrice),
                    'text-red': angka() !== parseFloat(totalPrice),
                  }"
                  placeholder="Masukkan uang anda"
                  min="1"
                  @input="formatDenganRupiah"
                  @keypress="isNumber" />
                <div v-if="angka() > parseFloat(totalPrice)">
                  <p>
                    <b>Kembalian {{ formatHarga(kembalian) }}</b>
                  </p>
                </div>
                <div v-else-if="angka() === parseFloat(totalPrice)">
                  <p class="text-success">
                    <b>Harga pas</b>
                  </p>
                </div>
                <div v-else>
                  <p class="text-danger">
                    Jumlah uang yang dimasukkan terlalu sedikit atau tidak
                    valid.
                  </p>
                  <p v-if="angka()">
                    <b>kurang bayar {{ formatHarga(-kembalian) }}</b>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-12 text-center">
              <button class="btn btn-primary" @click="transaction()">
                Bayar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/dist/sweetalert2.min.css";
import axios from "axios";
export default {
  name: "posIndex",
  data() {
    return {
      totalPrice: 0,
      categoryFilter: "",
      uang: "",
      products: [], // Data produk
      search: "", // Pencarian
      perPage: 9, // Jumlah item per halaman
      currentPage: 1, // Halaman saat ini
      totalPages: 1, // Total halaman
      link: [], // Informasi halaman
      categories: [],
      carts: [],
      loading: false,
      productLoadings: {},
    };
  },
  methods: {
    formatTanpaRupiah: function () {
      this.uang = this.formatRupiah(this.uang);
    },
    formatDenganRupiah: function () {
      this.uang = this.formatRupiah(this.uang, "Rp. ");
    },
    formatRupiah: function (angka, prefix) {
      var number_string = angka.replace(/[^,\d]/g, "").toString(),
        split = number_string.split(","),
        sisa = split[0].length % 3,
        rupiah = split[0].substr(0, sisa),
        ribuan = split[0].substr(sisa).match(/\d{3}/gi),
        separator = sisa ? "." : ""; // Declare separator here

      if (ribuan) {
        separator = sisa ? "." : "";
        rupiah += separator + ribuan.join(".");
      }

      rupiah = split[1] !== undefined ? rupiah + "," + split[1] : rupiah;
      return prefix == undefined ? rupiah : rupiah ? "Rp. " + rupiah : "";
    },
    getProductImageUrl(image) {
      const URL_BASE = this.$api + "/assets/images/";
      return URL_BASE + image;
    },
    filter(page) {
      this.currentPage = page; // Set halaman saat ini
      this.loadData(); // Memuat data sesuai dengan halaman yang dipilih
    },
    categorieData() {
      axios
        .get(this.$api + "/api/categories")
        .then((response) => this.setCategories(response.data.data))
        .finally(() => {
          // Matikan loading setelah selesai
        });
    },

    formatHarga(angka) {
      const options = {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0, // Menyamakan jumlah desimal dengan format mata uang
      };

      return new Intl.NumberFormat("id-ID", options).format(angka);
    },
    isNumber(event) {
      // Validasi agar hanya angka yang dapat dimasukkan
      const charCode = event.which ? event.which : event.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        event.preventDefault();
      }
    },
    searchData() {
      this.loading = true;
      this.$loader = this.$loading.show({
        container: this.fullPage ? null : this.$refs.formContainer,
        color: "#0074e4",
      });
      axios
        .get(
          this.$api +
            "/api/products?page=" +
            this.currentPage +
            "&category_id=" +
            this.categoryFilter +
            "&perPage=" +
            this.perPage +
            "&search=" +
            this.search
        )
        .then((response) => {
          this.setProducts(response.data);
        })
        .finally(() => {
          this.loading = false;
          this.$loader.hide();
        });
    },
    loadData() {
      this.loading = true;
      // this.$loader = this.$loading.show({
      //   container: this.fullPage ? null : this.$refs.formContainer,
      //   color: "#0074e4",
      // });
      axios
        .get(
          this.$api +
            "/api/products?page=" +
            this.currentPage +
            "&category_id=" +
            this.categoryFilter +
            "&perPage=" +
            this.perPage +
            "&search=" +
            this.search
        )
        .then((response) => {
          this.setProducts(response.data);
        })
        .finally(() => {
          this.loading = false;
          // this.$loader.hide();
        });
    },
    transaction() {
      if (this.carts.length == 0) {
        this.$toast.info("ups!!! cart kosong", {
          type: "info",
          position: "top-right",
          duration: 3000,
          dismissible: true,
        });
      }
      if (
        this.uang != "" &&
        this.angka() >= parseFloat(this.totalPrice) &&
        this.carts.length > 0
      ) {
        axios
          .post(this.$api + "/api/transaction")
          .then((response) => {
            this.loadData();
            this.cartData();
            this.$toast.success(response.data.message, {
              type: "success",
              position: "top-right",
              duration: 3000,
              dismissible: true,
            });
          })
          .finally(() => {});
        this.uang = "";
      } else if (
        this.uang != "" &&
        this.angka() < parseFloat(this.totalPrice)
      ) {
        this.$toast.info("Nominal Uang anda Kurang", {
          type: "info",
          position: "top-right",
          duration: 3000,
          dismissible: true,
        });
      } else if (this.uang == "" && this.carts.length >= 1) {
        this.$toast.error("Harap isi nominal uang terlebih dahulu", {
          type: "error",
          position: "top-right",
          duration: 3000,
          dismissible: true,
        });
      }
    },
    createCart(id) {
      this.$loader = this.$loading.show({
        container: this.fullPage ? null : this.$refs.formContainer,
        color: "#0074e4",
      });
      const deleteButton = $(`.btn-delete[data-id="${id}"]`);
      const allDeleteButtons = $(".btn-delete"); // Mengambil semua tombol "Delete"

      allDeleteButtons.attr("disabled", true);

      deleteButton.html("loading...");

      const formData = new FormData();
      formData.append("product_id", id);

      axios
        .post(this.$api + "/api/cart", formData)
        .then((response) => {
          this.loadData();
          this.cartData();
          this.$router.push({ path: "/admin/aplikasi" });
          this.$toast.success(response.data.message, {
            type: "success",
            position: "top-right",
            duration: 3000,
            dismissible: true,
          });
        })
        .catch((error) => {
          console.error("Error:", error);
          this.$toast.error("Gagal menyimpan data", {
            type: "error",
            position: "top-right",
            duration: 3000,
            dismissible: true,
          });
        })
        .finally(() => {
          allDeleteButtons.attr("disabled", false).html("Add");
          this.$loader.hide();
          // Set loading kembali ke false setelah permintaan HTTP selesai, entah berhasil atau tidak
          // this.$set(this.productLoadings, id, false);
        });
    },
    angka() {
      const angkaTanpaTitik = this.uang.replace(/[^0-9]/g, ""); // Menghapus semua karakter non-angka (termasuk titik dan "Rp")
      const uangNumerik = parseFloat(angkaTanpaTitik);
      return uangNumerik;
    },
    deleteCart(id) {
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
          this.$loader = this.$loading.show({
            container: this.fullPage ? null : this.$refs.formContainer,
            color: "#0074e4",
          });
          axios
            .delete(this.$api + "/api/cart/" + id)
            .then((response) => {
              if (response.status === 200) {
                this.loadData();
                this.cartData();
                this.$toast.success(response.data.message, {
                  type: "success",
                  position: "top-right",
                  duration: 3000,
                  dismissible: true,
                });
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
            })
            .finally(() => {
              this.$loader.hide();
            });
        }
      });
    },
    calculateProductId(index) {
      return (this.currentPage - 1) * this.perPage + index + 1;
    },
    setProducts(data) {
      this.products = data.data;
      this.totalPages = data.last_page;
      this.link = data.links;
    },
    setCategories(data) {
      this.categories = data;
    },

    setCart(data) {
      this.carts = data.cart;
      this.totalPrice = data.total;
    },
    cartData() {
      axios
        .get(this.$api + "/api/cart")
        .then((response) => this.setCart(response.data))
        .finally(() => {
          // Matikan loading setelah selesai
        })
        .finally(() => {
          // this.$loader.hide();
        });
    },
    async loadDataAsync() {
      // Menampilkan elemen loading
      // this.$loader = this.$loading.show({
      //   container: this.fullPage ? null : this.$refs.formContainer,
      //   color: "#0074e4",
      // });

      try {
        await this.loadData();
        await this.categorieData();
        await this.cartData();
      } catch (error) {
        // Tangani kesalahan jika diperlukan
        console.error(error);
      } finally {
        // Menyembunyikan elemen loading setelah semua fungsi selesai dieksekusi
        this.$loader.hide();
      }
    },
  },
  computed: {
    kembalian() {
      // Pastikan bahwa this.uang adalah tipe data numerik

      const angkaTanpaTitik = this.uang.replace(/[^0-9]/g, "");

      const uangNumerik = parseFloat(angkaTanpaTitik);

      // console.log(uangNumerik);
      // Hitung kembalian
      const kembalian = uangNumerik - this.totalPrice;

      // Gunakan Math.abs() untuk memastikan kembalian selalu positif
      return Math.abs(kembalian);
    },
  },
  mounted() {
    // this.loading = true;
    this.loadDataAsync();
  },
};
</script>
