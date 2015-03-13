import { circle, triangle, beside } from '../core/image';

const c = circle(10);
const t = triangle(20, 20);

export default beside(
  c.above(t),
  c.beside(t),
  c.below(t),
  t.beside(c),
  c.on(t),
  c.under(t)
);
