const pick = (object: object, keys: string[]) => {
  return keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      // eslint-disable-next-line no-param-reassign
      //   @ts-ignore
      obj[key] = object[key];
    }
    return obj;
  }, {});
};

export default pick;
