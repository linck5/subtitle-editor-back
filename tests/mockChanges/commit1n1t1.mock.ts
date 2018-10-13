
export const commit1n1t1_Mock = {

  user: "user1",
  commit: "commit1n1t1",
  node: "node1t1",
  changes: [
    {
      operation: "EDIT",
      data: {
        ids: [97],
        section: "dialogues",
        fields: [{ name: "text", value: "random stuff" }]
      }
    },
    {
      operation: "EDIT",
      data: {
        ids: [98],
        section: "dialogues",
        fields: [
          { name: "start", value: 400100 },
          { name: "end", value: 400200 }
        ]
      }
    },
    {
      operation: "EDIT",
      data: {
        ids: [99],
        section: "dialogues",
        fields: [{ name: "end", value: 500100 }]
      }
    },
    {
      operation: "EDIT",
      data: {
        ids: [100],
        section: "dialogues",
        fields: [{ name: "start", value: 500200 },]
      }
    },
    {
      operation: "DELETE",
      data: { ids: [101], section: "dialogues" }
    },
    {
      operation: "DELETE",
      data: { ids: [102, 103, 104], section: "dialogues" }
    },
    {
      operation: "DELETE",
      data: { ids: [106], section: "dialogues" }
    },
    {
      operation: "TIME_SHIFT",
      data: {
        ids: [150, 151, 152],
        timeShift: -80
      }
    },
    {
      operation: "TIME_SHIFT",
      data: {
        ids: [153],
        timeShift: 105
      }
    },
    {
      operation: "CREATE",
      data: {
        section: "dialogues",
        fields: [
          { name: "text", value: "A newly created dialogue" },
          { name: "start", value: 100 },
          { name: "end", value: 101 },
        ]
      }
    }
  ]
}
