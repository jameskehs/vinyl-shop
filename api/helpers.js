function requireUser(req, res, next) {
  try {
    if (!req.user) {
      throw Error("Login Required");
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
}

module.exports = { requireUser };
