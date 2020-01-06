import React, { useState } from 'react';
import './App.css';
import { name } from "faker";
import { Wrapper } from './Wrapper';


const App: React.FC = () => {
  const [state, setState] = useState<any>({
     hasNextPage: true,
    isNextPageLoading: false,
    items: []
   
  })

  let loadNextPage = (startIndex: number, stopIndex: number): Promise<any> => {
    // console.log("loadNextPage with start index", startIndex, " stop index",stopIndex);
    setState({...state, isNextPageLoading: true})
    return new Promise( () => setTimeout(() => {
      setState({
          hasNextPage: state.items.length < 100,
          isNextPageLoading: false,
          items: [...state.items].concat(
            new Array(10).fill(true).map(() => ({ name: name.findName() }))
          )
      })
    }, 2500))
  };

  const {hasNextPage, isNextPageLoading, items} = state;

  return (
    <>
    <p className="Note">
      This demo app shows how to create a list that automatically loads the
      next "page" of data when a user scrolls close to the end of the list.
    </p>

    <Wrapper
      hasNextPage={hasNextPage}
      isNextPageLoading={isNextPageLoading}
      items={items}
      loadNextPage={loadNextPage}
    />

    <p className="Note">
      Check out the documentation to learn more:
      <br />
      <a href="https://github.com/bvaughn/react-window-infinite-loader#documentation">
        github.com/bvaughn/react-window-infinite-loader
      </a>
    </p>
  </>
  );
}

export default App;
