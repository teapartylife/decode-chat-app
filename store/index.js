export const mutations = {
  mutateState(state, [states = {}, namespace = null]) {
    Object.keys(states).forEach((item) => {
      if (namespace) {
        state[namespace][item] = states[item];
      } else {
        state[item] = states[item];
      }
    });
  },
};
