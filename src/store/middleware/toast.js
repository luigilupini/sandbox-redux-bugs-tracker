const toast = (store) => (next) => (action) => {
  if (action.type === "error") {
    console.log("Toast", action.payload.message);
  } else {
    // otherwise, if its not an error action:
    next(action);
  }
};

export default toast;
