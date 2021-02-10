function MovieValidationError(message) {
  this.name = 'MovieValidationError';
  this.message = message || 'Filme inválido';
  this.stack = new Error().stack;
}
MovieValidationError.prototype = Object.create(MovieValidationError.prototype);
MovieValidationError.prototype.constructor = MovieValidationError;

module.exports = MovieValidationError;
