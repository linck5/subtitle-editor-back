
```mermaid
graph TB

nwinst>new instance created] --> cv

cv[Create a video] --> cs[Create a subtitle for the video]
cs --> ct[Create a tree for the subtitle and the video]
ct --> artt[Add a reference to the tree in the video]

artt --> efrstt>User edits a subtitle]

efrstt --> cb[Create a branch]
cb --> sbcfb[Set the base commits for the branch]
sbcfb --> arttu[Put a reference to the branch in the user]
arttu --> acttb[Add a collaborator to the branch referencing the user]
acttb --> sinpro[Set branch field `status` to IN_PROGRESS]
sinpro --> cc[Create a new commit for the branch]
cc --> cch["Create a change referencing the commit, the user, and the line(s)"]


cch --> ummc>User makes more changes]

ummc --> cch["Create a change referencing the<br/> commit, the user, and the line(s)"]

cch --> ucmtc>User commits the changes]

ucmtc --> sdtt[Set commit field `done` to true]

sdtt --> ustmnch>User starts making new changes]
sdtt --> urapp>User requests approval]



ustmnch --> cc

urapp --> sinfin[Set branch field `status` to FINISHED]


sinfin --> modapp>Mod approves the branch]
sinfin --> moddontapp>Mod does not approve the branch]

moddontapp --> sbinpro[Set branch field `status` back to IN_PROGRESS]

sbinpro --> userfix>User makes more changes/fixes]
userfix --> cc



modapp --> mlempty{<center>is tree<br/> `mainline`<br/> empty?</center>}
mlempty --> isbolam{<center>is branch<br/> based on last<br/> approved branch?</center>}

isbolam -->|no| fnca[Find nearest common ancestor]

fnca --> mergchn[Determine merging changes]

mergchn --> cfl{conflicts?}

cfl -->|yes| mdiff[Make diff screen]
cfl -->|no| mrg

mdiff--> resolve>User resolves conflicts]

resolve --> mrg[Create a branch with status `MERGED`<br/> and a commit with the merged changes]

isbolam-->|yes| pushtoml
mlempty -->|yes| pushtoml

pushtoml[Push all commits of the branch to the mainline]

pushtoml --> sbfinish[Set branch field `status` to FINISHED]





```

```mermaid
graph TB

Comment --> Or((or))
Comment --> User

Or -.-> Commit
Or -.-> Change

Video -->|"[ ]"| Tree

Tree --> Video
Tree --> Subtitle
Tree -->|"mainline [ ]"| Commit

Branch -->|"{[ ]}"| Collaborator
Branch -->|"base commmits[ ]"| Commit
Branch -.->|"source"| Branch

Commit -->|"-i "| Branch

Change -->|"-i"| Commit
Change --> User
Change -->|"{[ ]}"| Line

User -.->|"[ ]"| Branch

Collaborator --> User

Subtitle -->|"{[ ]}"| Line


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
Branch {
  Collaborators: {Collaborator[]}
  BaseCommits: Commit[]

}
```
```
Commit {
  Branch: Branch, -index
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
  Branches: Branch[]
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
