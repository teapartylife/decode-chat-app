// hardcode chain ID for now
export const CHAIN_ID = 137;

// export backend API URL
export const getBackendApi = (NODE_ENV) => {
  let api = process.env.NUXT_ENV_BACKEND_DEV_URL;
  if (NODE_ENV === 'staging') api = process.env.NUXT_ENV_BACKEND_STAG_URL;
  else if (NODE_ENV === 'production')
    api = process.env.NUXT_ENV_BACKEND_PROD_URL;
  return api;
};
