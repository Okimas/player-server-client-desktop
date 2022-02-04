import React, { Component } from "react";
import SeriesList from "./SeriesList";
// import SeriesUpdates from "./SeriesUpdates";
import None from "../commons/None";

export default class Series extends Component {
  render() {
    const { lists, texts, onChildAction, isFiltering, serverURL, listsState } =
      this.props;
    return (
      <>
        {lists.updates.length + lists.items.length === 0 && !isFiltering ? (
          <None category={"series"} />
        ) : (
          <>
            {/* <SeriesUpdates
              list={data.updates}
              onChildAction={onChildAction}
              serverURL={serverURL}
              isFiltering={isFiltering}
              slidesIndexes={slidesIndexes}
            /> */}
            <SeriesList
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
