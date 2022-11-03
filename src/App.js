import configureStore from "./store/configureStore";
import { Provider } from "react-redux";

import BugsConnect from "./components/BugsConnect";
import BugsHooks from "./components/BugsHooks";

const store = configureStore();

function App() {
  return (
    <Provider store={store}>
      {/* Toggle between the two components: */}
      {/* <BugsConnect /> */}
      <BugsHooks />
    </Provider>
  );
}

export default App;
