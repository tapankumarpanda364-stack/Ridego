// Usage: router.get("/", protect, authorize("admin"), handler)
// Must run after `protect`, which populates req.user.
function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401);
      throw new Error("Not authorized — no user on request");
    }
    if (!allowedRoles.includes(req.user.role)) {
      res.status(403);
      throw new Error(`Role "${req.user.role}" is not permitted to do this`);
    }
    next();
  };
}

module.exports = { authorize };
