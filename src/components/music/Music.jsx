import React, { Component } from "react";
// import MusicUpdates from "./MusicUpdates";
import MusicPlaylists from "./MusicPlaylists";
import MusicList from "./MusicList";
import None from "../commons/None";

export default class Music extends Component {
  render() {
    const { lists, texts, onChildAction, isFiltering, serverURL, listsState } =
      this.props;
    return (
      <>
        {lists.updates.length + lists.playlists.length + lists.items.length ===
          0 && !isFiltering ? (
          <None category={"music"} />
        ) : (
          <>
            {/* <MusicUpdates
              list={lists.updates}
              onChildAction={onChildAction}
              serverURL={serverURL}
              isFiltering={isFiltering}
              slidesIndexes={slidesIndexes}
            />
             */}
            <MusicPlaylists
              texts={texts}
              list={lists.playlists}
              serverURL={serverURL}
              isFiltering={lists.playlists < lists.totals[2]}
              //isFiltering={isFiltering}
              listsState={listsState}
              onChildAction={onChildAction}
            />
            <MusicList
              texts={texts}
              list={lists.items}
              serverURL={serverURL}
              isFiltering={lists.playlists < lists.totals[0]}
              //isFiltering={isFiltering}
              // slidesIndexes={slidesIndexes}
              listsState={listsState}
              onChildAction={onChildAction}
            />
          </>
        )}
      </>
    );
  }
}
