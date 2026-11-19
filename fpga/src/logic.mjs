const bit = value => {
  if (value !== 0 && value !== 1) throw new TypeError('信号必须是 0 或 1');
  return value;
};
export function gate(kind, a, b = 0) {
  bit(a); bit(b);
  switch (kind) {
    case 'AND': return a & b;
    case 'OR': return a | b;
    case 'XOR': return a ^ b;
    case 'NOT': return 1 - a;
    default: throw new RangeError(`未知逻辑门：${kind}`);
  }
}
export function mux(a, b, sel) { bit(a); bit(b); return bit(sel) ? b : a; }
export function bitsToNumber(bits) { return bits.reduce((n, v) => n * 2 + bit(v), 0); }
