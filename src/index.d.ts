declare module 'react-sortable-treeview' {
  import * as React from 'react';

  export type Node = Record<string, any>;

  export default class SortableTreeView extends React.Component<{
    childrenProp?: string; // 'children' default
    className?: string;
    canDrop?: (arg: {
      dragItem: Node;
      destinationParent: Node | null;
    }) => boolean;
    group?: number | string; // 'random string' default
    handler?: React.ReactNode;
    showDragHandler?: boolean; // 'true' default
    idProp?: string; // 'id' default
    treeData: Node[];
    onChange?: (arg: { treeData: Node[] }) => void;
    renderNode?: (arg: {
      dragHandler: React.ReactNode;
      node: Node;
    }) => React.ReactNode;
    draggable?: boolean; // 'true' default
    showLines?: boolean; // 'true' default
    onMoveNode?: (arg: {
      treeData: Node[];
      node: Node;
      prevNodeIndex: number;
      nextNodeIndex: number;
      nextParentNode: Node;
      prevPath: number[] | string[];
      nextPath: number[] | string[];
    }) => void;
    onDragStateChanged: (arg: { isDragging: boolean; node: Node }) => void;
    height: string; // '100%' default
  }> {}
}
