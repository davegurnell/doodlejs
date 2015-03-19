import _ from 'underscore';

import {
	Circle,
	Rectangle,
	Triangle,
	Beside,
	Above,
	Overlay
} from './image-ast.js';

export function circle(radius) {
  return new Circle(radius);
}

export function rectangle(width, height) {
  return new Rectangle(width, height);
}

export function triangle(width, height) {
  return new Triangle(width, height);
}

function createExpression(createPair) {
  return function(a, ...b) {
    let ans = _.reduce(b, createPair, a);
    return ans;
  }
}

export const beside = createExpression((a, b) => new Beside(a, b));
export const above  = createExpression((a, b) => new Above(a, b));
export const below  = createExpression((a, b) => new Above(b, a));
export const on     = createExpression((a, b) => new Overlay(a, b));
export const under  = createExpression((a, b) => new Overlay(b, a));
