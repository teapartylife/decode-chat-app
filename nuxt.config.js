import colors from 'vuetify/es5/util/colors';

export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'decode.chat',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content:
          'decode.chat is a simple decentralized chat dApp that just works',
      },
      { name: 'format-detection', content: 'telephone=no' },
      {
        hid: 'og:site_name',
        property: 'og:site_name',
        content: 'decode.chat',
      },
      {
        hid: 'og:title',
        property: 'og:title',
        content: 'decode.chat',
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content:
          'decode.chat is a simple decentralized chat dApp that just works',
      },
      { hid: 'url', property: 'og:url', content: 'https://decode.chat/' },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      {
        hid: 'og:image',
        property: 'og:image',
        content:
          'https://cf-ipfs.com/ipfs/QmWabqgiVPqCB8pJo4Xx3dFkf8Nf8238wGD5SXxpqeAyWA',
      },
      { hid: 'og:image:width', property: 'og:image:width', content: '2400' },
      { hid: 'og:image:height', property: 'og:image:height', content: '1200' },
      {
        hid: 'twitter:card',
        property: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        hid: 'twitter:image',
        property: 'twitter:image',
        content:
          'https://cf-ipfs.com/ipfs/QmWabqgiVPqCB8pJo4Xx3dFkf8Nf8238wGD5SXxpqeAyWA',
      },
      {
        hid: 'twitter:site',
        property: 'twitter:site',
        content: '@decode_social',
      },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=DM+Mono&family=DM+Sans:wght@400;700&display=swap',
      },
      {
        rel: 'stylesheet',
        href: 'https://cdn.jsdelivr.net/npm/@mdi/font@5.x/css/materialdesignicons.min.css',
      },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/utils.js',
    '~/plugins/vue-screen.js',
    '~/plugins/dayjs.js',
    {
      src: '~/plugins/v-waypoint.js',
      mode: 'client',
    },
    {
      src: '~/plugins/vuex-persistedstate',
      ssr: false,
    },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    // https://tailwindcss.nuxtjs.org/tailwind/config
    '@nuxtjs/tailwindcss',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: '/',
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en',
    },
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    treeShake: true,
    customVariables: ['~/assets/variables.scss'],
    font: {
      family: 'DM Sans',
    },
    defaultAssets: false,
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},

  tailwindcss: {
    config: {
      theme: {
        extend: {
          fontFamily: {
            mono: '"DM Mono", monospace',
          },
          colors: {
            gray: {
              800: '#262626',
            },
          },
        },
      },
    },
  },
};
