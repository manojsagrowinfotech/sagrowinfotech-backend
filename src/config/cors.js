const allowedOrigins = [
  'http://localhost:4000',
  'https://your-frontend-domain.com'
];

module.exports = {
  origin: function (origin, callback) {
    // Allow mobile apps / Postman
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('CORS not allowed'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
