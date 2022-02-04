import React, { Component } from "react";
// import CoursesUpdates from "./CoursesUpdates";
import CoursesList from "./CoursesList";
import None from "../commons/None";

export default class Courses extends Component {
  render() {
    const { lists, texts, onChildAction, isFiltering, serverURL, listsState } =
      this.props;
    return (
      <>
        {lists.updates.length + lists.items.length === 0 && !isFiltering ? (
          <None category={"courses"} />
        ) : (
          <>
            {/* <CoursesUpdates
              list={data.updates}
              onChildAction={onChildAction}
              serverURL={serverURL}
              isFiltering={isFiltering}
              slidesIndexes={slidesIndexes}
            /> */}
            <CoursesList
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
