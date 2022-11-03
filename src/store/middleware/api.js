// src/store/middleware/api.js
import axios from "axios";
import { apiCallBegan, apiCallFailed, apiCallSuccess } from "../api";

const api = (store) => (next) => async (action) => {
  // Here we supply an exit condition "route" for non-API requests:
  // We supply `next` to ensure the action remains on the middleware pipeline.
  // We don't want this api function to continue execution.
  if (action.type !== apiCallBegan.type) {
    next(action); // pass it along to other middleware and below we return out.
    return; // and we need to resupply return existing logic.
  }
  // #1 - make an API call
  // If you reached this point `apiCallBegan` is the type we want handled.
  // We destructure properties from our action `payload` for our API request.
  // Thanks to middleware we dispatch the response data into payload.
  const { url, method, data, onSuccess, onError, onStart } = action.payload;
  if (onStart) store.dispatch({ type: onStart });
  next(action);
  try {
    // #1 - make API call
    const response = await axios.request({
      baseURL: "http://localhost:9001/api",
      url, // This is only the endpoint we still need the `baseURL`.
      method,
      data,
    });
    // #2 - handle resolved promise in dispatch `onSuccess` type
    // Attempt the general store followed by the specific dispatching:
    store.dispatch(apiCallSuccess(response.data));
    if (onSuccess) store.dispatch({ type: onSuccess, payload: response.data });
  } catch (error) {
    // #3 - handle rejected promise in dispatch `onError` type
    store.dispatch(apiCallFailed(error.message));
    if (onError) store.dispatch({ type: onError, payload: error.message });
  }
};

export default api;
