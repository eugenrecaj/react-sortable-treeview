export const objectType = (obj) => {
  return Object.prototype.toString.call(obj).slice(8, -1);
};
export const isDefined = (param) => {
  return typeof param != 'undefined';
};
export const isUndefined = (param) => {
  return typeof param == 'undefined';
};
export const isFunction = (param) => {
  return typeof param == 'function';
};
export const isNumber = (param) => {
  return typeof param == 'number' && !isNaN(param);
};
export const isString = (str) => {
  return objectType(str) === 'String';
};
export const isArray = (arr) => {
  return objectType(arr) === 'Array';
};

export const closest = (target, selector) => {
  while (target) {
    if (target.matches && target.matches(selector)) return target;
    target = target.parentNode;
  }
  return null;
};

export const getOffsetRect = (elem) => {
  // (1)
  var box = elem.getBoundingClientRect();

  var body = document.body;
  var docElem = document.documentElement;

  // (2)
  var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
  var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;

  // (3)
  var clientTop = docElem.clientTop || body.clientTop || 0;
  var clientLeft = docElem.clientLeft || body.clientLeft || 0;

  // (4)
  var top = box.top + scrollTop - clientTop;
  var left = box.left + scrollLeft - clientLeft;

  return { top: Math.round(top), left: Math.round(left) };
};

export const getTotalScroll = (elem) => {
  let top = 0;
  let left = 0;

  while ((elem = elem.parentNode)) {
    top += elem.scrollTop || 0;
    left += elem.scrollLeft || 0;
  }

  return { top, left };
};

export const getTransformProps = (x, y) => {
  return {
    transform: 'translate(' + x + 'px, ' + y + 'px)',
  };
};

export const listWithChildren = (list, childrenProp) => {
  const addChildren = list.map((item) => {
    return {
      ...item,
      isCollapsed: item.isCollapsed || true,
      [childrenProp]: item[childrenProp]
        ? listWithChildren(item[childrenProp], childrenProp)
        : [],
    };
  });

  addChildren.forEach(addDepthToChildren(0));

  return addChildren;
};

export const getAllNonEmptyNodesIds = (items, { idProp, childrenProp }) => {
  let childrenIds = [];
  let ids = items
    .filter((item) => item[childrenProp].length)
    .map((item) => {
      childrenIds = childrenIds.concat(
        getAllNonEmptyNodesIds(item[childrenProp], { idProp, childrenProp })
      );
      return item[idProp];
    });

  return ids.concat(childrenIds);
};

export const addDepthToChildren = (d) => (o) => {
  o.depth = d;
  (o.children || []).forEach(addDepthToChildren(d + 1));
};

export const flatDataArray = (into, node) => {
  if (node == null) return into;
  if (Array.isArray(node)) return node.reduce(flatDataArray, into);
  into.push(node);
  return flatDataArray(into, node.children);
};

export const getTreeFromFlatData = ({
  flatData,
  getKey = (node) => node.id,
  getParentKey = (node) => node.parentId,
  rootKey = '0',
}) => {
  if (!flatData) {
    return [];
  }

  const childrenToParents = {};
  flatData.forEach((child) => {
    const parentKey = getParentKey(child);

    if (parentKey in childrenToParents) {
      childrenToParents[parentKey].push(child);
    } else {
      childrenToParents[parentKey] = [child];
    }
  });

  if (!(rootKey in childrenToParents)) {
    return [];
  }

  const trav = (parent) => {
    const parentKey = getKey(parent);
    if (parentKey in childrenToParents) {
      return {
        ...parent,
        children: childrenToParents[parentKey].map((child) => trav(child)),
      };
    }

    return { ...parent };
  };

  return childrenToParents[rootKey].map((child) => trav(child));
};

export const withoutCollapsedChildren = (flatItems, childrenProp) => {
  const expandedNodes = [];
  flatItems.map((wcc) => {
    const isChildPrentCollapsed = flatItems.find((fd) =>
      fd[childrenProp].includes(wcc)
    );
    if (!isChildPrentCollapsed?.isCollapsed) {
      expandedNodes.push(wcc);
    }
  });

  return expandedNodes;
};
