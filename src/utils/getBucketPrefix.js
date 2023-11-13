const getBucketPrefix = (req) => {
  const date = new Date(req.body.createdAt);
  const timestamp =
    date.getHours() +
    "-" +
    date.getMinutes() +
    "-" +
    date.getSeconds() +
    "-" +
    date.getMilliseconds();

  return `${timestamp}__${req.body.username}$__$`;
};

module.exports = { getBucketPrefix };
