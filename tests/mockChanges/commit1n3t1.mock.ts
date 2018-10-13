
export const commit1n3t1_Mock = {

  user: "user1",
  commit: "commit1n3t1",
  node: "node3t1",
  changes: [
    //conflict: different text
    {
      operation: "EDIT",
      data: {
        ids: [5],
        section: "dialogues",
        fields: [{ name: "text", value: "conflicting text change" }]
      }
    },

    //discarded: exact same text edit
    {
      operation: "EDIT",
      data: {
        ids: [97],
        section: "dialogues",
        fields: [{ name: "text", value: "random stuff" }]
      }
    },

    //conflict: the target change changes start and end time
    //and this one changes only start time
    {
      operation: "EDIT",
      data: {
        ids: [98],
        section: "dialogues",
        fields: [{ name: "start", value: 400150 }]
      }
    },

    //conflict: target change edits end time on line 99
    //and start and end time on line 98
    {
      operation: "TIME_SHIFT",
      data: {
        ids: [98, 99],
        timeShift: 100
      }
    },

    //conflict: target change deletes this line
    {
      operation: "EDIT",
      data: {
        ids: [101],
        section: "dialogues",
        fields: [{ name: "start", value: 600100 }]
      }
    },

    //conflict: target change deletes lines 102, 103, and 104 in one change,
    //and 106 in another change
    {
      operation: "TIME_SHIFT",
      data: {
        ids: [104, 105, 106],
        timeShift: 250
      }
    },

    //conflict: target change timeshifts 150, 151 and 152 by -80
    {
      operation: "TIME_SHIFT",
      data: {
        ids: [151, 152],
        timeShift: -85
      }
    },

    //no conflict: target change time shifts line 153, but this change only
    //touches the text
    {
      operation: "EDIT",
      data: {
        ids: [153],
        section: "dialogues",
        fields: [{ name: "text", value: "timeshift / text" }]
      }
    },

    //no conflict: target changes don't touch line 190
    {
      operation: "EDIT",
      data: {
        ids: [190],
        section: "dialogues",
        fields: [{ name: "start", value: 50220 }]
      }
    },

    //no conflict: target changes don't touch line 191
    {
      operation: "DELETE",
      data: { ids: [191], section: "dialogues" }
    }
  ]
}
