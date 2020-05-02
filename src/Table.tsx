import React, { useMemo } from "react";
import { Column, useBlockLayout, useTable } from "react-table";
import { FixedSizeGrid } from "react-window";
import { ItemType } from "./App";
import { InfiniteLoader } from "./InfiniteLoader";
import { Item, ItemData } from "./Item";

// todo, move this to another level
// types file

const columns: Column<ItemType>[] = [
  {
    Header: "Name",
    columns: [
      {
        Header: "First Name",
        accessor: "firstName",
      },
      {
        Header: "Last Name",
        accessor: "lastName",
      },
      {
        Header: "Suffix",
        accessor: "suffix",
      },
    ],
  },
  {
    Header: "Job",
    accessor: "job",
  },
];

const ROW_HEIGHT = 30;
const COLUMN_WIDTH = 200;
const TABLE_HEIGHT = 200;
const TABLE_WIDTH = 600;
const COLUMN_COUNT = 3;

type Props = {
  // are there still more items to load?
  hasNextPage: boolean;
  // items loaded so far
  items: ItemType[];
  // Callback function that knows how to load more items
  loadMoreItems: (startIndex: number, stopIndex: number) => Promise<any>;
  //Callback function determining if the item at an index is loaded
  isItemLoaded: (index: number) => boolean;
  scrollState: {
    rowIndex: number;
    columnIndex: number;
  };
  setScrollRowAndColumn: (rowIndex: number, columnIndex: number) => void;
};

export const Table: React.FunctionComponent<Props> = (props) => {
  const { hasNextPage, items, loadMoreItems, isItemLoaded } = props;

  const itemCount = hasNextPage ? items.length + 1 : items.length;

  // using react table, could pull this up a level
  const { headers, rows, prepareRow } = useTable({
    data: items,
    columns: columns,
  });

  const itemData: ItemData = useMemo(
    () => ({
      headers,
      rows,
      prepareRow,
    }),
    [headers, rows, prepareRow]
  );

  return (
    <InfiniteLoader
      isItemLoaded={isItemLoaded}
      itemCount={100}
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
          initialScrollLeft={COLUMN_WIDTH * props.scrollState.columnIndex}
          onItemsRendered={({
            visibleRowStartIndex,
            visibleColumnStartIndex,
            visibleRowStopIndex,
            overscanRowStopIndex,
            overscanRowStartIndex,
          }) => {
            props.setScrollRowAndColumn(
              visibleRowStartIndex,
              visibleColumnStartIndex
            );
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
};
