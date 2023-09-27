<template>
  <div class="container-fluid">
    <div class="container-fluid">
      <div class="card">
        <form v-on:submit.prevent>
          <div class="card-body">
            <h5 class="card-title fw-semibold mb-4">Forms</h5>
            <div class="mb-3">
              <label class="form-label">Name</label>
              <input
                type="text"
                class="form-control"
                placeholder="Masukan name"
                v-model="category.name" />
            </div>
            <div>
              <button
                type="submit"
                @click="createCategory"
                class="btn btn-primary mr-3">
                Submit
              </button>

              <router-link to="/admin/category" class="btn btn-success mx-2">
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
  name: "createCategory",
  data() {
    return {
      category: {
        name: "", // Default kosong
      },
    };
  },
  methods: {
    createCategory() {
      // Buat objek FormData untuk mengirim data formulir dan gambar
      const formData = new FormData();
      formData.append("name", this.category.name);

      axios
        .post(this.$api + "/api/categories", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          //   console.log(response);
          this.$router.push({ path: "/admin/category" });
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
        });
    },
  },
};
</script>
