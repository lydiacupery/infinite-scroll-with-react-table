import React from "react";
import {  FixedSizeGrid, GridProps } from "react-window";
import { InfiniteLoader } from "./InfiniteLoader";

type Props = {
  // Are there more items to load?
  // (This information comes from the most recent API request.)
  hasNextPage: any,
  // Are we currently loading a page of items?
  // (This may be an in-flight flag in your Redux store for example.)
  isNextPageLoading: any,
  // Array of items loaded so far.
  items: any,
  // Callback function responsible for loading the next page of items.
  loadNextPage: (startIndex: number, stopIndex: number) => Promise<any>
}

export const Wrapper: React.FunctionComponent<Props> = props =>
 {
   const {hasNextPage, isNextPageLoading, items, loadNextPage} = props;
  // If there are more items to be loaded then add an extra row to hold a loading indicator.
  const itemCount = hasNextPage ? items.length + 1 : items.length;

  // Only load 1 page of items at a time.
  // Pass an empty callback to InfiniteLoader in case it asks us to load more than once.
  const loadMoreItems = isNextPageLoading ? (startIndex: number, stopIndex: number) => null : loadNextPage;

  // Every row is loaded except for our loading indicator row.
  const isItemLoaded = (index: any) => !hasNextPage || index < items.length;

  // Render an item or a loading indicator.
  const Item: GridProps["children"] = ({ columnIndex, rowIndex, style }) => {
    let content;
    if (!isItemLoaded(rowIndex)) {
      content = "Loading...";
    } else {
      content = items[rowIndex].name;
    }

    return <div style={style}>{content}</div>;
  };

  return (
    <InfiniteLoader
      isItemLoaded={isItemLoaded}
      itemCount={itemCount}
      loadMoreItems={loadMoreItems}
    >
      {({ onItemsRendered, ref }) => (
        <FixedSizeGrid
          className="List"
          height={150}
          width={600}
          rowHeight={30}
          columnWidth={200}
          rowCount={itemCount}
          columnCount={3}
          onItemsRendered={({
            visibleRowStartIndex,
            visibleRowStopIndex,
            overscanRowStopIndex,
            overscanRowStartIndex,
          }) => {
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
