<template>
  <div
    class="page-wrapper"
    id="main-wrapper"
    data-layout="vertical"
    data-navbarbg="skin6"
    data-sidebartype="full"
    data-sidebar-position="fixed"
    data-header-position="fixed">
    <div
      class="position-relative overflow-hidden radial-gradient min-vh-100 d-flex align-items-center justify-content-center">
      <div class="d-flex align-items-center justify-content-center w-100">
        <div class="row justify-content-center w-100">
          <div class="col-md-8 col-lg-6 col-xxl-3">
            <div class="card mb-0">
              <div class="card-body">
                <a
                  href="./index.html"
                  class="text-nowrap logo-img text-center d-block py-3 w-100">
                  <img
                    src="../../assets/template/images/logos/dark-logo.svg"
                    width="180"
                    alt="" />
                </a>
                <p class="text-center">Your Social Campaigns</p>
                <form @submit.prevent="login">
                  <div class="mb-3">
                    <label for="exampleInputEmail1" class="form-label"
                      >Email</label
                    >
                    <input
                      v-model="user.email"
                      type="email"
                      class="form-control"
                      aria-describedby="emailHelp" />
                  </div>
                  <div class="mb-4">
                    <label for="exampleInputPassword1" class="form-label"
                      >Password</label
                    >
                    <input
                      v-model="user.password"
                      type="password"
                      class="form-control"
                      id="exampleInputPassword1" />
                  </div>
                  <!-- <div
                    class="d-flex align-items-center justify-content-between mb-4">
                    <div class="form-check">
                      <input
                        class="form-check-input primary"
                        type="checkbox"
                        value=""
                        id="flexCheckChecked"
                        checked />
                      <label
                        class="form-check-label text-dark"
                        for="flexCheckChecked">
                        Remeber this Device
                      </label>
                    </div>
                    <a class="text-primary fw-bold" href="./index.html"
                      >Forgot Password ?</a
                    >
                  </div> -->
                  <button
                    type="submit"
                    :disabled="loading"
                    class="btn btn-primary w-100 py-8 fs-4 mb-4 rounded-2">
                    <div v-if="!loading">Sign In</div>
                    <div v-else>
                      <img
                        src="../../assets//loading.gif"
                        style="width: 50px; height: 30px" />
                    </div>
                  </button>

                  <!-- <div class="d-flex align-items-center justify-content-center">
                    <p class="fs-4 mb-0 fw-bold">New to Modernize?</p>
                    <a
                      class="text-primary fw-bold ms-2"
                      href="./authentication-register.html"
                      >Create an account</a
                    >
                  </div> -->
                </form>
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
  name: "LoginView",
  data() {
    return {
      //state loggedIn with localStorage
      loggedIn: localStorage.getItem("loggedIn"),
      //state token
      token: localStorage.getItem("token"),
      //state user
      user: {
        email: "admin@gmail.com",
        password: "password",
      },
      //state validation
      validation: [],
      //state login failed
      loginFailed: null,
      loading: false,
    };
  },
  methods: {
    login() {
      this.$loader = this.$loading.show({
        container: this.fullPage ? null : this.$refs.formContainer,
        color: "#0074e4",
      });
      (this.loading = true),
        axios.get(this.$api + "/sanctum/csrf-cookie").then((response) => {
          //debug cookie
          // console.log(response);

          axios
            .post(this.$api + "/api/login", {
              email: this.user.email,
              password: this.user.password,
            })
            .then((res) => {
              //debug user login
              // console.log(res);

              if (res.data.success) {
                //set localStorage
                localStorage.setItem("loggedIn", true);

                //set localStorage Token
                localStorage.setItem("token", res.data.token);

                //change state
                this.loggedIn = true;

                //redirect dashboard
                return this.$router.push({ path: "/admin/dashboard" });
                // window.location.href = "/admin/dashboard";
              } else {
                //set state login failed
                this.loginFailed = true;
              }
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
              this.loading = false; // Matikan loading setelah selesai
              this.$loader.hide(); // Matikan loading setelah selesai
            });
        });
    },
  },
};
</script>
