import { activeSub } from './effect';

enum ReactiveFlags {
  IS_REF = '__v_isRef',
}

/**
 * 链表节点
 */
interface Link {
  // 保存 effect
  sub: Function;
  // 下一个节点
  nextSub: Link | undefined;
  // 上一个节点
  prevSub: Link | undefined;
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
      this.subs = activeSub;
      const newLink: Link = {
        sub: activeSub,
        nextSub: undefined,
        prevSub: undefined,
      };

      /**
       * 关联链表关系，分2种情况
       * 1. 有尾节点，就往尾节点后面添加
       * 2. 如果没有尾节点，则表示第一次关联，头尾节点相同
       */
      if (this.subsTail) {
        this.subsTail.nextSub = newLink;
        newLink.prevSub = this.subsTail;
        // this.subsTail = newLink
      } else {
        this.subs = newLink
      }
      this.subsTail = newLink
    }
    return this._value;
  }

  set value(newValue) {
    this._value = newValue;

    // 通知 effect 重新执行, 获取到最新的值
    let currentSub = this.subs
    currentSub.sub();
    while (currentSub.nextSub) {
      currentSub = currentSub.nextSub
      currentSub.sub();
    }
  }
}

export function ref(value) {
  return new RefImpl(value);
}

// 判断是否为 ref
export function isRef(value) {
  return !!(value && value[ReactiveFlags.IS_REF]);
}
