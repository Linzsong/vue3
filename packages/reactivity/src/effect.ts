
// 用来保存当前页面的 effect
export let activeSub
export function effect(fn: any) {
  activeSub = fn
  activeSub()
  activeSub = null
}