const allowedOrigins = [
  "https://www.sagrowinfotech.com",
];

module.exports = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Postman or mobile apps

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('CORS not allowed'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
