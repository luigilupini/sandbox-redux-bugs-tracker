import { combineReducers } from "@reduxjs/toolkit";
// reducers
import bugsReducer from "./bugs";
import projectsReducer from "./projects";

// entities reducer holds sub/sliced reducers:
export default combineReducers({
  bugs: bugsReducer,
  projects: projectsReducer,
});
