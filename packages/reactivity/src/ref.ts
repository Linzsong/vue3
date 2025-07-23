import { activeSub } from './effect';

enum ReactiveFlags {
  IS_REF = '__v_isRef',
}

/**
 * Ref 类
 */
class RefImpl {
  // 保存实际的值
  _value;
  // ref 标记，证明是一个 ref
  [ReactiveFlags.IS_REF] = true;

  // 保存与 effect 的关联关系
  subs;

  constructor(value) {
    this._value = value;
  }

  get value() {
    if (activeSub) {
      // 如果 activeSub 存在，则保存起来，等到更新时重新出发
      this.subs = activeSub;
    }
    return this._value;
  }

  set value(newValue) {
    this._value = newValue;

    // 通知 effect 重新执行, 获取到最新的值
    this.subs();
  }
}

export function ref(value) {
  return new RefImpl(value);
}

// 判断是否为 ref
export function isRef(value) {
  return !!(value && value[ReactiveFlags.IS_REF]);
}
