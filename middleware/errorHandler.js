const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Invalid MongoDB ObjectId
  if (err.name === "CastError") {
    return res.status(400).json({
      message: "Invalid ID"
    });
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const errors = {};

    Object.keys(err.errors).forEach((field) => {
      errors[field] = err.errors[field].message;
    });

    return res.status(400).json({
      message: "Validation failed",
      errors
    });
  }

  // Default server error
  res.status(500).json({
    message: "Something went wrong"
  });
};

module.exports = errorHandler;