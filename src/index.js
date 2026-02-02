/**
 * Main application entry point
 */

/**
 * Greets a user by name
 * @param {string} name - The name to greet
 * @returns {string} The greeting message
 */
export function greet(name) {
  if (!name || typeof name !== 'string') {
    throw new Error('Name must be a non-empty string');
  }
  return `Hello, ${name}!`;
}

/**
 * Adds two numbers
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} Sum of a and b
 */
export function add(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new Error('Both arguments must be numbers');
  }
  return a + b;
}

/**
 * Main function
 */
function main() {
  console.log('Thalos Prime Directive 2 - System Initialized');
  console.log(greet('World'));
  console.log(`2 + 2 = ${add(2, 2)}`);
}

// Run main if this is the entry point
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
