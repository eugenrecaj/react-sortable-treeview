import React, { createElement } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import SortableTreeViewNodeContent from './SortableTreeViewNodeContent';

const SortableTreeViewNode = (props) => {
  const { node, isCopy, options, isLastChild } = props;
  const {
    dragNode,
    renderNode,
    showDragHandler,
    idProp,
    childrenProp,
    destinationPlacement,
    canDrop,
    draggable,
    showLines,
    handler,
    previewPath,
    previewOriginalPath,
  } = options;

  const { isCollapsed, depth } = node;

  const isDragging = !isCopy && dragNode && dragNode[idProp] === node[idProp];
  const hasChildren =
    (node[childrenProp] && node[childrenProp].length > 0) || node.hasChildren;
  const previewPathOpt = dragNode?.[idProp] === node?.[idProp] && previewPath;

  let rowProps = {};
  let handlerProps = {};

  if (!isCopy) {
    if (!draggable) {
      rowProps = {
        ...rowProps,
      };
    } else if (dragNode) {
      rowProps = {
        ...rowProps,
        onMouseEnter: (e) => options.onMouseEnter(e, node),
      };
    } else {
      handlerProps = {
        ...handlerProps,
        draggable: true,
        onDragStart: (e) => options.onDragStart(e, node),
      };
    }
  }

  if (showDragHandler && draggable) {
    handlerProps = { ...handlerProps };
  } else {
    rowProps = {
      ...rowProps,
      ...handlerProps,
    };
  }

  const baseClassName = 'rstw-node' + (isCopy ? '-copy' : '');
  const nodeProps = {
    className: cx(
      baseClassName,
      baseClassName + '-' + node[idProp],
      `depth-${depth}`,
      {
        'is-dragging on-drag': isDragging,
        'cannot-drop': !canDrop,
        [baseClassName + '--last-child']: isLastChild,
        [baseClassName + '--with--no-children']: !hasChildren,
        [baseClassName + '--with-children']: hasChildren,
        [baseClassName + '--children-open']: hasChildren && !isCollapsed,
        [baseClassName + '--children-collapsed']: hasChildren && isCollapsed,
      }
    ),
  };

  const renderParentLine = () => {
    if (hasChildren && !isCollapsed && showLines) {
      return createElement('div', { className: 'rstw-parentLine' });
    }

    return null;
  };

  const renderDepthLinesOnPreview = () => {
    if (previewOriginalPath && dragNode[idProp] === node[idProp]) {
      return previewOriginalPath.map((_, i) => {
        const nodePaths = options.getNodeByPath(
          previewOriginalPath.slice(0, i)
        );

        if (nodePaths) {
          const { isNodeLastChild } = options.isNodeOfTypeLast(nodePaths);

          return createElement('div', {
            className: `rstw-depthLine rstw-depthLine-preview  ${
              !isNodeLastChild ? 'rstw-showdepthLine' : undefined
            }`,
            key: i,
            style: {
              width: '40px',
              position: 'absolute',
              marginLeft: (i - 1) * 40,
            },
          });
        }

        return null;
      });
    }

    return null;
  };

  const renderDepthLines = () => {
    if (!isCopy && showLines) {
      let nodePath = previewPathOpt || options.getPathById(node[idProp]);

      return nodePath.map((_, i) => {
        const nodePaths = options.getNodeByPath(nodePath.slice(0, i));

        if (nodePaths) {
          const { isNodeLastChild } = options.isNodeOfTypeLast(nodePaths);

          return createElement('div', {
            className: `rstw-depthLine ${
              !isNodeLastChild ? 'rstw-showdepthLine' : undefined
            }`,
            key: i,
            style: { width: '40px' },
          });
        }

        return null;
      });
    }

    return null;
  };

  const renderLines = () => {
    if (!isCopy && showLines && !previewPathOpt) {
      if (isLastChild) {
        return createElement('div', {
          className: 'rstw-lines rstw-halfVerticalLine rstw-fullHotizontalLine',
        });
      }

      return createElement('div', {
        className: 'rstw-lines rstw-fullVerticalLine rstw-fullHotizontalLine',
      });
    } else if (previewOriginalPath && dragNode[idProp] === node[idProp]) {
      return createElement('div', {
        className: 'rstw-lines-preview rstw-fullVerticalLine',
        style: { marginLeft: (previewOriginalPath.length - 1) * 40 },
      });
    }

    return null;
  };

  const renderPlacementArrow = () => {
    const { placementHeight } = destinationPlacement;
    if (previewPathOpt?.length > depth) {
      return null;
    }

    return createElement(
      'div',
      {
        className: 'rstw-placementArrow',
      },
      createElement('div', {
        style: {
          width: '10px',
          height: `${placementHeight - 65}px`,
          background: !canDrop ? '#e45372' : '#4682b4',
          position: 'absolute',
        },
      }),
      createElement('div', {
        style: {
          width: '20px',
          height: `10px`,
          background: !canDrop ? '#e45372' : '#4682b4',
          position: 'absolute',
          marginTop: `${placementHeight - 65}px`,
        },
      }),
      createElement('div', {
        style: {
          width: 0,
          height: 0,
          borderTop: '15px solid transparent',
          borderLeft: `25px solid ${!canDrop ? '#e45372' : '#4682b4'}`,
          borderBottom: '15px solid transparent',
          position: 'absolute',
          marginLeft: '20px',
          marginTop: `${placementHeight - 75}px`,
        },
      })
    );
  };

  return (
    <div
      {...nodeProps}
      data-selector={depth}
      style={{
        opacity: isCopy ? 0.5 : 1,
        marginLeft: !showLines && !isCopy ? `${(depth + 1) * 40}px` : 0,
      }}
    >
      <div className='rstw-node'>
        {renderDepthLinesOnPreview()}
        {renderDepthLines()}
        {renderLines()}
        {renderParentLine()}

        <SortableTreeViewNodeContent
          node={node}
          handlerProps={handlerProps}
          showDragHandler={showDragHandler}
          renderNode={renderNode}
          isCollapsed={isCollapsed}
          hasChildren={hasChildren}
          onToggleCollapse={options.onToggleCollapse}
          dragNode={dragNode}
          isCopy={isCopy}
          destinationPlacement={destinationPlacement}
          renderPlacementArrow={renderPlacementArrow}
          rowProps={rowProps}
          handler={handler}
        />
      </div>
    </div>
  );
};

SortableTreeViewNode.propTypes = {
  node: PropTypes.object,
  isCopy: PropTypes.bool,
  options: PropTypes.object,
  index: PropTypes.number,
  isLastChild: PropTypes.bool,
};

export default SortableTreeViewNode;
