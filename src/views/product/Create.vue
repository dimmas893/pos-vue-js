<template>
  <div class="container-fluid">
    <div class="container-fluid">
      <div class="card">
        <form v-on:submit.prevent>
          <div class="card-body">
            <h5 class="card-title fw-semibold mb-4">Forms</h5>
            <div class="mb-3 text-center">
              <!-- Tampilkan gambar produk yang baru diunggah jika selectedImage tidak null -->

              <img
                class="mb-3"
                v-if="previewImageUrl"
                :src="previewImageUrl"
                alt="Preview"
                style="max-width: 200px; max-height: 200px; margin-top: 10px" />

              <input type="file" class="form-control" @change="previewImage" />
            </div>

            <div class="mb-3">
              <label class="form-label">Name</label>
              <input
                type="text"
                class="form-control"
                placeholder="Masukan name"
                v-model="product.name" />
            </div>
            <div class="mb-3">
              <label class="form-label">Stock</label>
              <input
                type="number"
                class="form-control"
                placeholder="Masukan stock"
                v-model="product.stock" />
            </div>

            <div class="mb-3">
              <label class="form-label">Price</label>
              <input
                type="number"
                class="form-control"
                placeholder="Masukan price"
                v-model="product.price" />
            </div>
            <div class="mb-3">
              <label class="form-label">Category</label>
              <select v-model="product.category_id" class="form-control">
                <option value="" selected>--- All category ---</option>
                <option v-for="category in categories" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label">Description</label>
              <textarea
                class="form-control"
                cols="30"
                placeholder="Masukan description"
                v-model="product.description"
                rows="10"></textarea>
            </div>
            <div>
              <button
                type="submit"
                @click="createProduct"
                class="btn btn-primary mr-3">
                Submit
              </button>

              <router-link to="/admin/product" class="btn btn-success mx-2">
                Kembali
              </router-link>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "createProduct",
  data() {
    return {
      product: {
        name: "", // Default kosong
        image: "", // Default kosong
        stock: "", // Default kosong
        description: "", // Default kosong
        price: "", // Default kosong
        category_id: "", // Default kosong
      },
      selectedImage: null,
      previewImageUrl: null,
      categories: [],
    };
  },

  methods: {
    previewImage(event) {
      // Dapatkan file yang dipilih dari event
      const selectedFile = event.target.files[0];

      if (selectedFile) {
        const reader = new FileReader();

        reader.onload = (e) => {
          this.previewImageUrl = e.target.result;
          this.selectedImage = selectedFile; // Simpan file yang dipilih
        };

        reader.readAsDataURL(selectedFile);
      } else {
        this.previewImageUrl = null;
        this.selectedImage = null; // Hapus file yang dipilih jika tidak ada yang dipilih
      }
    },
    createProduct() {
      // Buat objek FormData untuk mengirim data formulir dan gambar
      const formData = new FormData();
      formData.append("name", this.product.name);
      formData.append("stock", this.product.stock);
      formData.append("description", this.product.description);
      formData.append("price", this.product.price);
      formData.append("category_id", this.product.category_id);
      formData.append("image", this.selectedImage); // Menggunakan selectedImage yang telah diambil dari input file

      axios
        .post(this.$api + "/api/products", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          // Hapus Semua Keranjang
          this.$router.push({ path: "/admin/product" });
          this.$toast.success(response.data.message, {
            type: "success",
            position: "top-right",
            duration: 3000,
            dismissible: true,
          });
        })
        .catch((error) => {
          if (error.response && error.response.status === 422) {
            const validationErrors = error.response.data.errors;
            let errorMessage = "Terjadi kesalahan validasi:<br>";
            for (const field in validationErrors) {
              errorMessage += `- ${validationErrors[field].join(", ")}<br>`;
            }
            this.$toast.error(errorMessage, {
              type: "error",
              position: "top-right",
              duration: 3000,
              dismissible: true,
            });
          } else if (error.response) {
            this.$toast.error(error.response.data.message, {
              type: "error",
              position: "top-right",
              duration: 3000,
              dismissible: true,
            });
          } else {
            this.$toast.error("Terjadi kesalahan: " + error.message, {
              type: "error",
              position: "top-right",
              duration: 3000,
              dismissible: true,
            });
          }
        });
    },
    categorieData() {
      axios
        .get(this.$api + "/api/categories")
        .then((response) => this.setCategories(response.data.data))
        .finally(() => {});
    },

    setCategories(data) {
      this.categories = data;
    },
  },
  mounted() {
    this.categorieData();
  },
};
</script>
