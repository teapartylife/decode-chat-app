<template>
  <v-app dark>
    <v-container class="flex flex-col items-center justify-center">
      <h1 v-if="error.statusCode === 404" class="text-8xl font-bold">
        {{ pageNotFound }}
      </h1>
      <h1 v-else class="text-8xl font-bold">
        {{ otherError }}
      </h1>

      <p v-if="error.statusCode === 404" class="text-5xl mt-5">
        Go back to <NuxtLink to="/"> homepage </NuxtLink>
      </p>
      <p v-else class="text-5xl mt-5">
        Refresh page <v-btn @click="refresh"> here </v-btn>
      </p>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: 'EmptyLayout',
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      pageNotFound: 'Page not found',
      otherError: 'Something went wrong',
    };
  },
  head() {
    const title =
      (this.error.statusCode === 404 ? this.pageNotFound : this.otherError) +
      ' — decode.chat';
    return {
      title,
    };
  },
  methods: {
    refresh() {
      location.reload();
    },
  },
};
</script>
