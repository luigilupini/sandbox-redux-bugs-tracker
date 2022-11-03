const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(cors());
app.use(bodyParser.json());

const bugs = [
  { id: 1, description: "bug 1", userId: 1, resolved: false },
  { id: 2, description: "bug 2", userId: 1, resolved: false },
  { id: 3, description: "bug 3", userId: 2, resolved: false },
  { id: 4, description: "bug 4", userId: 1, resolved: false },
];

app.get("/api/bugs", (req, res) => {
  res.json(bugs);
});

app.post("/api/bugs", (req, res) => {
  const bug = { id: Date.now(), resolved: false, ...req.body };
  bugs.push(bug);

  res.json(bug);
});

app.patch("/api/bugs/:id", (req, res) => {
  const index = bugs.findIndex((bug) => bug.id === parseInt(req.params.id));
  const bug = bugs[index];
  if ("resolved" in req.body) bug.resolved = req.body.resolved;
  if ("userId" in req.body) bug.userId = req.body.userId;

  res.json(bug);
});

app.listen(9001, () => {
  console.log("Node server started on port 9001.");
});
