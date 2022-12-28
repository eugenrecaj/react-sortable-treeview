import React from 'react';

import SortableTreeView from '../SortableTreeView';

export default {
  title: 'Example/SortableTreeView',
  component: SortableTreeView,
  parameters: {
    layout: 'fullscreen',
  },
};

const treeData = [
  {
    id: '0',
    label: 'Documents',
    parent: null,
    children: [
      {
        id: '0-0',
        label: 'Document 1-1',
        parent: '0',
        children: [
          {
            id: '0-1-1',
            label: 'Document-0-1.doc',
            parent: '0-0',
            children: [
              {
                id: '0-2-2',
                label: 'Document 2-2',
                parent: '0-1-1',
                children: [
                  {
                    id: '0-2-3',
                    label: 'Document-0-3.doc',
                    parent: '0-2-2',
                  },
                  {
                    id: '0-2-4',
                    label: 'Document-0-4.doc',
                    parent: '0-2-2',
                  },
                  {
                    id: '0-2-5',
                    label: 'Document-0-5.doc',
                    parent: '0-2-2',
                  },
                ],
              },
            ],
          },
          {
            id: '0-1-2',
            label: 'Document-0-2.doc',
            parent: '0-0',
          },
        ],
      },
    ],
  },
];

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
