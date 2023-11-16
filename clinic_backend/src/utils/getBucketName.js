const getBucketName = (req, fileName) => {
  var username;

  if (req.user) {
    username = req.user.username;
  } else {
    username = req.body.username;
  }

  const date = new Date(req.body.createdAt);
  const timestamp =
    date.getHours() +
    "-" +
    date.getMinutes() +
    "-" +
    date.getSeconds() +
    "-" +
    date.getMilliseconds();

  return `${timestamp}__${username}$__$` + `${fileName}`;
};

module.exports = { getBucketName };
