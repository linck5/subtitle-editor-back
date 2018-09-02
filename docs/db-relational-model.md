
```mermaid
graph TB

nwinst>new instance created] --> cv

cv[Create a video] --> cs[Create a subtitle for the video]
cs --> ct[Create a tree for the subtitle and the video]
ct --> artt[Add a reference to the tree in the video]

artt --> efrstt>User edits a subtitle]

efrstt --> cb[Create a node]
cb --> sbcfb[Set the base commits for the node]
sbcfb --> arttu[Put a reference to the node in the user]
arttu --> acttb[Add a collaborator to the node referencing the user]
acttb --> sinpro[Set node field `status` to IN_PROGRESS]
sinpro --> cc[Create a new commit for the node]
cc --> cch["Create a change referencing the commit, the user, and the line(s)"]


cch --> ummc>User makes more changes]

ummc --> cch["Create a change referencing the<br/> commit, the user, and the line(s)"]

cch --> ucmtc>User commits the changes]

ucmtc --> sdtt[Set commit field `done` to true]

sdtt --> ustmnch>User starts making new changes]
sdtt --> urapp>User requests approval]



ustmnch --> cc

urapp --> sinfin[Set node field `status` to APPROVED]


sinfin --> modapp>Mod approves the node]
sinfin --> moddontapp>Mod does not approve the node]

moddontapp --> sbinpro[Set node field `status` back to IN_PROGRESS]

sbinpro --> userfix>User makes more changes/fixes]
userfix --> cc



modapp --> mlempty{<center>is node based<br/> on root node?</center>}
mlempty --> isbolam{<center>is node<br/> based on last<br/> approved/merged node?</center>}

isbolam -->|no| fnca[Find nearest common ancestor]

fnca --> mergchn[Determine merging changes]

mergchn --> cfl{conflicts?}

cfl -->|yes| mdiff[Make diff screen]
cfl -->|no| mrg

mdiff--> resolve>User resolves conflicts]

resolve --> mrg[Create a node with status `MERGED`<br/> and a commit with the merged changes]

isbolam-->|yes| pushtoml
mlempty -->|yes| pushtoml

pushtoml[Push all commits of the node to the mainline]

pushtoml --> sbfinish[Set node field `status` to FINISHED]





```

```mermaid
graph TB

Video -->|"[ ]"| Tree

Node -->|"{[ ]}"| Collaborator
Node -->|"base commmits[ ]"| Commit
Node -.->|"source"| Node
Node --> Tree

Commit -->|"-i "| Node

Change -->|"-i"| Commit
Change --> User
Change -->|"{[ ]}"| Line

User -.->|"[ ]"| Node

Collaborator --> User

Subtitle -->|"{[ ]}"| Line

Comment --> Or((or))
Comment --> User

Or -.-> Commit
Or -.-> Change

Tree --> Video
Tree --> Subtitle
Tree -->|"mainline [ ]"| Commit

```

- **-i** = index
- **[ ]** array
-  **{[ ]}** embeded array
-  *dotted line* : optional reference



```
Video {
  SubtitleTrees: Tree[]
}
```
```
Tree {
  Video: Video
  Subtitle: Subtitle,
  Mainline: Commit[]
}
```
```
Node {
  Collaborators: {Collaborator[]}
  BaseCommits: Commit[]

}
```
```
Commit {
  Node: Node, -index
}
```
```
Change {
  Commit: Commit -index
  SubtitleLineIds: {ObjectId[]}
  User: User,
}
```
```
Subtitle {
  Lines:{SubtitleLine[]}
}
```
```
Line {
customId
...
}
```
```
User {
  Nodes: Node[]
}
```
```
Collaborator {
  User: User
}
```
```
Comment {
  Author: User
  Commit: Commit
  Change: Change
}
```
