> Drag & drop hierarchical nested/sorted list made as a react component. Checkout the [Storybook](https://react-sortable-treeview.vercel.app/?path=/story/example-sortabletreeview--default)

## Getting started

Install `react-sortable-treeview`.

```sh
# NPM
npm install react-sortable-treeview --save

# YARN
yarn add react-sortable-treeview
```

```js
import SortableTreeView from 'react-sortable-treeview';
```

## Usage

```jsx
import React, { useState } from 'react';
import SortableTreeView from 'react-sortable-treeview';

export const TreeView = () => {
  const [treeData, setTreeData] = useState([
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
  ]);

  return (
    <div style={{ height: '100%' }}>
      <SortableTreeView
        treeData={treeData}
        onChange={(treeData) => setTreeData(treeData)}
      />
    </div>
  );
};
```

## Props

| treeData<br/>_(required)_ | object[]         | Tree data with the following keys: <div>`id` is the identifier of the node.</div><div>`label` is the title of the node.</div><div>`parent` represents the connection between parent node and it's children.</div><div>`isCollapsed` shows children of the node if false, or hides them if true. Defaults to true.</div><div>`children` is an array of child nodes belonging to the node.</div><div>**Example**: `[ { label: 'main', parent: null, id: 1 }, { label: 'docs', id: 2, parent: null, children: [{ id: 3, label: 'doc2', parent: '2' }]}]` |
| ------------------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| onVisibilityToggle        | func             | Called after children nodes collapsed or expanded.<div>`({ treeData: object[], node: object, isCollapsed: bool }): void `</div>                                                                                                                                                                                                                                                                                                                                                                                                                       |
| onChange                  | func             | Called whenever tree data changed. Just like with React input elements, you have to update your own component's data to see the changes reflected.<div>`( treeData: object[] ): void`</div>                                                                                                                                                                                                                                                                                                                                                           |
| onMoveNode                | func             | Called after node move operation. <div>`({ treeData: object[], node: object, nextParentNode: object, prevPath: number[] or string[], prevTreeIndex: number, nextPath: number[] or string[], nextTreeIndex: number }): void`</div>                                                                                                                                                                                                                                                                                                                     |
| onDragStateChanged        | func             | Called when a drag is initiated or ended. <div>`({ isDragging: bool, node: object }): void`</div>                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| canDrop                   | func             | Return false to prevent node from dropping in the given location. <div>`({ node: object, destinationParent: object }): bool`</div>                                                                                                                                                                                                                                                                                                                                                                                                                    |
| draggable                 | bool             | Set prop to `false` to disable dragging on all nodes. Defaults to `true`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| className                 | string           | Class name for the container wrapping the tree                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| group                     | string or number | Different group numbers may be passed if you have more than one nestable component on a page and want some extra styles. Default is a random string.                                                                                                                                                                                                                                                                                                                                                                                                  |
| handler                   | node             | Custom style for the drag handler.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| idProp                    | string           | Optional name of property for id. Defaults `id`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| childrenProp              | string           | Optional name of property for children. Defaults `children`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| renderNode                | func             | Custom render for the tree Nodes. `( dragHandler: node, node: object): node`                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| height                    | string           | Height of tree. The tree is virtualized by default and it needs a height. Default is `100%`. This requires that parent element of tree to inherit height of html and body which should be set to `100%` to work with defualt height of the tree. Or it can be a fixed height ex. `500px` and it does not require the parent element to inherit full height.                                                                                                                                                                                           |
| showDragHandler           | bool             | Set prop to `true` to show the drag handler of the node. Defaults to `false`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| showLines                 | bool             | Set prop to `false` to hide the tree lines. Defaults to `true`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |

## Helper Functions

- **`getTreeFromFlatData`**: Convert flat data (like that from a database) into nested tree data.
- **`getFlatDataFromTree`**: Convert tree data into flat data.

## More Usage

```jsx
import React, { useState } from 'react';
import SortableTreeView from 'react-sortable-treeview';

const nodeStyle = {
  position: 'relative',
  background: 'orange',
  display: 'flex',
  height: '100%',
  padding: '0 10px',
  alignItems: 'center',
};

export const TreeView = () => {
  const [treeData, setTreeData] = useState([...]);

  const customNode = ({ node, dragHandler }) => (
    <div style={nodeStyle}>
      {dragHandler}
      <span>{node.label}</span>
      <select style={{ marginLeft: '10px' }} defaultValue='Car'>
        <option value='Car'>Car</option>
        <option value='Plane'>Plane</option>
      </select>
    </div>
  );

  return (
    <div style={{ height: '100%' }}>
      <SortableTreeView
        treeData={treeData}
        renderNode={customNode}
        onChange={(treeData) => setTreeData(treeData)}
      />
    </div>
  );
};
```

```jsx
import React, { useState } from 'react';
import SortableTreeView from 'react-sortable-treeview';

const handlerStyles = {
  width: '25px',
  height: '25px',
  background: 'steelblue',
  cursor: 'move',
  borderRadius: '50%',
  marginRight: '10px',
};

export const TreeView = () => {
  const [treeData, setTreeData] = useState([...]);

  return (
    <div style={{ height: '100%' }}>
      <SortableTreeView
        treeData={treeData}
        showDragHandler
        handler={<div style={handlerStyles} />}
        onChange={(treeData) => setTreeData(treeData)}
      />
    </div>
  );
};
```
