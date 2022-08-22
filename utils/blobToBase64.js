export default (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () =>
      resolve(
        // @ts-ignore
        reader.result.replace('data:application/octet-stream;base64,', '')
      );
    reader.readAsDataURL(blob);
  });
};
