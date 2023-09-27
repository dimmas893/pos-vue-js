<template>
  <div class="container-fluid">
    <div class="container-fluid">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title fw-semibold mb-4">Forms</h5>
          <div class="card">
            <div class="card-body">
              <form>
                <div class="mb-3">
                  <label for="exampleInputEmail1" class="form-label"
                    >Name</label
                  >
                  <input type="text" class="form-control" />
                </div>
                <button type="submit" class="btn btn-primary">Submit</button>
              </form>
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
  name: "editProduct",
  data() {
    return {
      product: {},
      data: {},
    };
  },
  methods: {
    getProductImageUrl(gambar) {
      // Gantilah "URL_BASE" dengan URL dasar gambar yang Anda inginkan
      const URL_BASE = this.$api + "/assets/images/"; // Sesuaikan dengan URL dasar Anda
      // Gabungkan URL dasar dengan nama gambar dari respons API
      return URL_BASE + gambar;
    },
    setProduct(data) {
      this.product = data;
    },
    pemesanan() {
      this.data.product_id = this.product.id;
      axios
        .post(this.$api + "/api/products", this.data)
        .then((response) => {
          this.$router.push({ path: "/keranjang" });
          this.$toast.success(response.data.message, {
            type: "success",
            position: "top-right",
            duration: 3000,
            dismissible: true,
          });
        })
        .catch((error) => {
          if (error.response && error.response.status === 422) {
            // Respons dengan status error 422 (Unprocessable Entity) diterima dari server
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
            // Respons dengan status error lainnya diterima dari server
            this.$toast.error(error.response.data.message, {
              type: "error",
              position: "top-right",
              duration: 3000,
              dismissible: true,
            });
          } else {
            // Terjadi kesalahan lainnya
            this.$toast.error("Terjadi kesalahan: " + error.message, {
              type: "error",
              position: "top-right",
              duration: 3000,
              dismissible: true,
            });
          }
        })
        .finally(() => {
          //   this.loading = false; // Matikan loading setelah selesai
        });
    },
  },
};
</script>
