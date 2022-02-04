import React, { Component } from "react";
import MoviesList from "./MoviesList";
// import MoviesUpdates from "./MoviesUpdates";
import None from "../commons/None";

export default class Movies extends Component {
  render() {
    const { lists, texts, onChildAction, isFiltering, serverURL, listsState } =
      this.props;
    return (
      <>
        {lists.updates.length + lists.items.length === 0 && !isFiltering ? (
          <None category={"movies"} />
        ) : (
          <>
            {/* <MoviesUpdates
              list={data.updates}
              onChildAction={onChildAction}
              serverURL={serverURL}
              isFiltering={isFiltering}
              slidesIndexes={slidesIndexes}
            /> */}
            <MoviesList
              texts={texts}
              list={lists.items}
              serverURL={serverURL}
              isFiltering={lists.items < lists.totals[0]}
              // isFiltering={isFiltering}
              listsState={listsState}
              onChildAction={onChildAction}
            />
          </>
        )}
      </>
    );
  }
}
