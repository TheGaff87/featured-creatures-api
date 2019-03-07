exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/featured-creatures-db';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/featured-creatures-db-test';
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = process.env.JWT_SECRET || 'yeownduye';
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '30d';
exports.CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'localhost:3000'