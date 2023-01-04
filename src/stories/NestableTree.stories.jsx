import { node } from 'prop-types';
import React, { useState } from 'react';

import SortableTreeView from '../SortableTreeView';
import { getTreeFromFlatData } from '../utils';
import { dynamicData, treeData, extraData } from './data';
import './index.css';

export default {
  title: 'Example/SortableTreeView',
  component: SortableTreeView,
  parameters: {
    layout: 'fullscreen',
  },
};

const Template = (args) => <SortableTreeView {...args} />;

export const Default = Template.bind({});
Default.args = {
  treeData: treeData,
};

export const WithDragHandler = Template.bind({});
WithDragHandler.args = {
  treeData: treeData,
  showDragHandler: true,
};

const styles = {
  position: 'relative',
  background: 'orange',
  display: 'flex',
  height: '100%',
  padding: '0 10px',
  alignItems: 'center',
};

const customNode = ({ node, dragHandler }) => (
  <div style={styles}>
    {dragHandler}
    <span>{node.label}</span>
    <select style={{ marginLeft: '10px' }} defaultValue='Car'>
      <option value='Car'>Car</option>
      <option value='Plane'>Plane</option>
    </select>
  </div>
);

export const CustomNode = Template.bind({});
CustomNode.args = {
  treeData: treeData,
  showDragHandler: true,
  renderNode: customNode,
};

const handlerStyles = {
  width: '25px',
  height: '25px',
  background: 'steelblue',
  cursor: 'move',
  borderRadius: '50%',
  marginRight: '10px',
};

export const CustomHandler = Template.bind({});
CustomHandler.args = {
  treeData: treeData,
  showDragHandler: true,
  handler: <div style={handlerStyles} />,
};

export const CanNodeDrop = Template.bind({});
CanNodeDrop.args = {
  treeData: treeData,
  showDragHandler: true,
  canDrop: ({ destinationParent }) => {
    return !destinationParent ? false : true;
  },
};

export const DynamicRendering = () => {
  const [dData, setDData] = useState(dynamicData);
  const onVisibilityToggle = (node, isCollapsed) => {
    if (!isCollapsed) {
      // create add node to path function to replace the expanded node
      return new Promise((resolve) => {
        setTimeout(() => {
          const nodeChildren = extraData.filter((ed) => ed.parent === node.id);
          setDData([
            ...dData.map((d) => {
              if (d.id === node.id) {
                d.isCollapsed = isCollapsed;
              }
              return d;
            }),
            ...nodeChildren,
          ]);
          resolve();
        }, 1000);
      });
    }
  };
  console.log(dData);
  return (
    <SortableTreeView
      treeData={getTreeFromFlatData({
        flatData: dData,
        rootKey: null,
        getKey: (node) => node.id,
        getParentKey: (node) => node.parent,
      })}
      onVisibilityToggle={onVisibilityToggle}
    />
  );
};
