import { triangle } from '../core/image';

export default function sierpinski(n) {
  if(n == 0) {
    return triangle(10, 10);
  } else {
    let smaller = sierpinski(n-1);
    return smaller.above(smaller.beside(smaller));
  }
}
