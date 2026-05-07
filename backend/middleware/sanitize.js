// Input sanitization middleware — prevents XSS and script injection
const sanitizeInput = (req, res, next) => {
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === 'string') {
        // Strip HTML tags
        req.body[key] = req.body[key].replace(/<[^>]*>/g, '');
        // Remove script injections
        req.body[key] = req.body[key].replace(/javascript:/gi, '');
        req.body[key] = req.body[key].replace(/on\w+\s*=/gi, '');
        // Trim whitespace
        req.body[key] = req.body[key].trim();
      }
    }
  }

  if (req.query) {
    for (const key in req.query) {
      if (typeof req.query[key] === 'string') {
        req.query[key] = req.query[key].replace(/<[^>]*>/g, '');
        req.query[key] = req.query[key].trim();
      }
    }
  }

  if (req.params) {
    for (const key in req.params) {
      if (typeof req.params[key] === 'string') {
        req.params[key] = req.params[key].replace(/<[^>]*>/g, '');
        req.params[key] = req.params[key].trim();
      }
    }
  }

  next();
};

module.exports = sanitizeInput;
