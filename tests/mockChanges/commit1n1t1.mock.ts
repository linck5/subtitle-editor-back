
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
    },
    {
      operation: "EDIT",
      data: {
        ids: [300],
        section: "dialogues",
        fields: [
          { name: "layer", value: 2 },
          { name: "style", value: "translatorsNote" },
          { name: "name", value: "narrator" },
          { name: "marginL", value: 120 },
          { name: "effect", value: "??" },
        ]
      }
    },
    {
      operation: "EDIT",
      data: {
        ids: [1],
        section: "styles",
        fields: [
          { name: "name", value: "RubY" },
          { name: "fontname", value: "M3-Vdd" },
          { name: "fontsize", value: 52 },
          { name: "primaryColour", value: "&H00FFFFCC" },
          { name: "secondaryColour", value: "&H003325FF" },
          { name: "outlineColour", value: "&H0505FFFF" },
          { name: "backColour", value: "&000000FF" },
          { name: "bold", value: false },
          { name: "italic", value: true },
          { name: "underline", value: false },
          { name: "strikeOut", value: true },
          { name: "scaleX", value: 90 },
          { name: "scaleY", value: 90 },
          { name: "spacing", value: 1 },
          { name: "angle", value: 45 },
          { name: "borderStyle", value: 1 },
          { name: "outline", value: 2 },
          { name: "shadow", value: 2 },
          { name: "alignment", value: 2 },
          { name: "marginL", value: 5 },
          { name: "marginR", value: 5 },
          { name: "marginV", value: 5 },
          { name: "encoding", value: 1 },
        ]
      }
    },
    {
      operation: "CREATE",
      data: {
        section: "styles",
        fields: [
          { name: "name", value: "A_Newly_Created_Style" },
          { name: "fontsize", value: 11 },
          { name: "primaryColour", value: "&HFFFF00FF" },
          { name: "bold", value: true },
        ]
      }
    },
  ]
}
