module.exports = (err, req, res, next) => {
  console.error("Middleware Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
};
