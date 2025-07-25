// 用来保存当前页面的 effect
export let activeSub;

export class ReactiveEffect {
  constructor(public fn) {}

  run() {
    // 将当前 effect 保存起来，用来处理嵌套逻辑
    const prevSub = activeSub;
    // 每次执行 fn 之前，把 this 放到 effectSub 上面
    activeSub = this;
    try {
      return this.fn();
    } finally {
      // 执行完成后，把 activeSub 重置为 undefined
      activeSub = prevSub;
    }
  }

  /**
   * 通知更新的方法, 如果依赖的数据发生变化，会调用这个函数
   */
  notify() {
    this.scheduler();
  }

  /**
   * 默认调用 run，如果用户穿了，会被实例属性覆盖
   */
  scheduler() {
    this.run();
  }
}

export function effect(fn: any, options) {
  const e = new ReactiveEffect(fn);
  // scheduler 实例属性，覆盖原来的原型方法 scheduler
  Object.assign(e, options);

  e.run();

  /**
   * 绑定函数的 this
   */
  const runner = () => e.run.call(e);
  /**
   * 把 effect 的实例放到函数属性中 和 bind 类似
   */
  // runner.effect = e

  return runner
}
