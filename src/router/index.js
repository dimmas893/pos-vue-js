import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../views/auth/login.vue"),
    },

    {
      path: "/login",
      name: "login",
      component: () => import("../views/auth/login.vue"),
      beforeEnter: guestMiddleware,
      // meta: {
      //   showLoading: true,
      //   containerSelector: "#route1-container",
      //   fullPage: true,
      // },
    },
    {
      path: "/admin",
      name: "admin",
      redirect: "/admin/dashboard",
      component: () => import("../components/componentBE/template/Index.vue"),
      children: [
        {
          path: "dashboard",
          name: "dashboard",
          component: () =>
            import("../components/componentBE/dashboard/Index.vue"),
          beforeEnter: authMiddleware,
        },
        {
          path: "product",
          name: "product",
          component: () =>
            import("../components/componentBE/product/Index.vue"),
          beforeEnter: authMiddleware,
        },
        {
          path: "product/edit/:id",
          name: "productEditAdmin",
          component: () => import("../views/product/Edit.vue"),
          beforeEnter: authMiddleware,
        },

        {
          path: "product/create",
          name: "productCreateAdmin",
          component: () => import("../views/product/Create.vue"),
          beforeEnter: authMiddleware,
        },
        {
          path: "category",
          name: "category",
          component: () =>
            import("../components/componentBE/category/Index.vue"),
          beforeEnter: authMiddleware,
        },

        {
          path: "category/create",
          name: "categoryCreatePage",
          component: () => import("../views/category/Create.vue"),
          beforeEnter: authMiddleware,
        },
        {
          path: "category/edit/:id",
          name: "categoryEdit",
          component: () => import("../views/category/Edit.vue"),
          beforeEnter: authMiddleware,
        },

        {
          path: "aplikasi",
          name: "aplikasiPage",
          component: () => import("../views/pos/Index.vue"),
          beforeEnter: authMiddleware,
        },

        {
          path: "transaction",
          name: "transactionPage",
          component: () => import("../views/transaction/Index.vue"),
          beforeEnter: authMiddleware,
        },

        {
          path: "transaction/detail/:id",
          name: "transactionDetailPage",
          component: () => import("../views/transaction/Detail.vue"),
          beforeEnter: authMiddleware,
        },
      ],
      beforeEnter: authMiddleware,
    },
  ],
});

export default router;

// export default router;

// Pastikan Anda menyesuaikan komponen Loading dengan nama yang benar jika Anda mengubahnya dalam aplikasi Anda. Dengan cara ini, loading overlay akan ditampilkan saat navigasi dimulai dan disembunyikan saat navigasi selesai.

function authMiddleware(to, from, next) {
  const loggedIn = localStorage.getItem("loggedIn");

  if (!loggedIn) {
    // Redirect to the previous page if not authenticated
    router.go(-1);
  } else {
    next();
  }
}

function guestMiddleware(to, from, next) {
  const loggedIn = localStorage.getItem("loggedIn");

  if (loggedIn) {
    // Redirect to the previous page if already logged in
    router.go(-1);
  } else {
    next();
  }
}
