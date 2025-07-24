
/**
 * 链表节点
 */
export interface Link {
  // 保存 effect
  sub: Function;
  // 下一个节点
  nextSub: Link | undefined;
  // 上一个节点
  prevSub: Link | undefined;
}

/**
 * 链接链表关系
 * @param dep
 * @param sub
 */
export function link(dep, sub) {
  const newLink: Link = {
    sub,
    nextSub: undefined,
    prevSub: undefined,
  };

  /**
   * 关联链表关系，分2种情况
   * 1. 有尾节点，就往尾节点后面添加
   * 2. 如果没有尾节点，则表示第一次关联，头尾节点相同
   */
  if (dep.subsTail) {
    dep.subsTail.nextSub = newLink;
    newLink.prevSub = dep.subsTail;
  } else {
    dep.subs = newLink;
  }
  dep.subsTail = newLink;
}


/**
 * 传播更新的函数
 * @param subs
 */
export function propagate(subs) {
  // 通知 effect 重新执行, 获取到最新的值
  let link = subs;
  let queuedEffect = [];
  while (link) {
    queuedEffect.push(link.sub);
    link = link.nextSub;
  }
  queuedEffect.forEach(effect => effect());
}