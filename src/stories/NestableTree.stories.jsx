import React, { useEffect, useState } from 'react';

import SortableTreeView, {
  getTreeFromFlatData,
  getFlatDataFromTree,
} from '../../dist/index.es';
import { treeData, flatData } from './data';
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

export const CannotDropToRootNode = Template.bind({});
CannotDropToRootNode.args = {
  treeData: treeData,
  showDragHandler: true,
  canDrop: ({ destinationParent }) => {
    return !destinationParent ? false : true;
  },
};

export const DynamicTree = () => {
  const [td, setTD] = useState(flatData);

  const addNode = (node) => {
    const newFlatData = [...td];
    const newChild = {
      parent: node.id,
      label: 'test',
      id: Math.random().toString(12).slice(2),
    };

    newFlatData.push(newChild);
    setTD(newFlatData);
  };

  const removeNode = (node) => {
    const newFlatData = [...td];
    const newTreeFlatData = newFlatData.filter((n) => n.id !== node.id);

    setTD(newTreeFlatData);
  };

  const customDynamicNode = ({ node, dragHandler }) => (
    <div style={styles}>
      {dragHandler}
      <span>{node.label}</span>
      <button onClick={() => addNode(node)} style={{ marginLeft: '10px' }}>
        Add Child
      </button>
      <button onClick={() => removeNode(node)} style={{ marginLeft: '10px' }}>
        Remove Child
      </button>
    </div>
  );

  return (
    <SortableTreeView
      treeData={getTreeFromFlatData({
        flatData: td,
        getKey: (node) => node.id,
        getParentKey: (node) => node.parent,
        rootKey: null,
      })}
      renderNode={customDynamicNode}
      onChange={(treeData) => {
        setTD(getFlatDataFromTree(treeData));
      }}
    />
  );
};
