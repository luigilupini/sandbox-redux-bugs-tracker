import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
} from "@reduxjs/toolkit";

import entitiesReducer from "./entities";

import logger from "./middleware/logger";
import myThunk from "./middleware/func";
// import toast from "./middleware/toast";
import api from "./middleware/api";

// top-level root reducer:
const reducer = combineReducers({
  entities: entitiesReducer,
});

export default function () {
  return configureStore({
    reducer,
    // middleware: [myThunk],
    middleware: [...getDefaultMiddleware(), api],
  });
}
