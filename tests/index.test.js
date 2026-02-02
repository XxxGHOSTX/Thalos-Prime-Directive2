import { greet, add } from '../src/index.js';

describe('greet', () => {
  test('should greet a user by name', () => {
    expect(greet('Alice')).toBe('Hello, Alice!');
  });

  test('should greet World', () => {
    expect(greet('World')).toBe('Hello, World!');
  });

  test('should throw error for empty name', () => {
    expect(() => greet('')).toThrow('Name must be a non-empty string');
  });

  test('should throw error for non-string name', () => {
    expect(() => greet(123)).toThrow('Name must be a non-empty string');
  });

  test('should throw error for null name', () => {
    expect(() => greet(null)).toThrow('Name must be a non-empty string');
  });
});

describe('add', () => {
  test('should add two positive numbers', () => {
    expect(add(2, 2)).toBe(4);
  });

  test('should add positive and negative numbers', () => {
    expect(add(5, -3)).toBe(2);
  });

  test('should add two negative numbers', () => {
    expect(add(-5, -3)).toBe(-8);
  });

  test('should add zero', () => {
    expect(add(0, 5)).toBe(5);
    expect(add(5, 0)).toBe(5);
  });

  test('should throw error for non-number arguments', () => {
    expect(() => add('2', 2)).toThrow('Both arguments must be numbers');
    expect(() => add(2, '2')).toThrow('Both arguments must be numbers');
  });
});
