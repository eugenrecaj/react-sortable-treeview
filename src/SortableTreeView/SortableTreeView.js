import React, { Component } from 'react';
import PropTypes from 'prop-types';
import shallowCompare from 'react-addons-shallow-compare';
import update from 'react-addons-update';
import cx from 'classnames';
import { Virtuoso } from 'react-virtuoso';

import '../index.css';

import {
  closest,
  getOffsetRect,
  getTotalScroll,
  getTransformProps,
  listWithChildren,
  addDepthToChildren,
  flatDataArray,
  withoutCollapsedChildren,
} from '../utils';

import SortableTreeViewNode from './SortableTreeViewNode';

class SortableTreeView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treeData: [],
      oldTreeData: null,
      dragNode: null,
      destinationPlacement: null,
      isDirty: false,
      canDrop: true,
      onMoveData: null,
    };

    this.el = null;
    this.elCopyStyles = null;
    this.mouse = {
      last: { x: 0 },
      shift: { x: 0 },
    };
  }

  static propTypes = {
    childrenProp: PropTypes.string,
    className: PropTypes.string,
    canDrop: PropTypes.func,
    group: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    handler: PropTypes.node,
    showDragHandler: PropTypes.bool,
    idProp: PropTypes.string,
    treeData: PropTypes.array,
    onChange: PropTypes.func,
    renderNode: PropTypes.func,
    draggable: PropTypes.bool,
    showLines: PropTypes.bool,
    onMoveNode: PropTypes.func,
    onDragStateChanged: PropTypes.func,
    height: PropTypes.string,
  };
  static defaultProps = {
    childrenProp: 'children',
    canDrop: () => true,
    group: Math.random().toString(36).slice(2),
    idProp: 'id',
    treeData: [],
    onChange: () => {},
    onMoveNode: () => {},
    onDragStateChanged: () => {},
    renderNode: () => null,
    draggable: true,
    showDragHandler: false,
    showLines: true,
    height: '100%',
    handler: null,
  };

  componentDidMount() {
    let { treeData, childrenProp } = this.props;

    treeData = listWithChildren(treeData, childrenProp);

    this.setState({ treeData });
  }

  componentDidUpdate(prevProps) {
    const { treeData: newTreeData, childrenProp } = this.props;
    const isPropsUpdated = shallowCompare(
      { props: prevProps, state: {} },
      this.props,
      {}
    );

    if (isPropsUpdated) {
      this.stopTrackMouse();

      let extra = {};

      this.setState({
        treeData: listWithChildren(newTreeData, childrenProp),
        dragNode: null,
        isDirty: false,
        ...extra,
      });
    }
  }

  componentWillUnmount() {
    this.stopTrackMouse();
  }

  startTrackMouse = () => {
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onDragEnd);
    document.addEventListener('keydown', this.onKeyDown);
  };

  stopTrackMouse = () => {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onDragEnd);
    document.removeEventListener('keydown', this.onKeyDown);
    this.elCopyStyles = null;
  };

  moveNode = (
    { dragNode, pathFrom, pathTo },
    type,
    treeData = this.state.treeData
  ) => {
    const { childrenProp, canDrop, idProp, onMoveNode } = this.props;
    const dragNodeSize = this.getNodeDepth(dragNode);

    const realPathTo = this.getRealNextPath(pathFrom, pathTo, dragNodeSize);

    if (realPathTo.length === 0) return;

    const destinationPath =
      realPathTo.length > pathTo.length ? pathTo : pathTo.slice(0, -1);
    const destinationParent = this.getNodeByPath(destinationPath);

    const canNodeDrop = canDrop({ dragNode, destinationParent });

    const cannotDropParentIntoChild = pathFrom.every(
      (path, index) => path === pathTo[index]
    );

    if (!canNodeDrop || cannotDropParentIntoChild) {
      this.setState({ canDrop: false });
      return;
    }

    if (!this.state.canDrop) {
      this.setState({ canDrop: true });
    }

    if (type !== 'preview') {
      const removePath = this.getSplicePath(pathFrom, {
        numToRemove: 1,
        childrenProp: childrenProp,
      });

      const insertPath = this.getSplicePath(realPathTo, {
        numToRemove: 0,
        treeDataToInsert: [
          { ...dragNode, parent: destinationParent?.id || null },
        ],
        childrenProp: childrenProp,
      });

      treeData = update(treeData, removePath);
      treeData = update(treeData, insertPath);

      this.setState({
        treeData,
        isDirty: true,
        destinationPlacement: null,
        onMoveData: {
          treeData,
          node: dragNode,
          nextParentNode: destinationParent,
          prevNodeIndex: [...pathFrom].pop(),
          nextNodeIndex: [...realPathTo].pop(),
          prevPath: pathFrom,
          nextPath: realPathTo,
        },
      });
    } else {
      let parentPath = pathFrom.slice(0, -1);
      const parentOfDraggedNode = this.getNodeByPath(parentPath);
      const lastSiblingOfDraggedNodePath =
        parentOfDraggedNode[childrenProp].at(-1);
      const dragged = document.querySelector('.rstw-node-' + dragNode[idProp]);

      const lastSiblingOfDraggedNode = document.querySelector(
        '.rstw-node-' + lastSiblingOfDraggedNodePath[idProp]
      );

      const draggedNodeBoundingRect = dragged.getBoundingClientRect();

      const lastSiblingOfDraggedNodeBoundingRect =
        lastSiblingOfDraggedNode.getBoundingClientRect();

      const draggedBottom =
        draggedNodeBoundingRect.top + draggedNodeBoundingRect.height;
      const lastSiblingOfDraggedNodeElBottom =
        lastSiblingOfDraggedNodeBoundingRect.top +
        lastSiblingOfDraggedNodeBoundingRect.height;
      const arrowHeight = lastSiblingOfDraggedNodeElBottom - draggedBottom;

      this.setState({
        destinationPlacement: {
          dragNode,
          pathFrom,
          pathTo,
          placementHeight: arrowHeight + 60,
        },
        onMoveData: {
          treeData,
          node: dragNode,
          nextParentNode: destinationParent,
          prevNodeIndex: [...pathFrom].pop(),
          nextNodeIndex: [...realPathTo].pop(),
          prevPath: pathFrom,
          nextPath: realPathTo,
        },
      });
    }
  };

  tryIncreaseDepth = (dragNode) => {
    const { idProp, childrenProp } = this.props;
    const pathFrom = this.getPathById(dragNode[idProp]);
    const nodeIndex = pathFrom[pathFrom.length - 1];

    if (nodeIndex > 0) {
      const prevSibling = this.getNodeByPath(
        pathFrom.slice(0, -1).concat(nodeIndex - 1)
      );

      const pathTo = pathFrom
        .slice(0, -1)
        .concat(nodeIndex - 1)
        .concat(prevSibling[childrenProp].length);

      let updatedTreeData;
      if (this.isCollapsed(prevSibling)) {
        updatedTreeData = this.onToggleCollapse(prevSibling, true);
      }

      this.moveNode({ dragNode, pathFrom, pathTo }, null, updatedTreeData);
    }
  };

  tryDecreaseDepth = (dragNode) => {
    const { idProp, childrenProp, collapsed } = this.props;
    const pathFrom = this.getPathById(dragNode[idProp]);
    const nodeIndex = pathFrom[pathFrom.length - 1];

    if (pathFrom.length > 1) {
      const parent = this.getNodeByPath(pathFrom.slice(0, -1));

      const isLastNode = nodeIndex + 1 === parent[childrenProp].length;

      let pathTo = pathFrom.slice(0, -1);
      pathTo[pathTo.length - 1] += 1;

      this.moveNode(
        { dragNode, pathFrom, pathTo },
        isLastNode ? null : 'preview'
      );
    }
  };

  getDistanceFromNextSibling = (expandedNode) => {
    const { idProp, group, childrenProp } = this.props;
    const pathFrom = this.getPathById(expandedNode[idProp]);
    const nodeIndex = pathFrom[pathFrom.length - 1];

    const nextSibling = this.getNodeByPath(
      pathFrom.slice(0, -1).concat(nodeIndex + 1)
    );
    if (nextSibling) {
      const expandedNodeEl = document.querySelector(
        '.rstw-' + group + ' .rstw-node-' + expandedNode[idProp]
      );
      const nextSiblingEl = document.querySelector(
        '.rstw-' + group + ' .rstw-node-' + nextSibling[idProp]
      );

      if (nextSiblingEl) {
        return (
          nextSiblingEl.getBoundingClientRect().top -
          expandedNodeEl.getBoundingClientRect().top
        );
      }

      const expandedNodeChildrenLength = expandedNode[childrenProp].length + 1;

      return expandedNodeChildrenLength * 60;
    }

    return 0;
  };

  dragApply = () => {
    const { onChange, onMoveNode } = this.props;
    const { treeData, isDirty, destinationPlacement, onMoveData } = this.state;

    if (onMoveData) {
      onMoveNode({ ...onMoveData });
    }

    this.setState({
      oldTreeData: null,
      dragNode: null,
      isDirty: false,
      canDrop: true,
      destinationPlacement: null,
      onMoveData: null,
    });

    if (destinationPlacement) {
      this.moveNode({ ...destinationPlacement });
    }

    if (isDirty) {
      onChange({ treeData });
    }
  };

  dragRevert = () => {
    const { oldTreeData } = this.state;

    this.setState({
      treeData: oldTreeData,
      oldTreeData: null,
      dragNode: null,
      isDirty: false,
      canDrop: true,
      destinationPlacement: null,
    });
  };

  getPathById = (id, treeData = this.state.treeData) => {
    const { idProp, childrenProp } = this.props;
    let path = [];

    treeData.every((node, i) => {
      if (node[idProp] === id) {
        path.push(i);
      } else if (node[childrenProp]) {
        const childrenPath = this.getPathById(id, node[childrenProp]);

        if (childrenPath.length) {
          path = path.concat(i).concat(childrenPath);
        }
      }

      return path.length === 0;
    });

    return path;
  };

  getNodeByPath = (path, treeData = this.state.treeData) => {
    const { childrenProp } = this.props;
    let node = null;

    path.forEach((index) => {
      const list = node ? node[childrenProp] : treeData;
      node = list[index];
    });

    return node;
  };

  getNodeDepth = (node) => {
    const { childrenProp } = this.props;
    let level = 1;

    if (node[childrenProp].length > 0) {
      const childrenDepths = node[childrenProp].map(this.getNodeDepth);
      level += Math.max(...childrenDepths);
    }

    return level;
  };

  getSplicePath = (path, options = {}) => {
    const splicePath = {};
    const numToRemove = options.numToRemove || 0;
    const treeDataToInsert = options.treeDataToInsert || [];

    if (treeDataToInsert.length) {
      treeDataToInsert.forEach(addDepthToChildren(path.length - 1));
    }

    const lastIndex = path.length - 1;
    let currentPath = splicePath;

    path.forEach((index, i) => {
      if (i === lastIndex) {
        currentPath.$splice = [[index, numToRemove, ...treeDataToInsert]];
      } else {
        const nextPath = {};
        currentPath[index] = { [options.childrenProp]: nextPath };
        currentPath = nextPath;
      }
    });

    return splicePath;
  };

  getRealNextPath = (prevPath, nextPath) => {
    const { childrenProp } = this.props;
    const ppLastIndex = prevPath.length - 1;
    const npLastIndex = nextPath.length - 1;

    if (prevPath.length < nextPath.length) {
      // move into depth
      let wasShifted = false;

      return nextPath.map((nextIndex, i) => {
        if (wasShifted) {
          return i === npLastIndex ? nextIndex + 1 : nextIndex;
        }

        if (typeof prevPath[i] !== 'number') {
          return nextIndex;
        }

        if (nextPath[i] > prevPath[i] && i === ppLastIndex) {
          wasShifted = true;
          return nextIndex - 1;
        }

        return nextIndex;
      });
    } else if (prevPath.length === nextPath.length) {
      if (nextPath[npLastIndex] > prevPath[npLastIndex]) {
        const target = this.getNodeByPath(nextPath);

        if (
          target[childrenProp] &&
          target[childrenProp].length &&
          !this.isCollapsed(target)
        ) {
          return nextPath
            .slice(0, -1)
            .concat(nextPath[npLastIndex] - 1)
            .concat(0);
        }
      }
    }

    return nextPath;
  };

  getNodeOptions = () => {
    const {
      renderNode,
      showDragHandler,
      idProp,
      childrenProp,
      group,
      draggable,
      showLines,
      handler,
    } = this.props;
    const { dragNode, destinationPlacement, canDrop } = this.state;

    return {
      dragNode,
      idProp,
      childrenProp,
      renderNode,
      showDragHandler,
      destinationPlacement,
      group,
      canDrop,
      draggable,
      showLines,
      handler,

      onDragStart: this.onDragStart,
      onMouseEnter: this.onMouseEnter,
      isCollapsed: this.isCollapsed,
      onToggleCollapse: this.onToggleCollapse,
      getDistanceFromNextSibling: this.getDistanceFromNextSibling,
      getPathById: this.getPathById,
      getNodeByPath: this.getNodeByPath,
      isNodeOfTypeLast: this.isNodeLast,
    };
  };

  isCollapsed = (node) => node.isCollapsed;

  onDragStart = (e, node) => {
    const { onDragStateChanged } = this.props;
    if (e) {
      e.preventDefault();
      e.stopPropagation();

      onDragStateChanged({ isDragging: true, node });
    }

    this.el = closest(e.target, '.rstw-row');

    this.startTrackMouse();
    this.onMouseMove(e);

    this.setState({
      dragNode: node,
      oldTreeData: this.state.treeData,
    });
  };

  onDragEnd = (e, isCancel) => {
    const { onDragStateChanged } = this.props;
    const { dragNode } = this.state;
    e && e.preventDefault();

    onDragStateChanged({ isDragging: false, node: dragNode });

    this.stopTrackMouse();
    this.el = null;

    isCancel ? this.dragRevert() : this.dragApply();
  };

  onMouseMove = (e) => {
    const { group } = this.props;
    const { dragNode } = this.state;
    const { clientX, clientY } = e;
    const threshold = 30;
    const transformProps = getTransformProps(clientX, clientY);
    const elCopy = document.querySelector(
      '.rstw-' + group + ' .rstw-drag-layer > .rstw-list'
    );

    if (!this.elCopyStyles) {
      const offset = getOffsetRect(this.el);
      const scroll = getTotalScroll(this.el);

      this.elCopyStyles = {
        marginTop: offset.top - clientY - scroll.top,
        marginLeft: offset.left - clientX - scroll.left,
        ...transformProps,
      };
    } else {
      this.elCopyStyles = {
        ...this.elCopyStyles,
        ...transformProps,
      };
      for (let key in transformProps) {
        if (transformProps.hasOwnProperty(key)) {
          elCopy.style[key] = transformProps[key];
        }
      }

      const diffX = clientX - this.mouse.last.x;
      if (
        (diffX >= 0 && this.mouse.shift.x >= 0) ||
        (diffX <= 0 && this.mouse.shift.x <= 0)
      ) {
        this.mouse.shift.x += diffX;
      } else {
        this.mouse.shift.x = 0;
      }
      this.mouse.last.x = clientX;

      if (Math.abs(this.mouse.shift.x) > threshold) {
        if (this.mouse.shift.x > 0) {
          this.tryIncreaseDepth(dragNode);
        } else {
          this.tryDecreaseDepth(dragNode);
        }

        this.mouse.shift.x = 0;
      }
    }
  };

  onMouseEnter = (e, node) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const { idProp } = this.props;
    const { dragNode } = this.state;
    if (dragNode[idProp] === node[idProp]) return;

    const pathFrom = this.getPathById(dragNode[idProp]);
    const pathTo = this.getPathById(node[idProp]);

    this.moveNode({ dragNode, pathFrom, pathTo });
  };

  onToggleCollapse = (node, isGetter) => {
    let { treeData } = this.state;
    const { childrenProp, idProp } = this.props;
    const nodePath = this.getPathById(node[idProp]);

    function changeCollapsed(obj, isCollapsed) {
      if (obj.children) {
        for (let i = 0; i < obj.children.length; i++) {
          if (!obj.isCollapsed) {
            obj.isCollapsed = true;
          }

          changeCollapsed(obj.children[i], isCollapsed);
        }
      }
    }

    if (!node.isCollapsed) {
      changeCollapsed(node, true);
    } else node.isCollapsed = false;

    let toggledNode = {
      ...node,
    };

    const insertPath = this.getSplicePath(nodePath, {
      numToRemove: 1,
      treeDataToInsert: [toggledNode],
      childrenProp: childrenProp,
    });

    treeData = update(treeData, insertPath);

    if (isGetter) {
      return treeData;
    } else {
      this.setState({ treeData });
    }
  };

  onKeyDown = (e) => {
    if (e.which === 27) {
      // ESC
      this.onDragEnd(null, true);
    }
  };

  renderDragLayer = () => {
    const { group, idProp } = this.props;
    const { dragNode } = this.state;
    const el = document.querySelector(
      '.rstw-' + group + ' .rstw-node-' + dragNode[idProp]
    );

    let listStyles = {};
    if (el) {
      listStyles.width = el.clientWidth;
    }
    if (this.elCopyStyles) {
      listStyles = {
        ...listStyles,
        ...this.elCopyStyles,
      };
    }

    const options = this.getNodeOptions();

    return (
      <div className='rstw-drag-layer'>
        <ol className='rstw-list' style={listStyles}>
          <SortableTreeViewNode node={dragNode} options={options} isCopy />
        </ol>
      </div>
    );
  };

  isNodeLast = (node) => {
    if (node) {
      const { idProp, childrenProp } = this.props;
      const { treeData } = this.state;
      const nodePath = this.getPathById(node[idProp]);
      if (node.parent) {
        nodePath.splice(-1);
      }
      const nodeParent = this.getNodeByPath(nodePath);

      let isNodeLastChild;

      const nodeIndexIntoParentsChildren = nodeParent[childrenProp].findIndex(
        (c) => c.id === node.id
      );
      if (nodeIndexIntoParentsChildren === -1) {
        const rootNodeIndex = treeData.findIndex((c) => c.id === node.id);

        isNodeLastChild = rootNodeIndex + 1 === treeData.length;
      } else {
        isNodeLastChild =
          nodeIndexIntoParentsChildren + 1 === nodeParent[childrenProp].length;
      }

      return { isNodeLastChild };
    }

    return { isNodeLastChild: true };
  };

  render() {
    const { group, className, childrenProp, height } = this.props;
    const { treeData, dragNode } = this.state;
    const options = this.getNodeOptions();

    const flatData = flatDataArray([], treeData);

    const treeWithoutCollapsedChildren = withoutCollapsedChildren(
      flatData,
      childrenProp
    );

    return (
      <div
        className={cx(
          className,
          'react-sortable-treeview',
          'rstw-' + group,
          {
            'is-drag-active': dragNode,
          },
          'rstw-list rstw-group'
        )}
      >
        <Virtuoso
          style={{ height }}
          data={treeWithoutCollapsedChildren}
          itemContent={(index, node) => {
            const { isNodeLastChild } = this.isNodeLast(node);

            return (
              <SortableTreeViewNode
                key={index}
                node={node}
                options={options}
                isLastChild={isNodeLastChild}
              />
            );
          }}
        />

        {dragNode && this.renderDragLayer()}
      </div>
    );
  }
}

export default SortableTreeView;
