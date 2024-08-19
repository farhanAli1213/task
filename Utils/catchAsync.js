// Prvents server from crashing and sends error to client
module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => {
      // console.error("Error", err);
      return next(err);
    });
  };
};
