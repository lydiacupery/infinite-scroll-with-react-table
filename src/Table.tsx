import React, { useMemo } from "react";
import {  FixedSizeGrid, GridProps, GridChildComponentProps } from "react-window";
import { InfiniteLoader } from "./InfiniteLoader";
import { ItemType } from "./App";

const ROW_HEIGHT = 30;
const COLUMN_WIDTH = 200;
const TABLE_HEIGHT = 200;
const TABLE_WIDTH = 600;
const COLUMN_COUNT = 3; 

type Props = {
  // are there still more items to load?
  hasNextPage: boolean,
  // items loaded so far
  items: ItemType[],
  // Callback function that knows how to load more items
  loadMoreItems: (startIndex: number, stopIndex: number) => Promise<any>
  //Callback function determining if the item at an index is loaded
  isItemLoaded: (index: number) => boolean
  scrollState: {
    rowIndex: number,
    columnIndex: number
  }
  setScrollRowAndColumn: (rowIndex: number, columnIndex: number) => void
}


export const Table: React.FunctionComponent<Props> = props =>
 {
   const {hasNextPage, items, loadMoreItems, isItemLoaded} = props;

  const itemCount = hasNextPage ? items.length + 1 : items.length;

  const Item: GridProps["children"] = ({ columnIndex, rowIndex, style }) => {
    let content;
    if (!isItemLoaded(rowIndex)) {
      content = "Loading...";
    } else {
      switch (columnIndex) {
        case 0:
          content = items[rowIndex].firstName;
          break;
        case 1:
          content = items[rowIndex].lastName;
          break;
        case 2:
          content = items[rowIndex].suffix;
      
    }
  }
    return <div style={style}>{content}</div>;
  };

  const itemData: ItemData = useMemo(() => ({
              isItemLoaded,
              items

  }), [isItemLoaded, items])

  return (
    <InfiniteLoader
      isItemLoaded={isItemLoaded}
      itemCount={itemCount}
      loadMoreItems={loadMoreItems}
    >
      {({ onItemsRendered, ref }) => (
        <FixedSizeGrid
          height={TABLE_HEIGHT}
          width={TABLE_WIDTH}
          rowHeight={ROW_HEIGHT}
          columnWidth={COLUMN_WIDTH}
          rowCount={itemCount}
          columnCount={COLUMN_COUNT}
          itemData={itemData}
          initialScrollTop={ROW_HEIGHT * props.scrollState.rowIndex} 
          onItemsRendered={({
            visibleRowStartIndex,
            visibleColumnStartIndex,
            visibleRowStopIndex,
            overscanRowStopIndex,
            overscanRowStartIndex,
          }) => {
            props.setScrollRowAndColumn(visibleRowStartIndex, visibleColumnStartIndex)
            onItemsRendered({
              overscanStartIndex: overscanRowStartIndex,
              overscanStopIndex: overscanRowStopIndex,
              visibleStartIndex: visibleRowStartIndex,
              visibleStopIndex: visibleRowStopIndex,
            });
          }}
          ref={ref}
        >
          {Item}
        </FixedSizeGrid>
      )}
    </InfiniteLoader>
  );
}


type ItemData = {
  isItemLoaded: (index: number) => boolean
  items: ItemType[],
}


export const Item: React.FunctionComponent<Omit<GridChildComponentProps, "data"> & {
  data: ItemData
}>  = props => {
    const {rowIndex, columnIndex, data, style} = props;
    const {isItemLoaded, items} = data
    let content;
    if (!isItemLoaded(rowIndex)) {
      content = "Loading...";
    } else {
      switch (columnIndex) {
        case 0:
          content = items[rowIndex].firstName;
          break;
        case 1:
          content = items[rowIndex].lastName;
          break;
        case 2:
          content = items[rowIndex].suffix;
      
    }
  }
    return <div style={style}>{content}</div>;

}