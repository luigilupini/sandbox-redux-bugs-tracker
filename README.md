# Functional programming

## Higher-Order Functions (HOF)

HOF are functions can take a function as a argument, or return it, or both.
Instead of just operating on simple data structures, they can go higher.

```js
function sayHello() {
  return function () {
    return "Hello World";
  };
}
let fn = sayHello(); // returns inner function as reference
let message = fn(); // holds value of invoked inner function
```

## Composition

It combines two or more HOF functions to result in another function.
In composition of functions, the output of one function "inside the parenthesis"
becomes the input of the outside function. First simplify whats within brackets.
So to find funcA(funcB(x)), first funcB(x) has to be calculated and substituted
in funcA(x). While finding the composite functions, order matters.

- Your have to read the composition from right to left.
  https://www.cuemath.com/calculus/composite-funtions/

```js
let input = "     javascript     ";
const trim = (str) => str.trim();
const wrapDiv = (str) => `<div>${str}</div>`;
const result = wrapDiv(trim(input)); // known as function composition
console.log(result); // <div>javascript</div>
```

## The compose and pipe HOF's with lodash

Here we import two functions from this library known as utility functions. These
functions help us remove all those unnecessary parenthesis use, seen above. Note
we not calling these function arguments directly, we passing them by reference.

These utility functions are higher-order functions (HOF):

- Passing a function reference as argument.
- A new function as return value, composition of all these function arguments.
- Or both, function arguments and return values.

When we `compose` order matters so you read/apply from right to left. If that is
hard to understand you can use the `pipe` instead. If you "piping" you apply the
natural step-by-step thinking. We first trim, then lowercase, then interpolate.
Its not so inside out like using the `compose` type of HOF function.

```js
import { compose, pipe } from "lodash/fp";
let input = "     javascript     ";
const trim = (str) => str.trim();
const lowerCase = (str) => str.toLowerCase();
const wrapDiv = (str) => `<div>${str}</div>`;

const transformA = compose(wrapDiv, trim, lowerCase); // order matters here!
const transformB = pipe(trim, lowerCase, wrapDiv); // its more logical :)
console.log(transformA(input));
console.log(transformB(input));
```

## Currying

Currying is the technique of converting a function that takes multiple arguments
into a sequence of functions that each takes a single argument. (FP) functional
programming languages, it provides a way of auto-managing how arguments pass to
functions and their exceptions that are nested in a HOF. Its a transformation of
that translates a function, as callable, meaning:

- Passing arguments f(a, b) into rather a callable invoking setup f(a)(b)
- For reducing the number of parameters of a function to one.

Let's understand currying in isolation, before applying it to our example above.
Currying allows us to take a function with N arguments and convert to a function
with a single argument. Instead of this `add` function we replace the expression
with a inner function that takes a single argument and returns results. Instead
of separating by arguments, we separate by function calls `()`. What matters, we
a function takes a single argument and when using it, we calling each individual
returning inner function separately.

```js
function add(a, b) {
  return a + b;
}
function addCurry(a) {
  console.log("lexical context outer function");
  return function (b) {
    console.log("lexical context inner function");
    return a + b;
  };
}
console.log(addCurry(1)(2)); // we separate them by `()` function calls
// ...
function multiply(a) {
  return (b) => {
    return (c) => {
      return a * b * c;
    };
  };
}
console.log(multiply(1)(2)(3)); // 6
```

- A single function has been turned to a series of function calls.

We simply wrap a function inside a function which means we are going to return a
function from another function to obtain this kind of translation. The parenting
function takes the first provided argument, and returns a function that to takes
the next argument and this keeps on repeating till the number of arguments ends.
Finally, because of scope chains and execution context, a inner function is able
to see the outer function variables, `a` is outer parameter and `b` the inner.

This will produce a closure to be created. A closure always contain the function
definition along with the "lexical environment" of the parent both things remain
connected as a bundle. Hence, it does not matter where we invoke them as all the
inner functions will always hold access to the variable of their parent. As soon
as we have got the returned result as a function, the next argument is ready to
be passed, this process will continue till the last function. Finally, innermost
return keyword returns the expected result.

https://www.geeksforgeeks.org/what-is-currying-function-in-javascript/

To get the multiplication result of the three numbers, they are passed one after
the other, each "prefilling" the next function inline for invocation and each to
providing that scope mentioned, to parameter variables of the parent if needed.

If it helps understanding, we can separate multiply(1)(2)(3) by invoking each of
the function returns, differently.

```js
const one = multiply(1);
const two = one(2);
const result = two(3);
console.log(result); // 6
```

But back to our wrap element function example above, we can curry it because the
`wrap` function returns a function when invoked, meaning it still can be used in
the pipeline being our `pipe`, we compose from.

```js
import { compose, pipe } from "lodash/fp";
let input = "     javascript     ";
const trim = (str) => str.trim();
const lowerCase = (str) => str.toLowerCase();
const wrap = (type) => (str) => `<${type}>${str}</${type}>`;
// const wrapDiv = (str) => `<div>${str}</div>`; // This has duplication ❌
// const wrapSpan = (str) => `<span>${str}</span>`; // This has duplication ❌

const transform = pipe(trim, lowerCase, wrap("div")); // its more logical :)
console.log(transform(input)); // <div>javascript</div>
```

## Pure functions

A Pure Function, a function (block of code) that always returns the same result
if the same arguments are passed. It does not depend on any state or data change
during a program's execution. Rather, it only depends on its input arguments.

Also pure functions does not produce any observable side effects such as network
requests or data mutation etc...

> Produce the same result with the same arguments and free of side effects.

```js
// not pure function
const value = "global";
function percentage(units) {
  return (100 * units) / value;
}
// pure function
function percentage(units, value) {
  return (100 * units) / value;
}
```

The above function will always return the same result if we pass the same input.
Its output doesn’t get affected by any local or global values/state changes.

The benefits of pure functions;

- Self-documenting: what the function needs is clearly specified.
- Easily to test: It does not require outside/global state.
- Concurrency: Because they have isolated state, they can run parallel.
- Cacheable: If input is the same then we can cache output.

## Immutability

Its a concept that goes hand in hand with pure functions. It means that once we
create an object, **can't be changed directly**. To make changes first we make a
copy and return it or just return a modified copied.

Why do we want immutability?

- Predictability regarding your application state
- Faster to detect changes for rendering
- React does not need to compare all object properties in `===` equality checks
- Concurrency, safely we can run functions in parallel
- We not going to change state in flight that messes up the operation

```js
// Working with objects:
const person = { name: "james" };
// person.name = "" // ❌
const newPerson = Object.assign({}, person);
const newPerson = { ...person, name: "bond" }; // :)
// Working with arrays:
const numbers = [1, 2, 3];
const added = [...numbers, 4];
const remove = numbers.filter((x) => x !== 1);
const update = numbers.map((x) => (x === 2 ? 20 : x));
```

## Enforcing Immutability

Libraries that can assist with this are like Immutable, Immer and Mori.

They offer immutable data structures and immutable.js was developed by Facebook.
So its popular, to install run: `npm install immutable` in your project folder.

```js
// Working with objects:
let book = { title: "harry potter" };
// We don't want to mutate state directly ❌
function publish(book) {
  book.isPublished = true;
}
publish(book); // { title: 'harry potter', isPublished: true }
```

