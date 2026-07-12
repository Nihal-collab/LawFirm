/**
 * Escapes characters that have special meaning in regular expressions.
 * Used to safely embed user-provided strings inside Dynamic Regular Expressions.
 * Prevents RegExp Denial of Service (ReDoS) and unexpected matches.
 */
const escapeRegex = (string) => {
  if (typeof string !== 'string') return '';
  return string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};

module.exports = { escapeRegex };
