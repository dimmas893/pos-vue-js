<template>
  <div class="container-fluid">
    <div class="container-fluid">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title fw-semibold mb-4">Forms</h5>
          <div class="mb-3 text-center">
            <div class="image-container">
              <!-- Tampilkan gambar produk yang baru diunggah jika selectedImage tidak null -->
              <img
                v-if="selectedImage"
                :src="previewImageUrl"
                alt="Product Image"
                style="max-width: 500px; max-height: 500px" />
              <!-- Jika tidak ada gambar baru yang diunggah, tampilkan gambar produk yang ada -->
              <img
                v-else-if="product.image"
                :src="getProductImageUrl(product.image)"
                alt="Product Image"
                style="max-width: 500px; max-height: 500px" />
              <!-- Jika tidak ada gambar baru atau gambar produk yang ada, tampilkan pesan alternatif -->
              <div v-else>No image available.</div>
              <input
                type="file"
                @change="previewImage"
                class="form-control mt-5" />
            </div>
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
            <label class="form-label">Kode</label>
            <input
              type="text"
              class="form-control"
              placeholder="Masukan kode"
              disabled
              v-model="product.kode" />
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
              id=""
              cols="30"
              placeholder="Masukan description"
              v-model="product.description"
              rows="10"></textarea>
          </div>
          <button type="submit" @click="pemesanan" class="btn btn-primary">
            Submit
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
/* ... kode CSS lainnya ... */
.image-container {
  max-width: 100%;
  overflow: hidden;
}

.product-image {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 0 auto;
}
/* ... kode CSS lainnya ... */
</style>

<script>
import axios from "axios";
export default {
  name: "editProductView",
  data() {
    return {
      selectedImage: null,
      previewImageUrl: null,
      showInitialImage: true, // Initialize the flag to true
      product: {},
      data: {},
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
    setProduct(data) {
      this.product = data;
    },

    setCategories(data) {
      this.categories = data;
    },
    handleImageChange(event) {
      //   console.log("Image changed"); // Add this line to debug
      const selectedFile = event.target.files[0];
      if (selectedFile) {
        if (selectedFile instanceof Blob || selectedFile instanceof File) {
          this.product.image = selectedFile;
          this.showInitialImage = false; // Set the flag to false when a new image is selected
        } else {
          this.product.image = null;
        }
      } else {
        this.product.image = null;
      }
    },

    pemesanan() {
      // Create a FormData object to send form data and the image
      const formData = new FormData();
      formData.append("name", this.product.name);
      formData.append("image", this.selectedImage); // Use the selectedImage that was set in previewImage method
      formData.append("stock", this.product.stock);
      formData.append("description", this.product.description);
      formData.append("price", this.product.price);
      formData.append("category_id", this.product.category_id);

      axios
        .post(this.$api + "/api/products/" + this.$route.params.id, formData, {
          headers: {
            "Content-Type": "multipart/form-data", // Set the content type to multipart/form-data
          },
        })
        .then((response) => {
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
    getProductImageUrl(gambar) {
      // Gantilah "URL_BASE" dengan URL dasar gambar yang Anda inginkan
      const URL_BASE = this.$api + "/assets/images/"; // Sesuaikan dengan URL dasar Anda
      // Gabungkan URL dasar dengan nama gambar dari respons API
      return URL_BASE + gambar;
    },
  },
  computed: {
    imagePreviewUrl() {
      if (this.product.image && !this.showInitialImage) {
        const imageUrl = URL.createObjectURL(this.product.image);
        // console.log(imageUrl); // Add this line to debug
        return imageUrl;
      }
      return null;
    },
  },

  mounted() {
    this.$loader = this.$loading.show({
      container: this.fullPage ? null : this.$refs.formContainer,
      color: "#0074e4",
    });
    axios
      .get(this.$api + "/api/products/" + this.$route.params.id)
      .then((response) => {
        this.setProduct(response.data);

        // Set the initial image URL
        this.product.image = response.data.image;
      })
      .finally(() => {
        this.$loader.hide();
      })
      .catch((error) => console.log(error));
    this.categorieData();
  },
};
</script>
