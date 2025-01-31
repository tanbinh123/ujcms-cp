/**
 * 将数组数据转换成树形数据。根据列表数据的 parentId 属性判断上下级关系。
 *
 * @param data 数组数据
 * @returns 树形数据
 */
export const toTree = (data: any[]): any[] => {
  data.forEach((item) => {
    // eslint-disable-next-line no-param-reassign
    item.children = data.filter((child) => {
      if (child.parentId === item.id) {
        // eslint-disable-next-line no-param-reassign
        child.root = false;
        return true;
      }
      return false;
    });
    if (item.children.length <= 0) {
      // eslint-disable-next-line no-param-reassign
      item.leaf = true;
    }
  });
  return data.filter((item) => item.root !== false);
};

const doFlatTree = (data: any[], tree: any[], depth: number) => {
  tree.forEach((it) => {
    const item = { ...it, depth };
    data.push(item);
    if (item.children) {
      doFlatTree(data, item.children, depth + 1);
      // eslint-disable-next-line no-param-reassign
      item.children = undefined;
    }
  });
};

/**
 * 将树形数据按照树的结构转换成数组数据。使用树的 children 属性获取子节点。
 *
 * @param tree 树形对象
 * @returns  数组对象
 */
export const flatTree = (tree: any[]): any[] => {
  const data = new Array<any>();
  doFlatTree(data, tree, 0);
  return data;
};

export const findTreeItem = (tree: any[], predicate: (value: any, index: number, obj: any[]) => unknown): any => {
  for (let i = 0, len = tree.length; i < len; i += 1) {
    let result;
    if (tree[i].children) {
      result = findTreeItem(tree[i].children, predicate);
      if (result) return result;
    }
    result = tree.find(predicate);
    if (result) return result;
  }
  return undefined;
};

export const sortTreeData = (data: any[]): any[] => flatTree(toTree(data));

const doDisableSubtree = (data: any[], disabledId: any, disabled: boolean): any[] => {
  data.forEach((item) => {
    if (disabled || item.id === disabledId) {
      // eslint-disable-next-line no-param-reassign
      item.disabled = true;
    }
    doDisableSubtree(item.children, disabledId, item.disabled);
  });
  return data;
};

export const disableSubtree = (data: any[], disabledId?: string | number): any[] => {
  if (!disabledId) return data;
  return doDisableSubtree(data, disabledId, false);
};