Immutable [Map](https://immutable-js.com/docs/v3.8.2/Map/) is a unordered iterable.

We can create a `Map` or hash thats like a regular JS object. It's a container
for key-value pairs but again this object is immutable.

Iteration order of a `Map` is `undefined`, however is stable. Multiple iteration
of the same `Map` will iterate in the same order. Map's keys can be of any type,
and use `Immutable.is` to determine key equality.

```js
import { Map } from "immutable";

let book = Map({ title: "harry potter" });
function publish(book) {
  return book.set("isPublished", true);
}
let newBook = publish(book);

console.log(book.toJS()); // { title: 'harry potter' }
console.log(newBook.toJS()); // { title: 'harry potter', isPublished: true }
```

A problem with this is you going to need to learn a completely new API but more
over, integration with your JS code needs the `toJS` method executed. It deeply
converts the Keyed _collection_ to equivalent native JS object. You either can
reassign the book variable or in the above example, use a new reference.

The biggest negative is that once you start using it all over your codebase, you
going to need to keep using setters and convertors to keep things working with
the plain JS objects in your project.

**Immer** could be a better choice and its used by `redux-toolkit`.

[Immer](https://immerjs.github.io/immer/) provides a useful `produce` function.

It takes a starting state value and a "recipe function" (whose return value is
often depends on the base state also known as initial state). A recipe function
`draft` is free to be mutated. All mutations are only ever applied to a **copy**
of that base state. We pass only a function that to creates a "curried producer"
which relieves you from passing the recipe function every time.

- Only plain objects and arrays are made mutable.
- This anonymous function is bound to its **Immer** instance.

```js
import { produce } from "immer";

let book = { title: "harry potter" };
function publish(book) {
  return produce(book, (draft) => {
    // In this block we can write mutating code to the draft copy.
    draft.isPublished = true;
  });
}
const newBook = publish(book);

console.log(book); // { title: 'harry potter' }
console.log(newBook); // { title: 'harry potter', isPublished: true }
```

The first argument is the book state/object that we want to initiate from. Next,
we pass a anonymous function that specifies return mutation. Let's differentiate
that by calling the parameter `draft`. All changes we make to the initial `book`
object, the anonymous function passed to `produce` is going to iterate over into
the copy. An advantage with **Immer**, we writing familiar code.

We know we are mutating an object but keeping the initial intact. Additionally,
this is better than returning a copy with a `{...state, action.payload}` spread
operator as it can not deal well with deeply nested state objects.

With **Immer** we don't need to worry about any of this! We simply follow this
code pattern and write it in a familiar style.

# Redux Fundamentals

## Redux Architecture

With Redux we store single application state in a `store`. A global state object
that is the single source of truth for our application.

You can't directly modify or mutate the `store` because Redux is built on top of
functional programming (FP) principles. We can't write that code, as the `store`
is an **immutable** object. To update the `store` we can produce functions that
take state as an argument, return `return {...store, updates}` an update copy.

```js
store.currentUser = { name: "Bond" };

function reducer(store) {
  // We return updated copy of the store using the 🧈 spread operator :)
  const updated = { ...store };
  // But how do we determine what a reducer should update in the 📦 store?
  update.checkOut = ?
  update.currentUser = ?
  update.products = ?
}
// With an 🎬 action object passed as a parameter to a reducer function:
function reducer(store, action) {
  // ...
}
```

An `action` is just a plain JS object that describes what just happened. Example
the user just `isLoggedIn` or added an item to the shopping `chart: []` etc...

They are events that can occur in our application. Base on the `type` of action
the reducer function will know what properties of the store/state to return. And
as mentioned we `...` spread and return an updated copy, no direct mutation.

In production applications, your store can have many **slices** example below we
have four different **slices** also known as features or application domains.

Each `reducer` function will be responsible for updating a specific "slice" of
the store. As a metaphor, think of a organization with multiple departments that
serve actions. Each has a manager responsible for that department, in Redux this
is a **slice**. The reducer gets the current store and returns an updated copy.

```js
{
  categories: [],
  products: [],
  cart: [],
  user: []
}
```

- How do action's, reducer's and the store work together?

Well when the consuming application performs a action like adding an item to the
shopping cart, we have 1# **actions creators** that produce `action` object that
is then dispatched. The Redux store has 2# `dispatch` method that take an action
and forwards them to 3# `reducers` we can't call them directly. The reducer then
**computes** the new state copy and returns it `...state, action.payload`. Next,
4# state is then updated internally in the `store`, that notifies UI component's
about the updated state, triggering renders/re-renders in React.

- Why is Redux designed this way? Why do we need these dispatching steps?

Think of these `dispatch` methods as endpoints to our `store`. By dispatching
actions, you essentially sending every `action` through the same entrance. That
gives us a central place where we can control what should happen every time the
user performs a specific `action.type`. This allows us to do a few cool things
like we can log every action with **Redux DevTools**.

# Your first Redux App

When implementing Redux in your application, consider the following steps:

- Design the `store`, what should be kept (sliced) into the store.
- Define `action`, what are the actions to be performed.
- Create a `reducer`, that take action types and return copied/updated state.
- Setup the Redux `store` based on your reducers.

```js
npm install redux
```

## Designing the store (Step #1)

For a bug tracking app, what initial `state` do you think we should start with?
How about an array of objects with all the needed properties.

```js
// Basic flat structure setup for only Redux playground/demonstrations:
[
  {
    id: 1,
    description: '',
    resolved: false,
  },
  {...},
  {...}
]
// A more real-world initial setup would have properties with nested objects:
{
  bugs: [
    {
      id: 1,
      description: '',
      resolved: false,
    }
  ],
  currentUser: {}
}
```

Don't worry about this in practice but the better layout has catagories "slices"
of your store. Like a slice for the list of bugs and others for users. Different
"slices" means you have separate `reducer` functions.

Understand Redux is like building in blocks.

## Define the action or action creators (Step #2)

A bug tracking app has actions `BUG_ADDED`, `BUG_RESOLVED`, `BUG_DELETED` etc...
Remember your `action` is a plain JS object that describes what just happened in
your application. Notice the below example makes use of uppercase letters and a
separation by a underscore, thats common Redux convention.

```js
{
  type: 'BUG_ADDED', // recommended to show intention of action
  payload: {...} // optional
}
```

**Important:** Your `action.type` is the ONLY property that Redux expects within
your `action` object. Without `type`, Redux is going to complain 🤬. Optionally,
the object can carry extra stuff via `payload` property about an action. Even if
its optional to have a `payload`, its better to have it in your actions, so that
your action has a common and consistent structure.

## Define the reducer function (Step #3)

As seen before, our reducer is a function that takes to parameters. Our current
`state`, and the inbound `action`. Something to take note here, the `payload` of
our action should contain the minimum information needed, to update our system.
That means we don't need to pass the id property and resolved status, but only a
`description` of the added bug item we appending to our application state.

That means that everything else needs to be already computed in the reducer. As
our individual action `type` and has its own implemented business/compute logic.

**Important:** requirement is that we include `initialState` otherwise when our
our App first renders (mount) and the store is initially `undefined`, Redux will
invoke our reducers that will return back `undefined` as value of the state.

```js
// src/reducer.js
const initialState = [];
export function reducer(state = initialState, action) {
  switch (action.type) {
    case "bugAdded":
      return [
        ...state,
        {
          id: ++lastId,
          description: action.payload.description,
          resolved: false,
        },
      ];
    case "bugRemoved":
      return state.filter((bug) => bug.id !== action.payload.id);
    // Always return a default case for when nothing matches above.
    default:
      return state;
  }
}
```

You don't want `undefined` as initial state because if no condition matches in
your first render/return, then `undefined` is passed to your React components.
This may result in unexpected behavior. Rather default to an empty object.

Notice your reducer is **pure function** that if we supply the same input value
we can expect the same output. Its free of side-effects, we do not make any API
calls, no touching of DOM elements or global state etc...

No operation in our reducer should be able to change application state directly.
They are smaller, isolated function worlds. They only need two arguments to then
return newer/updated "cloned" state, that is not mutated directly.

Question: where do we make our API calls then? This is covered later but these
operations are done by enabling async action creators, with middleware.

## Creating our store (Step #4)

After setting up a reducer, we can have a Redux `store`. First we `createStore`
to create a Redux store that holds the state tree. The only way to change this
data in the store, is to call/invoke the `dispatch` method on it.

Our `createStore` is a higher-order function. Remember, a (HOF) can take another
function as a argument, or return a function, or both. The `createStore` returns
a `store` object we default export. Note, there should only be only one of these
object's in your app. Redux `store` has methods to read state, `dispatch` action
and subscribe to any changes like event listeners.

```js
// src/store.js
import { createStore } from "redux";
import reducer from "./reducer";

const store = createStore(reducer);

export default store;
```

In order to accommodate other slices of data, and other reducers. We can specify
how different parts of the state tree, respond to action and different slices by
including other reducers into a single reducer function, with `combineReducers`.

## Dispatching actions (Step #5)

After creating the `store`, lets import it into the application and console it.
Notice the following method properties available:

```js
Object >
  dispatch: ƒ dispatch(action)
  getState: ƒ getState()
  replaceReducer: ƒ replaceReducer(nextReducer)
  subscribe: ƒ subscribe(listener)
// ...
```

We have a method for dispatching actions and another for subscribing. That is a
event listener that will listen/subscribe to our `store` for state changes.

Subscribe is used by our React UI layer. We also have a method for getting like
a getter of current state within our Redux `store`.

```js
// src/index.js
import store from "./store";

store.dispatch({
  type: "bugAdded",
  payload: {
    description: "bugOne",
  },
});
store.dispatch({
  type: "bugRemoved",
  payload: {
    id: 1,
  },
});
```

The beauty of Redux, we only have getters, not a setter. A fundamental principle
because to change Redux state of the store we have to `dispatch` action. Meaning
with this architecture we send every `action` to the same "reducer" entry point.
Remember, with `combineReducers` they all a collective in our Redux store.

## Subscribing to the store (Step #6)

Here we subscribe to the Redux `store`. Adds a change listener "callback". It's
invoked anytime an action is dispatched, if part of state tree may have changed.
You may call `getState` inside this callback to read the current state tree.

It would be reasonable to expect that the store's reducer is a pure function, so
you may compare references to some deep path in the state tree to learn whether
its value has changed with the use of `getState` in your subscribe callback.

```js
// src/index.js
store.subscribe(() => {
  console.log("Store changed!", store.getState());
});
```

When we are subscribing, we consuming in the UI layer so whenever the state of
the store changes, we want to refresh the view/page. If you building an app with
plain JS or jQuery, you going to work with your (UI) DOM elements here. If it is
with a framework like React, then state changes will re-render components. A key
point here, is that your UI components/elements should subscribe to the `store`,
so they get notified when the state of the `store` is dispatching changes.

You need to remove any event listener (also known as subscription) to the store.
Because many subscribers can create a memory leak. So if your current UI element
or component is not going to be visible, ensure the callback is removed.

## Include action types

Above is all the building blocks of Redux.

Just keep in mind that when we call our store `dispatch` method, the source code
would appear like this `state = reducer(state, action)`. That by calling reducer
its going to return internal state of the store, as return value. Then if state
has change occurs, that notifies all `subscribe` listeners.

Now something you may have noticed is that when we dispatch and match actions in
the reducers, we have to repeat those string values of the conditions. That can
introduce human error when hard coding values like this.

```js
// src/actionTypes.js
export const BUG_ADDED = "bugAdded";
export const BUG_REMOVED = "bugRemoved";
```

Instead, you can define a action types file. A single place you setup and export
those string literal values, so that can be managed centrally.

## Action creators

Another problem with the above example implementation is when a `store.dispatch`
is made for action toward reducers. Notice how we dispatching actions above, its
not easy. We also wire it into the UI-layer, and its repetitive code. This means
you have multiple areas you need dispatching the same structure.

Instead of repeating all the same object structure you can make a **function**,
that's called **action creator** that return an action object for you:

```js
//src/store/action.js
export const BUG_ADDED = "bugAdded";
export const BUG_REMOVED = "bugRemoved";

export function bugAdded(description) {
  return {
    type: BUG_ADDED,
    payload: {
      description: description,
    },
  };
}
export function bugRemove(id) {
  return {
    type: BUG_REMOVED,
    payload: {
      id: id,
    },
  };
}
```

We define all action creators in `action.js` and export them for usage.

```js
// src/index.js
import store from "./store";
import { bugAdded, bugRemove } from "./action";

store.dispatch(bugAdded("bug one"));
store.dispatch(bugAdded("bug two"));
console.log(store.getState()); // [{...}], [{...}]
store.dispatch(bugRemove(1));
console.log(store.getState()); // [{...}]
```

## Basic Redux DevTools setup

For [Basic store](https://github.com/zalmoxisus/redux-devtools-extension) setup:

For a basic Redux store simply add the following to your `store`.

```js
const store = createStore(
  reducer, /* preloadedState, */,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
```

Note `preloadedState` argument is optional in Redux `createStore`. The above is
basically checking if the global `window` object has the Redux extension and if
`true`, then we going to `&&` logically invoke the right expression. It calls a
store enhancer thats basically a function that enhances our Redux store. Above,
this "enhancer" allows our Redux `store` to communicate with chrome.

# Writing Clean Redux

A common complaint toward Redux is the amount of boilerplate, lets address this.

## Structuring files and folders

1# A recommended location for all Redux files is project folder is `src/store`.
We do this to completely isolate state management from our presentation UI code.
Do NOT name the `store` folder redux. Keep it as an "artifact" and name it based
on their role in your application. 2# To improve the structure even more, group
files and folders by a `features` folder, under the store. We breaking down our
application into a bunch of smaller sub-domains or bounded context.

Each sub-domain/feature represents a slice out of all the features. Each should
contain its own actions, action types, reducer. Example, an `auth` slice/domain
is a context which is all about authentication in our application.

```
src/
  store/
    auth.js
    bugs.js
    project.js
    user.js
```

Another recommendation is that all context is merged into a single file for that
feature. So your action.js, actionTypes.js, reducer.js in that folder can all be
moved in one "slice" like file. Example a "auth" feature in `src/store/auth.js`.
Now you don't need to set/touch so many different files to get working.

This is called the **Ducks Pattern**, it's essentially a bundle of action types,
actions and reducer for a specific domain.

## Ducks Pattern

This approach means we merge all code for a store slice, in its own module file.
Below we setup the file `src/store/bugs.js`:

```js
// Action types:
const BUG_ADDED = "bugAdded";
const BUG_REMOVED = "bugRemoved";

// Action creators
export const bugAdded = (description) => {
  return {
    type: BUG_ADDED,
    payload: {
      description: description,
    },
  };
};
export const bugRemove = (id) => {
  return {
    type: BUG_REMOVED,
    payload: {
      id: id,
    },
  };
};

// Reducer
let lastId = 0;
export default function reducer(state = [], action) {
  switch (action.type) {
    case BUG_ADDED:
      return [
        ...state,
        {
          id: ++lastId,
          description: action.payload.description,
          resolved: false,
        },
      ];
    case BUG_REMOVED:
      return state.filter((bug) => bug.id !== action.payload.id);
    default:
      return state;
  }
}
```

You need to ensure that the reducer is the main default exported. And with each
action creator we still keep exporting them individually. Now we can make change
to the `bugs.js` domain "slice" from a single/central location.

## Redux Toolkit (Recommended)

This library provides a bunch of helper/utility functions for simplifying Redux
configuration and implementation.

#1 - Creating the store with `configureStore`

Provided is the `configureStore` function that wraps over `createStore` and sets
up extra development features that make your job implementing Redux easier.

Like including of Redux DevTool configuration by default. So you now don't need
to configure any thing, import any enhancer. But the biggest advantage with this
`configureStore`, is the ability to be able to now dispatch `async` actions.

```js
// src/store/configureStore.js
import { configureStore } from "@reduxjs/toolkit";
import reducer from "./bugs";

export default function () {
  return configureStore({
    // We are required to pass a configuration object
    reducer: reducer,
  });
}
```

Now if we side-effect and invoke any API, we don't need to include `redux-thunk`
middleware configuration. Without it `configureStore` you going to need to setup
the store manually, and include async handling middleware.

A very big value add with the `configureStore` toolkit API is a easier/friendly
abstraction over the standard Redux `createStore` function.

```js
// src/index.js
import configureStore from "./store/configureStore";
import { bugAdded } from "./store/bugs";
const store = configureStore();

store.dispatch(bugAdded("🪲 1"));
```

Notice that its a lot easier to setup.

#2 - Returning action creators with `createAction`

As seen with the above "manual" **action creator** we repeat a return structure,
and this is where we can use Redux toolkit to simplify our code. It's a utility
function that returns an (action creator) for a given action `type` string.

```js
// src/store/bugs.js (slice)
import { createAction } from "@reduxjs/toolkit";
const action = createAction("bugUpdated"); // returns an action creator function
action({ id: 1 }); // when invoked it we setting the `payload` property
// Output:
// {type: 'bugUpdated', payload: {…}}
//  - type: "bugUpdated",
//  - payload: {id: 1}
```

And this new action creator accepts a single argument, which will be included in
the `action` object also as a field called `payload`. Its ready for usage in our
reducer logic, that is looking for that `type` property of our action.

```js
// src/store/bugs.js (slice)
import { createAction } from "@reduxjs/toolkit";

// Create action creators (removed constant for types)
export const bugAdded = createAction("bugAdded");
export const bugRemoved = createAction("bugRemoved");

// Reducer
let lastId = 0;
export default function reducer(state = [], action) {
  // using type property here in place of constants
  switch (action.type) {
    case bugAdded.type:
      return [
        ...state,
        {
          id: ++lastId,
          description: action.payload.description,
          resolved: false,
        },
      ];
    case bugRemoved.type:
      return state.filter((bug) => bug.id !== action.payload.id);
    default:
      return state;
  }
}
```

The key point here `createAction` returns an function, and when we invoke it, we
are automatically defining its `payload` property. Below we set these `payload`
object's when we dispatch our action. See below example!

```js
// src/index.js
import * as actions from "./store/bugs";
const store = configureStore();

store.dispatch(actions.bugAdded({ description: "🪲 1" }));
store.dispatch(actions.bugAdded({ description: "🪲 2" }));
store.dispatch(actions.bugAdded({ description: "🪲 3" }));
store.dispatch(actions.bugRemoved({ id: 1 }));
```

As you can see, we shortened the amount of code needed for action type constants
because we are using the `type` property, when we case match in the reducer.

#3 - Creating Reducers with `createReducer`

A utility function that allows defining a reducer as a mapping from action type
to case reducer functions that handle these action types.

We can improve our reducer's use of switch statements and its updating approach.
Many developers dislike the **immutable update pattern**. Remember, we supplying
current and `...state` spread it into a new return "copy", then add updates.

Redux toolkit has a process to create a reducer without switch statements, and
without worrying about writing non-mutating code.

- Most importantly, we can actually write regular and mutating of state code.

Behind the scenes the toolkit is using **Immer** to avoid direct manipulation.
Remember **Immer** automatically translates to a immutable update version.

The reducer's initial state is passed as the first argument. The second param is
an object "map of actions", to functions for those action types.

```js
import { createAction, createReducer } from "@reduxjs/toolkit";

// Create action creators
export const bugAdded = createAction("bugAdded");
export const bugResolved = createAction("bugRemoved");
export const bugRemoved = createAction("bugRemoved");

// Reducer
let lastId = 0;
export default createReducer([], {
  // The mapping object holds key-value pairs:
  // - key: the name of the action what its called.
  // - value: the function that handles the actual action/task.
  [bugAdded.type]: (bugs, action) => {
    // Write direct mutating code instead as `immer` handles immutability.
    // And `immer` translates this to a immutable update pattern.
    bugs.push({
      id: ++lastId,
      description: action.payload.description,
      resolved: false,
    });
  },
  // Notice we writing direct mutating code as seen outside of Redux.
  [bugResolved.type]: (bugs, action) => {
    const index = bugs.findIndex((bug) => bug.id === action.payload.id);
    bugs[index].resolved = true;
  },
  [bugRemoved.type]: (bugs, action) => {
    bugs.filter((bug) => bug.id !== action.payload.id);
  },
});
```

The body of every case reducer is implicitly wrapped with a call to `produce`.
Remember that is from the `immer` library. This means that rather than returning
a cloned new state object, you can write mutating state code directly.

```js
produce(initialState, (draftState) => {
  draftState.x + 1;
});
```

Remember **Immer** `produce` takes initial state, and its second argument is a
function for updating that state. This (`draftCopy`) is a **proxy**, it records
all changes applied to it. Changes are then applied to a copy of the state. This
second argument is the same callback function we define in our key-value pair in
our `createReducer` implementation. In short, the `redux-toolkit` automatically
passes the callback function to **Immer**, for configuring a immutable update.

These mutations will then be automatically and efficiently translated in copies,
giving you both convenience and immutability.

Lastly, because we not using switch/case statements, we don't worry about that
`default` case at the end of our manually implemented reducer. We avoid a common
mistake when developers forget to add a `default` return of state.

#4 - Creating slices with `createSlice`

Redux toolkit also offers a function that combine `createAction`/`createReducer`
together so it auto creates actions and its intended reducer for a slice.

It's a function that accepts a "slice name", an initial state, an object full of
reducer functions that are callbacks.

It auto generates these action creators, to action type, and that correspond to
reducer(s) and state. The reducer argument is passed to `createReducer`.

```js
// src/store/bugs.js (slice)
import { createSlice } from "@reduxjs/toolkit";

let lastId = 0;
const slice = createSlice({
  // The slice's name, used to domain/namespace for the generated action types.
  name: "bugs",
  // And initial state here, an object template passed to each slice reducer.
  initialState: [],
  // Here action creators, types, their adjacent reducer (all together).
  // We define a mapping of action `type` to => action handler/callback.
  // A mapping from action types to specific reducer functions.
  // All action types here also match to action creator automatically :)
  // That means this part of the toolkit generates with `createAction`.
  // Simply put, adding a new reducer creates a `action creator`.
  reducers: {
    bugAdded: (bugs, action) => {
      bugs.push({
        id: ++lastId,
        description: action.payload.description,
        resolved: false,
      });
    },
    bugResolved: (bugs, action) => {
      const index = bugs.findIndex((bug) => bug.id === action.payload.id);
      bugs[index].resolved = true;
    },
    bugRemoved: (bugs, action) => {
      bugs.filter((bug) => bug.id !== action.payload.id);
    },
  },
});

export const { bugAdded, bugResolved, bugRemoved } = slice.actions;
export default slice.reducer;
```

We do not need worry about the computed property name `type`. Automatically its
going to define our action creator names for us.

Lastly, each slice **action creator** needs to be individually exported/imported
and we can do this referring to the property `slice.actions` with destructuring.
We also default export our main reducer `slice.reducer` directly out.

# Designing the Store

You can separate your global state from your UI component local-level state. But
then you are going to be missing all the benefits of Redux:

- Unified-data access thats central and consistent store
- Caching your persistent store state
- If data has already been network fetched, then cache it
- Debugging tools like Redux DevTools extension
- We get to perform time-travel debugging on testable code

If you only using Redux for sharing global state data, then you can consider the
use of the React context API instead.

Using Redux for all state is better than dividing it up between whats global vs
local. You have rather a single unified way to access data.

- Your code is more consistent and maintainable.

However you can't keep everything in Redux, an exception is `<form>` state. Its
because it holds temporary values. You have usually no gain in keeping `<form>`
data in the Redux store. Also we do not want to dispatch too many times. Likely
`<form>` have onChange event handling and that would dispatch to much.

The more state you can get in the `store`, the more you get out of Redux. But it
does not mean put absolutely everything in the `store`. You can still use local
state and it should be used when it makes sense like with a `<form>` element.

If you building a component that holds data no other component cares about, then
it would be better to just keep it isolated locally, to that component.

## Structuring a Redux store (best practice)

Consider a object to hold objects over an array data structure. As each value in
the object is going to represent a individual object.

The benefit, is an object is quick to look up by `state[id]`. It's a very faster
operation compared to array lookups that perform iteration like `findIndex`. The
BigO notation, for each object lookup is better in a object structure. We don't
involve any array iteration. It does not mean an object fits all scenarios.

Yes an objects has quick lookups but they don't preserve order. You can't filter
different lists easy. The main principle, understand the problem you solving.

- Faster lookup use object
- Keeping an order use array
- Or combine them both

```js
{
  byId: {
    1: { ... },
    2: { ... },
    3: { ... },
  },
  allIds: [1, 2, 3]
}
```

Looking forward at a recommended Redux store design:

```js
// basic before:
{
  bugs: [],
  projects: [],
  tags: []
}
// more complex after:
{
  entities: {
    bugs: [],
    projects: [],
    tags: []
  },
  auth: { ... },
  ui: { ... },
}
```

Instead of all slices being separate and only about entities. We can make room
for other application domains like slices for `auth` or `ui` etc...

They being other top-level domain context you can make part of Redux :) Example
the `ui` slice can keep data regarding specific pages in our components.

## Combining reducers with `combineReducers`

`combineReducers` turns an object whose values are different reducer functions,
into a single reducer function. It'll call every child reducer, and gather their
results into a single state object, whose keys correspond to keys of the passed
reducer functions that handle the operation for the action type.

```js
// src/store/entities.js (top-level slice)
import { combineReducers } from "@reduxjs/toolkit";

import bugsReducer from "./bugs";
import projectsReducer from "./projects";

export default combineReducers({
  bugs: bugsReducer,
  projects: projectsReducer,
});
```

Above we want our entities slice to hold two sub-slices "domains" being bugs and
projects. We then pull these into the top-level reducer for our `store`.

```js
// src/store/configureStore.js
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import entitiesReducer from "./entities";

// top-level root reducer:
// entities slice holds two sub-slices { bugs: [...], projects: [...] }:
const reducer = combineReducers({
  entities: entitiesReducer,
});

export default function () {
  return configureStore({
    reducer: reducer,
  });
}
```

Combing these reducers, we essentially creating a hierarchy of reducer functions
that at the top-level we have our root reducer and this is the reducer are store
will talk towards. When you `dispatch` an action, our store passes the action to
the root reducer. Then it invokes each child reducer, passing the action.

Understand in Redux, multiple reducers can handle the same action. Each reducer
is responsible for updating a "slice" of the store. Example, projectsReducer can
only update the projects slice when it matches an action.

## Selectors

You going to want to compute/query your derived data from your Redux store. Now
if you write `store.getState` when you consume this, chances are you going to be
writing them all over the show in your components. If you have a problem with a
"getter" selector, then you going to have to find them all, and modify them.

A better approach is writing them in the slice/domain as a reusable getter that
it belongs to, so you can maintain it in one location. Here we encapsulate this
logic, and keep it in our `bugs.js` slice. Our selector takes the current state
and returns computed state.

```js
// src/store/bugs.js (slice)
export const getResolvedBugs = (state) => {
  return state.entities.bugs.filter((bug) => bug.resolved);
};

// src/index.js
// Later when we consume that computed state...
import configureStore from "./store/configureStore";

import { bugAdded, bugRemoved, getResolvedBugs } from "./store/bugs";

store.dispatch(bugAdded({ description: "🪲 1" }));
store.dispatch(bugAdded({ description: "🪲 2" }));
store.dispatch(bugAdded({ description: "🪲 3" }));
store.dispatch(bugRemoved({ id: 1 }));

// Here using the selector!
const resolved = getResolvedBugs(store.getState());
```

Now we have a single place for extracting the data we need from Redux.

## Memoizing selectors with `reselect`

A library for creating memoized "selector" functions. Commonly used with Redux,
but usable with any plain JS immutable data as well. We not caching here so when
we run the same operation twice, both selector calls are not the same.

```js
const x = getResolvedBugs(store.getState());
const y = getResolvedBugs(store.getState());
console.log(x === y); // false
```

We can fix this! with memoizing the invocations, function "calls". Technique for
optimizing the usage of expensive functions.

- We build a cache of input data and ready as output.
- We have the list of bugs array already in memory/cache.
- No need to recompute it again, if input is the same.
- Input needs selector function to provide a portion of state.
- Output is also known as the results/compute function.

```js
// Memoization:
export const getResolvedBugs = createSelector(
  (state) => state.entities.bugs, // input
  (bugs) => bugs.filter((bug) => bug.resolved) // output
);
```

Selectors typically expect the entire Redux state object as an argument, while a
slice reducer only has access to a specific subset of the entire Redux state. So
if you going to select slice data out of your Redux store, create export a const
within that slice file "application domain" like `getResolvedBugs`.

The reselect `createSelector` relies on reference comparisons to determine if a
input has changed. The function section makes use of the `Immer` proxy state.

Your selector can compute derived data, allowing Redux to store minimal possible
state. Your selectors are efficient and don't recomputed unless one of its input
argument(s) that has changed.

# Middleware

The building block that allows us to run side-effects like calling API's. This
is a core and important feature of Redux.

## What is middleware?

Its code that gets executed after a action is dispatched and before reaching any
root reducer or child reducers. You can get many different types:

- Remote API calls
- Error and debugging reports
- Analytics
- Authorization

In this middleware pipeline, we add functions that interface with actions. This
middleware is a piece of code that gets executed after action is dispatched and
before it reaches a reducer, its in the middle.

If `auth.js` middleware finds a user isn't authenticate, you can stop processing
of that action before it reaches any reducer on the other side of the pipeline.

## Create middleware "manually"

Recap, remember our wrapping function example above! We curry so that it takes
the type first, then returns a function when invoked. Meaning it can still can
be used in the pipeline when composed from.

```js
import { compose, pipe } from "lodash/fp";

let input = "     javascript     ";
const trim = (str) => str.trim();
const lowerCase = (str) => str.toLowerCase();
const wrap = (type) => (str) => `<${type}>${str}</${type}>`;

// const wrapDiv = (str) => `<div>${str}</div>`; // This has duplication ❌
// const wrapSpan = (str) => `<span>${str}</span>`; // This has duplication ❌

const transform = pipe(trim, lowerCase, wrap("div")); // its more logical :)
console.log(transform(input)); // <div>javascript</div>
```

Back to the custom middleware.

Create a middleware folder in `src/store/middleware`. Your middleware functions
can all be defined here as they central to our Redux app. They not specific to
any slice/domain. They're central to our app like a (pipeline). Here `logger.js`
is a curried type of function. Remember this is a "technique" that allows us to
convert a function with (n#) parameters, to a bunch of nested functions. Inside
this outer HOF, it keeps all variables accessible, in whats called a closure. We
are currying to ensure the nested/inner functions also each get a parameter.

```js
// src/store/middleware/logger.js
// Rather than a one single function:
const logger = (store, next, action) => {};

// We instead currying to each nested "inner" function:
const logger = (store) => (next) => (action) => {
  console.log("store: ", store);
  console.log("next: ", next);
  console.log("action: ", action);
};
// Output:
// store {getState: ƒ, dispatch: ƒ}
// next ƒ e(r) {...}
// action {type: 'projects/projectAdded', payload: {...}}
export default logger;
```

Above is the simplest middleware implementation you can configure manually. Now
to use it, we need to register it in our `configureStore` configure object.

```js
// src/store/configureStore.js
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import logger from "./middleware/logger";
// top-level root reducer:
const reducer = combineReducers({
  entities: entitiesReducer,
});

export default function () {
  return configureStore({
    reducer: reducer,
    middleware: [logger], // An array of Redux middleware functions.
  });
}
```

- Regarding the middleware parameters

The `store` parameter is an object that looks like the actual store BUT its only
an object that references two of the the actual properties from the store.

Your `next` is the next middleware function to run in our pipeline. If you only
have one middleware, the next function is your root reducer, meaning you at the
end of the pipeline. And `action` is well the action we dispatching.

What is interesting because we only log out parameters in our currying function,
nothing is reaching the actual Redux `store`. Unless you invoke `next` with the
"action" you intend to reach a reducer within the last function body, nothing is
going to proceed further. No other middleware or reducer will see this action.

```js
const logger = (store) => (next) => (action) => {
  console.log("store: ", store);
  console.log("next: ", next);
  console.log("action: ", action);
  // You need to invoke next for the action to proceed.
  // We also return out here (exit logic)
  return next(action);
};
```

Lastly, you can also destructure the `store` object by its two properties. That
is dispatch and getState from the first function parameter, being the store. So
that is how we configure a manual middleware in our Redux store.

## Dispatching functions

We learnt Redux actions need to be plain objects with a `type` property. If you
call `store.dispatch(here)` without that criteria "say empty object", well that
its going to **Error**: Actions may not have an undefined type property. 🤔

What happens if we tried a function argument `dispatch(here)`. We'll **Error**:
Actions must be plain objects or custom middleware for async actions. Wait! ✋
we can use functions? Yes! you can side effect before dispatching.

We perform the async action then `dispatch` and only if the returned promise has
a object with the `type` property, do we continue to a dispatch to a reducer. So
we invoke effects like calling an API endpoint to append more data etc. Here our
custom middleware, we give our store the ability to dispatch `function`.

```js
// src/store/middleware/func.js
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
// Output:
// store: {getState: ƒ, dispatch: ƒ}
// next: ƒ e(r) {...}
// action: ƒ ({ dispatch, getState }) => {...}
```

Before we consider `redux-thunk` you can write the store functionality manually.
Our custom thunk checks if the action type is a `function`. If so we allowing it
to continue to invoking that `action()` passed into this middleware.

And above is the manual/custom thunk we defined. We use the `store` object that
is referenced & passed back to our `action()` in our currying custom thunk. This
allows us to continue to dispatching our action even if its a `function`. And as
mentioned, we invoking that `action()` directly with the current thunk store. We
only `next` in our curry custom middleware, if `action` is now "else" an object.
That means it needs to be object with a `type` property, and not a `function` to
proceed toward the end of the pipeline still, toward our reducers.

We apply middleware pipeline by registering it in our store configuration.

```js
// src/store/configureStore.js
import myThunk from "./middleware/func";
// ...
export default function () {
  return configureStore({
    reducer: reducer,
    middleware: [myThunk],
  });
}
```

Lastly, keep in mind that when we dispatch in the consuming component, you want
to reference the curried version of the `store`, not the direct store itself. We
get this middleware store version passed back when type of action `===` equality
is a function. Remember the middleware will invoke `action()` will store.

```js
// src/index.js
store.dispatch(() => {
  // ! Do API call here before dispatching.
  // Problem, we invoking the actual `store` object not the middleware version.
  store.dispatch({ type: "bugsReceived", bugs: [1, 2, 3] }); // ❌
});
// Here we using the middleware `store` passed back to our `action()` invoked in
// our curried middleware function called `myThunk` work-flow.
store.dispatch(({ dispatch, getState }) => {
  // ! Do API call here before dispatching.
  // Rather we reference the thunk's dispatch method here:
  dispatch({ type: "bugsReceived", bugs: [1, 2, 3] });
});
```

As mentioned, this middleware is already setup in `reduxjs/toolkit` by default.
We can use the already configured `redux-thunk`, just remove your overriding of
the `middleware` array. Rather import and spread the `getDefaultMiddleware`.

```js
import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
} from "@reduxjs/toolkit";

import entitiesReducer from "./entities";
// ...
export default function () {
  return configureStore({
    reducer,
    middleware: [...getDefaultMiddleware()], // pipeline (order matters)
  });
}
```

# Consuming APIs

## The Approach

As covered a **reducer** are pure functions, no side-effects, no API calls, no
DOM manipulation, no state mutation. Those attributes make our reducers easy to
test and work with. They only get current state and return new/copied state.

- Where do we handle async logic in redux then?

In **action creators** that are sync code by default. Traditionally our creators
return object but as discovered with `redux-thunk` middleware, we able to handle
`async` tasks of type `function`, before dispatching an object to reducers.

With `redux-thunk` we invoke function before dispatching. The nested function we
return, is where we encapsulate code with side-effects.

```js
function actionCreator() {
  // #1 - Call async API here :)
  return (dispatch, getState) => {
    // #2 - Resolved: f: dispatch(success)
    // #3 - Rejected: f: dispatch(error)
  };
}
```

Recall `thunk` middleware automatically passes two function properties. That is
`dispatch` & an `getState` thats "optional" from the store object. Topically you
have 3 steps in your async action creator implementation. In this nested async
function we have the following basic pattern:

#1 Call an API that returns a promise object. If the promise is resolved, we can
#2 a successful request we `dispatch` an action type with the `payload` from the
API that matches a reducer condition, updating our store. However if promise was
instead rejected, then we #3 on failure `dispatch` error to reducers instead.

But this above pattern can get messy :(

Its very repetitive, in all async action creators we dispatch actions, you must
provide 3 steps. Instead, can this async operation go directly into middleware?

## API middleware

Here we define an `store/middleware/api.js`, that means with this as middleware,
we able to serve more than one action creator, as all their dispatching actions
go into a funnel, passing by `api.js` middleware.

Firstly, if `type` is not `apiCallBegan` string then we going to pass the action
along to our `next` middleware in the currying "middleware" pipeline. You don't
want your middleware to swallow dispatching actions.

If you want a action `apiCallBegan` to appear, you need to pass it to the `next`
middleware function before you make an API call with a different action type. We
can do this directly after the exiting condition, for non-API calls is returned.
Here we making an API call with `axios` and those known 3 steps for async action
creators, that is also used here.

```js
// store/middleware/api.js
const api = (store) => (next) => async (action) => {
  // Here we supply an exit condition "route" for non-API requests:
  // We supply `next` to ensure the action remains on the middleware pipeline.
  // We don't want this api function to continue execution.
  if (action.type !== "apiCallBegan") {
    next(action); // pass it along to other middleware's in the pipeline.
    return; // and we need to return out with existing logic.
  }
  next(action);
  // #1 - make an API call
  // If you reached this point `apiCallBegan` is the type we want handled.
  // We destructure the properties from our action `payload`.
  // The promise we can then and catch but `async/await` works better.
  // When using `await` we have to wrap it in try/catch block.
  // As we `await` you need to `async` in the closing and wrapping parent.
  // Thanks to middleware we `dispatch` the response data into payload.
  const { url, method, data, onSuccess, onError } = action.payload;
  try {
    const response = await axios.request({
      baseURL: "http://localhost:9001/api",
      url, // This is only the endpoint we still need the `baseURL`
      method,
      data,
    });
    // #2 - Resolved promise in dispatch `bugsReceived` type
    store.dispatch({ type: onSuccess, payload: response.data });
  } catch (error) {
    // #3 - Rejected promise in dispatch `apiRequestFailed` type
    store.dispatch({ type: onError, payload: error });
  }
};
```

Now we can dispatch action from the consumer being in `index.js`:

```js
// src/index.js
store.dispatch({
  type: "apiRequest",
  payload: {
    url: "/bugs",
    onSuccess: "bugsReceived",
    onError: "apiRequestFailed",
  },
});
```

Lastly we configure our store with the needed middleware array with `api.js`.

```js
import api from "./middleware/api";
// ...
export default function () {
  return configureStore({
    reducer,
    middleware: [...getDefaultMiddleware(), api],
  });
}
```

## Action creators for the API domain space

Here we going to define the `api.js` domain space and we also prefix `api/`.

```js
// src/store/api.js (slice)
import { createAction } from "@reduxjs/toolkit";
export const apiCallBegan = createAction("api/callBegan");
export const apiCallSuccess = createAction("api/callSuccess");
export const apiCallFailed = createAction("api/callFailed");
```

Below we can use those action creator name spaces instead of type strings. This
will ensure things are not hardcoded.

```js
// src/index.js
// Here we dispatching a complete action object with a type property.
store.dispatch({
  type: apiCallBegan.type,
  payload: {
    url: "/bugs",
    onSuccess: apiCallSuccess.type,
    onError: apiCallFailed.type,
  },
});
// A safer approach, use the async action creator dedicated for the slice.
store.dispatch(
  apiCallBegan({
    url: "/bugs",
    onSuccess: apiCallSuccess.type,
    onError: apiCallFailed.type,
  })
);
```

Add general and specific dispatch action handlers from our `api.js` middleware.

```js
// store/middleware/api.js
const api = (store) => (next) => async (action) => {
  // Here we supply an exit condition "route" for non-API requests:
  // We supply `next` to ensure the action remains on the middleware pipeline.
  // We don't want this api function to continue execution.
  if (action.type !== apiCallBegan.type) {
    next(action); // pass it along to other middleware and below we return out.
    return; // and we need to resupply return existing logic.
  }
  next(action);
  // #1 - make an API call
  // If you reached this point `apiCallBegan` is the type we want handled.
  // We destructure the properties from our action `payload`.
  // The promise we can then and catch but instead `async/await` (recommended).
  // When using the `await` keyword we have to wrap it in try/catch block.
  // In this block we `await` and `async` the closing/wrapping parent function.
  // Thanks to middleware we next dispatch the response data into payload.
  const { url, method, data, onSuccess, onError } = action.payload;
  try {
    // #1 - make API call
    const response = await axios.request({
      baseURL: "http://localhost:9001/api",
      url, // This is only the endpoint we still need the `baseURL`.
      method,
      data,
    });
    // #2 - handle resolved promise in dispatch `apiCallSuccess` type
    // Attempt the general store followed by the specific dispatching:
    store.dispatch(apiCallSuccess(response.data));
    if (onSuccess) store.dispatch({ type: onSuccess, payload: response.data });
  } catch (error) {
    // #3 - handle rejected promise in dispatch `apiCallFailed` type
    store.dispatch(apiCallFailed(error));
    if (onError) store.dispatch({ type: onError, payload: error });
  }
};
```

## Restructuring the store

Here we are changing our initial state from array based to object base state for
our `bugs.js` slice/domain. Why is this useful?

You can template your initial state properties to default values.

```js
// src/store/bugs.js (slice)
let lastId = 0;
const slice = createSlice({
  // The slice's name, used to domain/namespace for the generated action types.
  name: "bugs",
  // And initial state here its an object template passed to each slice reducer.
  initialState: {
    list: [],
    loading: false,
    lastFetch: null,
  },
  // Here action creators, types, their adjacent reducer (all together).
  // We define a mapping of action `type` to => action handler/callback.
  // A mapping from action types to specific reducer functions.
  // All action types here also match to action creator automatically :)
  // That means this part of the toolkit generates with `createAction`.
  reducers: {
    bugAdded: (bugs, action) => {
      bugs.list.push({
        id: ++lastId,
        description: action.payload.description,
        resolved: false,
      });
    },
    bugResolved: (bugs, action) => {
      const index = bugs.list.findIndex((bug) => bug.id === action.payload.id);
      bugs.list[index].resolved = true;
    },
    bugRemoved: (bugs, action) => {
      bugs.list.filter((bug) => bug.id !== action.payload.id);
    },
    bugsReceived: (bugs, action) => {
      bugs.list = action.payload;
    },
  },
});
```

And now when we consume those newer `bugAdded` action creator:

```js
// src/index.js
store.dispatch(bugAdded({ description: "🪲 1" }));
store.dispatch(bugAdded({ description: "🪲 2" }));
// Output:
// {
//   entities: {
//     bugs: {
//       list: [
//         {
//           id: 1,
//           description: '🪲 1',
//           resolved: false
//         },
//         {
//           id: 2,
//           description: '🪲 2',
//           resolved: false
//         }
//       ],
//       loading: false,
//       lastFetch: null
//     },
//     projects: []
//   }
// }
```

Also we can do caching techniques. Now changing initial state means you likely
going to have to change the reducer logic in the slice.

## Getting data from the server

Here we cover how to get the server data that the `api.js` middleware collected,
into our `bug.js` slice state.

```js
// src/store/bugs.js (slice)
let lastId = 0;
const slice = createSlice({
  // ...
  reducers: {
    // ...
    // Here we retrieve data collected by our middleware `api.js`.
    // We then hydrate our list from the payload.
    bugsReceived: (bugs, action) => {
      bugs.list = action.payload;
    },
  },
});

export const { bugAdded, bugResolved, bugRemoved, bugsReceived } =
  slice.actions;
```

As seen before we can now invoke this action creator. But there is a problem! we
should not include these details in our UI element/component layer.

```js
// src/index.js
store.dispatch(
  apiCallBegan({
    url: "/bugs",
    onSuccess: bugsReceived.type,
  })
);
// Instead we should aim for dispatching with a helper function:
store.dispatch(loadBugs());
```

Think of `index.js` as a entrypoint, the boundary of your React App. You should
not show these details "that is non-UI" in your React components. Besides making
your React components bloated, if you have this setup code in UI components and
a change needs to occur, then you have to modify many different locations.

What action we dispatch and configuration needed is irrelevant. You simply want
to dispatch action and your store gets "hydrated" with server data. Let's create
a action creator called `loadBugs`, and encapsulate the above API async action.

From `bugs.js` under all the slice/reducer implementation, we define a function
that is individually exported and invokes our `apiCallBegan` action creator.

```js
// src/store/bugs.js (slice)
// ...
// Handler function invokes api action creator from `bug.js` slice data.
export const loadBugs = () => {
  return apiCallBegan({
    url: "/bugs",
    onSuccess: bugsReceived.type,
  });
};
```

# Loading Indicators

When we API call for server data lets set our loading state that while `true`,
we display a loading element in our component.

Here we update our `bugs.js` slice to include loading status so that when we do
retrieve the payload data successfully from the api middleware, a `bugsReceived`
action to reducer will change loading state as needed.

After that is done we need to pass this new actions to our `api.js` middleware,
so it dispatches it before making any API call. We modify our `loadBugs` action
creator that passes `onStart` and `onSuccess` properties.

```js
// src/store/bugs.js (slice)
let lastId = 0;
const slice = createSlice({
  name: "bugs",
  initialState: {
    list: [],
    loading: false, // Here!
    lastFetch: null,
  },
  reducers: {
    bugAdded: (bugs, action) => {
      bugs.list.push({
        id: ++lastId,
        description: action.payload.description,
        resolved: false,
      });
    },
    bugResolved: (bugs, action) => {
      const index = bugs.list.findIndex((bug) => bug.id === action.payload.id);
      bugs.list[index].resolved = true;
    },
    bugRemoved: (bugs, action) => {
      bugs.list.filter((bug) => bug.id !== action.payload.id);
    },
    bugsReceived: (bugs, action) => {
      bugs.list = action.payload;
      bugs.loading = false; // Here!
    },
    // Here!
    bugsRequested: (bugs, action) => {
      bugs.loading = true; // Here!
    },
    bugsRequestFailed: (bugs, action) => {
      bugs.loading = false;
    },
  },
});

export const {
  bugAdded,
  bugResolved,
  bugRemoved,
  bugsReceived, // Here!
  bugsRequested, // Here!
  bugsRequestFailed, // Here!
} = slice.actions;

export default slice.reducer;

// Handler function invokes `api.js` action creator from `bug.js` slice data.
export const loadBugs = () => {
  return apiCallBegan({
    url: "/bugs",
    onStart: bugsRequested.type, // Here!
    onSuccess: bugsReceived.type, // Here!
    onError: bugsRequestFailed.type, // Here!
  });
};
```

Now we need to open our `api.js` middleware and make sure we give it the ability
to dispatch this action `onStart` before it makes the API call. Ensuring at that
point our reducer match our `bugsRequested` setting our loading state to `true`.
First you have to extract the needed property from the passing action `payload`.
Then we `dispatch({type: onStart})` and provide logic if its only defined.

```js
// store/middleware/api.js
const api = (store) => (next) => async (action) => {
  if (action.type !== apiCallBegan.type) {
    next(action);
    return;
  }
  next(action); // We can change the order of calling the `next()` function...
  const { url, method, data, onSuccess, onError, onStart } = action.payload;
  // Here before the API call!
  if (onStart) store.dispatch({ type: onStart }); // Here!
  // Too over here "next" after dispatching `bugsRequested` action!
  // Bring the `next()` invocation down here so we change the action order.
  next(action);
  try {
    const response = await axios.request({
      baseURL: "http://localhost:9003/api",
      url,
      method,
      data,
    });
    store.dispatch(apiCallSuccess(response.data));
    if (onSuccess) store.dispatch({ type: onSuccess, payload: response.data });
  } catch (error) {
    store.dispatch(apiCallFailed(error.message));
    if (onError) store.dispatch({ type: onError, payload: error.message });
  }
};
```

- Important!
  https://stackoverflow.com/questions/61062278/how-does-next-work-in-react-redux-middleware

Middleware forms a pipeline around the actual Redux `store.dispatch` function.
When you call `dispatch(action)`, you are actually calling the first middleware
in the pipeline chain. Inside the middleware a `next` passes "action" value, to
well the (next middleware), while `store.dispatch` would restart the pipeline.
Again the `action` is value passed to dispatch (or passed to `next` middleware
from previous middleware in your pipeline).

Also ensure that the order of the `next` middleware is what we want. With `next`
it simply means this middleware being `api.js` is not interested in a particular
action, and wants to pass it out, to other middleware in our pipeline to see or
take care of it. The middleware order is determined by the middleware array set
on the `configureStore`. Actions continues like this (passing the result of the
latter middleware to the middleware that comes before it). The `next` middleware
in a row, means the current middleware sends our original action to the next one
without changing anything.

Simply put:

In your middleware if you call `store.dispatch`, it calls the original dispatch
directly and passes a now new action with a new type to the dispatch. The action
that has been passed to our middleware initially, will get completely forgotten,
or swallowed up. It breaks the chain of the middleware(s) in the pipeline before
the `action` reaches the store, and starts a - "new dispatch with a new action".

And if your middleware calls the `next` function, as described before, it's the
"next" middleware in the pipeline/row, and our middleware gets to send the still
original/unchanged `action` to it next middleware without changing anything. So
the result would be like, when this middleware didn't exist at all.

In scenario, our middleware merely says "I don't care about what this `action`,
I want to send it through to the `next` middleware(s) to decide about whether it
should reach the `store.dispatch` or not".

## Caching

Here we need to modify the `loadBugs` action creator not to call the API service
if we are less than < 10 mins. Below we convert the action creator that returned
a plain JS object to return a function. See the below conversion.

We change the signatures from `() => {}` returning just a object to dispatch to
a function `() => fc(dispatch, getState)` we invoke asynchronously as "callback"
after an activity like comparing timestamps. Remember, we receive two parameters
from thunk middleware, dispatch & getState. Here we alter the traditional action
creator `loadBugs` from sync to async configuration. You can now explicitly tell
when to dispatch actions within the async "callback" body of the action creator.

```js
// src/store/bugs.js (slice)
const slice = createSlice({
  // ...
  reducers: {
    // ...
    bugsReceived: (bugs, action) => {
      bugs.list = action.payload;
      bugs.loading = false;
      bugs.lastFetch = Date.now();
    },
  },
});
// From this sync action creator that returns a plain JS object:
export const loadBugs = () => {
  return apiCallBegan({
    url: "/bugs",
    onStart: bugsRequested.type,
    onSuccess: bugsReceived.type,
    onError: bugsRequestFailed.type,
  });
};
// Too a async action creator version instead...
export const loadBugs = () => {
  return (dispatch, getState) => {
    const { lastFetch } = getState().entities.bugs;
    const diffMinutes = moment().diff(moment(lastFetch), "minutes");
    if (diffMinutes < 10) return; // exiting condition/logic
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
```

We use `moment` to calc the difference between timestamps in minutes. Above if
the difference is less than < 10 we return out the exiting function.

```js
// src/index.js
setTimeout(() => {
  store.dispatch(loadBugs());
}, 2000);
```

## Saving data to the server

The steps you followed for getting data from a service is the same when setting.
First we make an API call, then dispatch for resolved or rejected promises. You
can define this in an action creator explicitly or use our `api.js` middleware.
Instead of directly making an API call, we going to dispatch an API call with a
api action for our middleware to handle. Following the same logic as `loadBugs`,
here we make use of `addBug` and `resolveBug`.

```js
// src/index.js
store.dispatch(loadBugs());
store.dispatch(addBug({ description: "🪲 1" }));

setTimeout(() => {
  store.dispatch(resolveBug(1));
}, 2000);
setTimeout(() => {
  store.dispatch(assignUser(1, 4));
}, 2000);
```

We in the "create" part of our CRUD operation as we `post` to our server and the
data field is populated by the values passed into this function when invoked. A
`onSuccess` will dispatch bugAdded.type within our `bugs.js` slice.

```js
// src/store/bugs.js (slice)
// Async action creators "command" that dispatch callback functions to `api.js`.
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
```

That is the advantage of this implementation that we have a single place we make
API calls from being our `api.js` middleware. And because its middleware, other
async action creators get defined to supply commands to our `api.js` middleware.
If successful within the middleware, a store `dispatch` is triggered passing the
additional action object that in turn matches based on the `action.type` with an
adjacent reducer, for a specific domain/slice.

```js
// src/store/middleware/api.js
// The action creator will dispatch into our middleware `api.js` with the above
// object. As onSuccess is destructured out of the payload in the middleware, it
// will condition and in turn trigger the dispatching of e.i. `bugAdded.type`.
const api = (store) => (next) => async (action) => {
  if (action.type !== apiCallBegan.type) {
    next(action);
    return;
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
```

```js
// src/store/bugs.js (slice)
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
```

# Integration with React

## Installing Redux into our React project

The benefit of separating this Redux store repository is we can easily move the
actual `store` folder into any another project and just install dependencies. A
list of npm packages are: `npm i redux @reduxjs/toolkit axios moment`.

Now we ready to connect our React components to the Redux store.

## Providing the Store

The right way to connect to a Redux store is with the `react-redux` library. But
before we cover that, lets run past the manual process without assistance. Avoid
prop drilling, we can use the context API to assist in providing store state.

`React.createContext` is all you need, and it returns a consumer and a provider.
`Provider` is a component that as it's names suggests provides the state to its
children. It'll hold the (`store`) and be the parent of all the components that
might need that store. `Consumer` component that consumes and uses this state.
https://blog.loginradius.com/engineering/react-context-api/

```js
import { createContext } from "react";

const StoreContext = createContext();
export default StoreContext;
```

The React Context API is a way to effectively produce global variables that can
be passed around. This is the alternative to "prop drilling" or the moving props
from grandparent to child to parent, and so on.

```js
import configureStore from "./store/configureStore";
const store = configureStore();

import StoreContext from "./contexts/storeContext";

function App() {
  return (
    <StoreContext.Provider value={store}>
      <Bugs />
    </StoreContext.Provider>
  );
}
```

Here we consume that context. We use `getState` from Redux to return the current
state tree of our store. The last value returned by the store's reducer

When we `dispatch` an action, this is the only way to trigger a state change. We
use the loadBugs async action creator to trigger a API request. Hence the reason
we useEffect and run it when it mounts. In our "effect" callback we add a change
listener. It will be invoked any time a `action` is dispatched, and some part of
the state tree may potentially have changed. You may call `getState` to read the
current state tree of the Redux store inside this nested callback.

```js
import React, { useState } from "react";
import { useEffect, useContext } from "react";
import StoreContext from "../contexts/storeContext";
import { loadBugs } from "../store/bugs";

export default function Bugs() {
  const [bugs, setBugs] = useState([]);
  const store = useContext(StoreContext);
  useEffect(() => {
    store.dispatch(loadBugs());
    const unsubscribe = store.subscribe(() => {
      const bugsList = store.getState().entities.bugs.list;
      if (bugs !== bugsList) setBugs(bugsList);
    });
    // cleanup callback triggered when unmounting
    return () => unsubscribe();
  }, []);
  return (
    <div>
      <ul>
        {bugs.map((bug) => (
          <li key={bug.id}>{bug.description}</li>
        ))}
      </ul>
    </div>
  );
}
```

## Connect components with `react-redux`

The above required a lot of extra boilerplate code. Let's improve the experience
with https://react-redux.js.org/ and use the library `npm i react-redux@7.2`. We
can now use their `<Provider />` component instead.

```js
import configureStore from "./store/configureStore";
import { Provider } from "react-redux";

const store = configureStore();

function App() {
  return (
    <Provider store={store}>
      <Bugs />
    </Provider>
  );
}
```

Additionally that means we can remove all context API requirements. Back in the
`Bugs` component we can remove all context required code including the useEffect
because `react-redux` is going to take care of all subscribing and unsubscribing
for us from the store itself. We'll be mapping over `props` as `react-redux` is
going to handle the subscribe to our store, and get state and pass it as props.
Instead of exporting our React component we wrap it inside a `connect` component
as that component handles the actually the subscribe and unsubscribe operations.

```js
import React from "react";
import { connect } from "react-redux";

export default function Bugs(props) {
  return (
    <div>
      <ul>
        {props.bugs.map((bug) => (
          <li key={bug.id}>{bug.description}</li>
        ))}
      </ul>
    </div>
  );
}

const mapStateToProps = (state) => {
  return { bugs: state.entities.bugs.list };
};

connect(mapStateToProps);
```

This `connect` function takes two arguments the first being an object detailing
the part of our store our component is interested in. By convention we invoke a
function we pass in `mapStateToProps`. It takes store `state` as an argument. We
must make sure we return an object `({})`, not a code block `{}`. The key value
we set here, will be passed/mapped to our React component as `props`.

Again our `mapStateToProps` takes the store/state argument and returns the part
of the store we interested in. Simply the properties of this store/state object
will end up as `props` of our React component.

Also the second argument our currying `connect` takes into its first function it
has as a parameter "when it invokes/calls inside its currying pipeline", is by a
convention another function. Typically its called `mapDispatchToProps`.

```js
const mapStateToProps = (state) => {
  return { bugs: state.entities.bugs.list };
};
const mapDispatchToProps = (dispatch) => {
  return { loadBugs: () => dispatch(loadBugs()) };
};

connect(mapStateToProps, mapDispatchToProps);
```

Here we wiring up the dispatching of actions to our store. It takes a `dispatch`
function of the store as an argument, but this time we map our action creator to
be dispatched as `props` for our component. The prop will return a callback that
is a property we can then "invoke" when the component mounts, as an effect.

```js
function Bugs(props) {
  useEffect(() => {
    props.loadBugs();
  }, []);
  return (
    <div>
      <ul>
        {props.bugs.map((bug) => (
          <li key={bug.id}>{bug.description}</li>
        ))}
      </ul>
    </div>
  );
}

const mapStateToProps = (state) => {
  return { bugs: state.entities.bugs.list };
};
const mapDispatchToProps = (dispatch) => {
  return { loadBugs: () => dispatch(loadBugs()) };
};
// container `connect` wraps presentation `Bugs` layer:
export default connect(mapStateToProps, mapDispatchToProps)(Bugs);
```

The `connect` an (HOF) where it takes a function, returns a function, or both.
When its invoked, a new function is returned, so we call that function and then
pass in the component. Under the hood this is going to create/read a component.
Think of `connect` as your container component and presentation is your `Bugs`.
That means it needs to be the `export default`, not the React/UI component. Now
we have an even better approach to achieve the same functionality :)

## Hooks (only works with functional components)

React's new "hooks" APIs give function components the ability to use local-level
component state, execute side-effects, and more. React also lets us write custom
hooks, which let us extract reusable hooks to add our own behavior on top of the
React's built-in hooks. `react-redux`, includes its own custom hook APIs. Which
allow your React components to subscribe to the Redux store, dispatch actions.

TIP: We recommend using the `react-redux` hooks API as the default approach in
your React components. The existing connect API still works and will continue to
be supported, but the hooks API is simpler and works better.

https://react-redux.js.org/api/hooks

`useDispatch` this hook returns a reference to the `dispatch` function from the
Redux store. You may use it to dispatch actions as needed, and the reference is
stable as long as the same `store` instance is being passed to the `Provider />`
and that is normally the case, as the store never changes for a given app.

```js
// src/App.jsx
import configureStore from "./store/configureStore";
import { Provider } from "react-redux";

import BugsConnect from "./components/BugsConnect";
import BugsHooks from "./components/BugsHooks";

const store = configureStore();

function App() {
  return (
    <Provider store={store}>
      <BugsConnect />
      <BugsHooks />
    </Provider>
  );
}
```

Next we can use the `useSelector` hook to select a slice of our store.

It allows you to extract data from the Redux `store`, using a selector function.
Our selector is approximately equivalent to the `mapStateToProps` argument used
in a `connect` high-order function, layout concept. The selector will be called
with the entire Redux store state as its only argument.

The selector will run whenever the function component renders (unless reference
has not changed, since your previous component render.

```js
// src/components/BugsHooks.jsx
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
```

Keep in mind that our `useSelector` will **subscribe** to the store, and will be
invoked whenever an action has been dispatched.
