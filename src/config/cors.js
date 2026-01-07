const allowedOrigins = [
  'https://sagrowinfotech.vercel.app',
  "http://localhost:3001"
];

module.exports = {
  origin: function (origin, callback) {
    // Allow Postman / mobile apps (no origin)
    if (!origin) return callback(null, true);

    // Only allow requests from your frontend
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Block everything else
    return callback(new Error('CORS not allowed'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
