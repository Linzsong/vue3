import { activeSub } from './effect';
import { propagate, link,  type Link } from './system';

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

  /**
   * 订阅者链表的头节点
   */
  subs: Link;

  /**
   * 订阅者链表的尾节点
   */
  subsTail: Link;

  constructor(value) {
    this._value = value;
  }

  get value() {
    if (activeSub) {
      // 如果 activeSub 存在，则保存起来，等到更新时重新出发
      trackRef(this);
    }
    return this._value;
  }

  set value(newValue) {
    this._value = newValue;
    triggerRef(this);
  }
}

// 判断是否为 ref
export function isRef(value) {
  return !!(value && value[ReactiveFlags.IS_REF]);
}

/**
 * 收集依赖，建立 ref 和 effect 之间的链表关系
 * @param dep
 */
export function trackRef(dep) {
  if (activeSub) {
    link(dep, activeSub);
  }
}

/**
 * 触发 ref 关联的 effect 重新执行
 * @param dep
 */
export function triggerRef(dep) {
  if(dep.subs) propagate(dep.subs);
}

export function ref(value) {
  return new RefImpl(value);
}