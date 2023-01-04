export const treeData = [
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

export const extraData = [
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
  {
    id: '0-2-2',
    label: 'Document 2-2',
    parent: '0-1-1',
    hasChildren: true,
    children: [],
  },
  {
    id: '0-1-1',
    label: 'Document-0-1.doc',
    parent: '0-0',
    hasChildren: true,
    children: [],
  },
  {
    id: '0-1-2',
    label: 'Document-0-2.doc',
    parent: '0-0',
  },
  {
    id: '0-0',
    label: 'Document 1-1',
    parent: '0',
    hasChildren: true,
    children: [],
  },
];

export const dynamicData = [
  {
    id: '0',
    label: 'Documents',
    parent: null,
    hasChildren: true,
    children: [],
  },
];
