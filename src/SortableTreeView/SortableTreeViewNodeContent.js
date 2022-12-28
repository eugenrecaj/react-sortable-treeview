import React from 'react';
import cx from 'classnames';

import Icon from '../Icon/Icon';

const renderCollapseIcon = ({
  isCollapsed,
  hasChildren,
  node,
  onToggleCollapse,
}) =>
  hasChildren ? (
    <div className='rstw-node-icon' onClick={() => onToggleCollapse(node)}>
      <Icon
        className={cx('rstw-icon', {
          'icon-plus-gray': isCollapsed,
          'icon-minus-gray': !isCollapsed,
        })}
      />
    </div>
  ) : null;

const renderDragHandler = ({ handlerProps, showDragHandler, handler }) =>
  showDragHandler ? (
    handler ? (
      <div {...handlerProps}>{handler}</div>
    ) : (
      <span className='rstw-node-handler' {...handlerProps}>
        <Icon className={cx('icon-handler')} />
      </span>
    )
  ) : null;

const renderDefaultNode = ({
  node,
  handlerProps,
  showDragHandler,
  handler,
}) => (
  <div className='rstw-default-node'>
    {renderDragHandler({ handlerProps, showDragHandler, handler })}
    <span>{node.label}</span>
  </div>
);

const SortableTreeViewNodeContent = ({
  isCollapsed,
  hasChildren,
  node,
  onToggleCollapse,
  handlerProps,
  showDragHandler,
  renderNode,
  dragNode,
  isCopy,
  destinationPlacement,
  renderPlacementArrow,
  rowProps,
  handler,
}) => {
  const renderNodeContent = renderNode({
    node,
    dragHandler: renderDragHandler({ handlerProps, showDragHandler, handler }),
  });

  return (
    <div>
      {renderCollapseIcon({
        isCollapsed,
        hasChildren,
        node,
        onToggleCollapse,
      })}
      {dragNode?.id === node?.id &&
        destinationPlacement &&
        !isCopy &&
        renderPlacementArrow()}
      <div className='rstw-row' {...rowProps}>
        {renderNodeContent ??
          renderDefaultNode({ node, handlerProps, showDragHandler, handler })}
      </div>
    </div>
  );
};

export default SortableTreeViewNodeContent;
