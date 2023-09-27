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
                @click="updateCategory"
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
  name: "editCategory",
  data() {
    return {
      category: {},
    };
  },

  methods: {
    updateCategory() {
      // Create a FormData object to send form data and the image
      const formData = new FormData();
      formData.append("name", this.category.name);

      axios
        .post(this.$api + "/api/categories/" + this.$route.params.id, formData)
        .then((response) => {
          this.$router.push({ path: "/admin/category" });
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

    setCategories(data) {
      this.category = data;
    },
  },
  mounted() {
    this.$loader = this.$loading.show({
      container: this.fullPage ? null : this.$refs.formContainer,
      color: "#0074e4",
    });
    axios
      .get(this.$api + "/api/categories/" + this.$route.params.id)
      .then((response) => {
        this.setCategories(response.data);
      })
      .finally(() => {
        this.$loader.hide();
      })
      .catch((error) => console.log(error));
    // this.categorieData();
  },
};
</script>
