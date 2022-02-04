import React, { Component } from "react";
import BooksList from "./BooksList";
// import BooksUpdates from "./BooksUpdates";
import BooksAuthors from "./BooksAuthors";
import None from "../commons/None";

export default class Books extends Component {
  render() {
    const { lists, texts, onChildAction, isFiltering, serverURL, listsState } =
      this.props;
    return (
      <>
        {lists.updates.length + lists.authors.length + lists.items.length ===
          0 && !isFiltering ? (
          <None category={"books"} />
        ) : (
          <>
            {/* <BooksUpdates
              list={data.updates}
              onChildAction={onChildAction}
              serverURL={serverURL}
              isFiltering={isFiltering}
              slidesIndexes={slidesIndexes}
            />
             */}
            <BooksAuthors
              texts={texts}
              list={lists.authors}
              serverURL={serverURL}
              isFiltering={lists.authors < lists.totals[2]}
              // isFiltering={isFiltering}
              listsState={listsState}
              onChildAction={onChildAction}
            />
            <BooksList
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
