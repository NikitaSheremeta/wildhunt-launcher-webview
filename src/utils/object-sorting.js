export function objectSorting(input, order) {
  const output = {};

  for (let i = 0; i < order.length; i++) {
    if (Object.prototype.hasOwnProperty.call(input, order[i])) {
      output[order[i]] = input[order[i]];
    }
  }

  return output;
}
