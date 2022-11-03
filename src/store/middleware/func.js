function myThunk(store) {
  return (next) => {
    return (action) => {
      console.log(`store: `, store);
      console.log(`next: `, next);
      console.log(`action: `, action);
      if (typeof action === "function") action(store);
      else next(action);
    };
  };
}
export default myThunk;
