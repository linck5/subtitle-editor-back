








```
"new change"
changes: [
  { id: 1, state: "active"},
]
= 1

"new change"
changes: [
  { id: 1, state: "active"},
  { id: 2, state: "active"},
]
= 1, 2

"undo"
changes: [
  { id: 1, state: "active"},
  { id: 2, state: "undone"},
]
= 1

"undo"
changes: [
  { id: 1, state: "undone"},
  { id: 2, state: "undone"},
]
=

"redo"
changes: [
  { id: 1, state: "active"},
  { id: 2, state: "undone"},
]
= 1

"new change"
changes: [
  { id: 1, state: "active"},
  { id: 2, state: "discarded"},
  { id: 3, state: "active"},
]
= 1, 3
```




state: `active` | `undone` | `discarded`


when user makes a new change:
  -mark all `undone` changes as `discarded`
  -add the new change as `active`

when user undoes:
  -mark last `active` change as `undone`

when user redoes:
  -mark first `undone` change as active
