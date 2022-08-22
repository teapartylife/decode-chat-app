export default (refId) => {
  refId = refId.split('-');

  return {
    addr1: refId[0],
    addr2: refId[1],
  };
};
