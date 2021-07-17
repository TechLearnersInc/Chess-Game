const originList = () => {
  const whitelist_string = process.env.CORS_WHITELIST;
  let whitelist = [];
  whitelist_string.split(',').forEach((each_url) => {
    whitelist.push(each_url.trim());
  });
  return whitelist;
};

module.exports = {
  origin: originList(),
  optionsSuccessStatus: 200,
};
