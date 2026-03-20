/**
 * Wraps an async Express route handler and automatically
 * forwards any errors to the global error handling middleware.
 *
 * This eliminates the need for repetitive try-catch blocks inside
 * each route handler by catching rejected promises and passing them
 * to `next()`.
 *
 * @param {Function} fn - An async Express route handler function
 * @returns {Function} A wrapped function that handles promise rejections
 *
 * @example
 * router.get('/', asyncHandler(async (req, res) => {
 *   const data = await someAsyncOperation()
 *   res.json(data)
 * }))
 */
function asyncHandler(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

module.exports = asyncHandler