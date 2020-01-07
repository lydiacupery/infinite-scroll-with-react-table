import React, { useState } from 'react';
import './App.css';
import * as Faker from "faker";
import { Table } from './Table';


export type ItemType = {
  firstName: string,
  lastName: string,
  suffix: string
}

const App: React.FC = () => {
  const [state, setState] = useState<{
    hasNextPage: boolean
    items: ItemType[],
  }>({
     hasNextPage: true,
    items: []
   
  })

  let loadMoreItems = (startIndex: number, stopIndex: number): Promise<any> => {
    return new Promise( () => setTimeout(() => {
      setState({
          hasNextPage: state.items.length < 100,
          items: [...state.items].concat(
            new Array(10).fill(true).map(() => ({ firstName: Faker.name.firstName(), lastName: Faker.name.lastName(), suffix: Faker.name.suffix() }))
          )
      })
    }, 1500))
  };

  // the item is loaded if either 1) there are no more pages or 2) there exists an item at that index
  let isItemLoaded = (index: number) => !state.hasNextPage || !!state.items[index]

  const {hasNextPage, items} = state;

  return (
    <>
    <p className="Note">
      This grid loads the next "page" of data when the user scrolls to the end of loaded data
    </p>

    <Table
      hasNextPage={hasNextPage}
      items={items}
      loadMoreItems={loadMoreItems}
      isItemLoaded={isItemLoaded}
    />

  </>
  );
}

export default App;
