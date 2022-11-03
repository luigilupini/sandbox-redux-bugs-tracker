// src/store/bugs.js (slice)
import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { apiCallBegan } from "./api";

import moment from "moment";

const slice = createSlice({
  // The slice's name, used to domain/namespace for the generated action types.
  name: "bugs",
  // And initial state here its an object template passed to each slice reducer.
  initialState: {
    list: [],
    loading: false,
    lastFetch: null,
  },
  // Here action creator, type, and their adjacent reducer are defined together.
  // A mapping of action type to their specific reducer handler/callback.
  // All action types here translate to an action creator automatically :)
  // Simply, when adding a new reducer we define an adjacent action creator.
  // That means this part of the toolkit generates with `createAction`.
  reducers: {
    // addBug (command) / bugAdded (event)
    bugAdded: (bugs, action) => {
      bugs.list.push(action.payload);
    },
    // resolveBug (command) / bugResolved (event)
    bugResolved: (bugs, action) => {
      const index = bugs.list.findIndex((bug) => bug.id === action.payload.id);
      bugs.list[index].resolved = true;
    },
    bugRemoved: (bugs, action) => {
      bugs.list.filter((bug) => bug.id !== action.payload.id);
    },
    // loadBugs (command) / bugsReceived (event)
    bugsReceived: (bugs, action) => {
      bugs.list = action.payload;
      bugs.loading = false;
      bugs.lastFetch = Date.now();
    },
    bugsRequested: (bugs, action) => {
      bugs.loading = true;
    },
    bugsRequestFailed: (bugs, action) => {
      bugs.loading = false;
    },
    // assignUser (command) / bugAssignedUser (event)
    bugAssignedUser: (bugs, action) => {
      const { id, userId } = action.payload;
      const index = bugs.list.findIndex((bug) => bug.id === id);
      bugs.list[index].userId = userId;
    },
  },
});

const {
  bugAdded,
  bugResolved,
  bugRemoved,
  bugsReceived,
  bugsRequested,
  bugsRequestFailed,
  bugAssignedUser,
} = slice.actions;

export default slice.reducer;

// Command async action creators that dispatch functions to `api.js` middleware
export const loadBugs = () => {
  return (dispatch, getState) => {
    const { lastFetch } = getState().entities.bugs;
    const diffMinutes = moment().diff(moment(lastFetch), "minutes");
    if (diffMinutes < 10) return;
    dispatch(
      apiCallBegan({
        url: "/bugs",
        onStart: bugsRequested.type,
        onSuccess: bugsReceived.type,
        onError: bugsRequestFailed.type,
      })
    );
  };
};
export const addBug = (bug) => {
  return apiCallBegan({
    url: "/bugs",
    method: "post",
    data: bug,
    onSuccess: bugAdded.type,
  });
};
export const resolveBug = (id) => {
  return apiCallBegan({
    url: `/bugs/${id}`,
    method: "patch",
    data: { resolved: true },
    onSuccess: bugResolved.type,
  });
};
export const assignUser = (bugId, userId) => {
  return apiCallBegan({
    url: `/bugs/${bugId}`,
    method: "patch",
    data: { userId },
    onSuccess: bugAssignedUser.type,
  });
};

// Selector
export const getResolvedBugsPlain = (currentState) =>
  currentState.entities.bugs.filter((bug) => bug.resolved);

// Memoization:
export const getUnresolvedBugs = createSelector(
  (state) => state.entities.bugs,
  (state) => state.entities.projects,
  (bugs) => bugs.list.filter((bug) => !bug.resolved)
);
