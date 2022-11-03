import React, { useEffect } from "react";
import { connect } from "react-redux";
import { loadBugs, resolveBug, getUnresolvedBugs } from "../store/bugs";

function BugsConnect(props) {
  useEffect(() => {
    props.loadBugs();
  }, [props.bugs]);
  return (
    <div className="wrapper">
      <h3>BugsConnect.jsx</h3>
      <p>
        Component makes use of an older <span className="code"> connect</span>{" "}
        configuration.
      </p>
      <ul>
        {props.bugs.map((bug) => (
          <li key={bug.id}>
            <button onClick={() => props.resolveBug(bug.id)}>👍🏻</button>
            {bug.description}
          </li>
        ))}
      </ul>
    </div>
  );
}

const mapStateToProps = (state) => {
  // return { bugs: state.entities.bugs.list };
  return { bugs: getUnresolvedBugs(state) };
};
const mapDispatchToProps = (dispatch) => {
  return {
    loadBugs: () => dispatch(loadBugs()),
    resolveBug: (id) => dispatch(resolveBug(id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BugsConnect);
