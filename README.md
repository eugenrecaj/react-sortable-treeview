> Drag & drop hierarchical nested/sorted list made as a react component. Checkout the [Storybook](https://react-sortable-treeview.vercel.app/?path=/story/example-sortabletreeview--default)

## Getting started

Install `react-sortable-treeview` using npm.

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
          isCollapsed: true,
          children: [
            {
              id: '0-1-1',
              label: 'Document-0-1.doc',
              parent: '0-0',
              isCollapsed: true,
              children: [
                {
                  id: '0-2-2',
                  label: 'Document 2-2',
                  parent: '0-1-1',
                  isCollapsed: true,
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
