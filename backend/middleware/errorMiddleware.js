function notFound(req, res, next) {
  res.status(404);
  next(new Error(`Route not found — ${req.originalUrl}`));
}

// Centralized error handler. Controllers can set res.status(...) before
// throwing; if nothing set it, default to 500. Keeps stack traces out of
// responses in production.
function errorHandler(err, req, res, next) {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    message: err.message || "Something went wrong",
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
}

module.exports = { notFound, errorHandler };
