import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUnresolvedBugs, loadBugs, resolveBug } from "../store/bugs";

function BugsHooks() {
  const dispatch = useDispatch();
  // const bugs = useSelector((state) => state.entities.bugs.list);
  const bugs = useSelector(getUnresolvedBugs); // filter by unresolved
  useEffect(() => {
    dispatch(loadBugs());
  }, [dispatch]);
  return (
    <div className="wrapper">
      <h3>BugsHooks.jsx</h3>
      <span className="recommend">Recommended</span>
      <p>
        This component makes use of <span className="code">useDispatch</span>{" "}
        and <span className="code">useSelector</span> hooks.
      </p>
      <ul>
        {bugs.map((bug) => (
          <li key={bug.id}>
            <button onClick={() => dispatch(resolveBug(bug.id))}>👍</button>
            {bug.description}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BugsHooks;
