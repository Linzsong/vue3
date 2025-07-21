import { isObject } from "@vue/shared";

console.log(isObject({}));

function fn(a, b) {
  return a + b;
}

export { fn };
