
# User
```
{
  Username: string,
  Roles: enum{ADMIN, MODERATOR}[],
  Password: string,
  Branches: Branch[],
  Creation: Date,
  LastOnline: Date,
  banned: boolean,
  active: boolean
}
```
`branches` are all the branches the user is or was a collaborator in.

# VideoData
Subtitles must target a video, so the VideoData will contain all the information regarding the subtitles for that video
```
{
  Name: string,
  Description: string,
  Duration: number,
  Url: string,
  Creation: Date,
  SubtitleTrees: SubtitleTree[]
}
```

# SubtitleTree
A tree of changes, which are separated first by branches, then by commits, concerning a particular subtitle. Similar to a repo in git.
```
{
  Creation: Date,
  Description: string,
  Language: string,
  Subtitle: Subtitle,
  Branches: Branch[]
}
```

# Subtitle
The actual subtitle
```
{
  Lines:SubtitleLine[]
}
```

# SubtitleLine
```
{
  StartTime:number,
  EndTime:number,
  Text:string,
  PositionX:number,
  PositionY:number
}
```



# Branch
A segment of non-parallel commits.
```
{
  Collaborators: Collaborator[],
  Status: enum{UNMODIFIED, IN_PROGRESS, FINISHED, APPROVED, MERGED},
  Deleted: boolean
  Commits: Commit[]
}
```

### Statuses
Upon creation any branch starts with `UNMODIFIED` status. When the first change is made, it becomes `IN_PROGRESS`. When the user reports that the branch is done and is waiting for approval, it becomes `FINISHED`. When a moderator successfully approve a finished branch it becomes `APPROVED`. When a moderator requests changes it becomes `IN_PROGRESS` again. When merging, a new branch is created with a `MERGED` status and this is the only branch that has that status.


A typical branch for a user that just wanted to make a little correction on a subtitle:
```
{
  Collaborators: [{
    User: { ...user155... },
    creator: true,
    admin: true
    banned: false
  }],
  commits: [{
    creation: { ...DateObj... },
    description: "つぎ is more common with kanji",
    parent: { ...commit28... },
    comments: [],
    changes: [{
      subtitleLineId: 25
      user: { ...user155... },
      type: EDITED
      data: {
        text: "次は…",
      },
      comments: []
    }]
  }],
  status: FINISHED
}
```


# Commit
A collection of changes that ideally focus on solving a particular problem, described by the user
```
{
  Creation: Date,
  Commited: boolean,
  Description: string,
  Parent: Commit,
  Comments: Comment[],
  Changes: Change[]
}
```

A Commit can only have one parent.

The first Commit of a branch will have the last commit of the previous branch as its parent. The first commit of the first branch of a SubtitleTree will have no parent.

When opening a commit in the editor, the front-end will trace the parent commits all the way down to the first commit making a list, and then iterate that list up again applying all the changes.



# Change
A change to a subtitle line or a group of lines.
```
{
  SubtitleLineIds: ObjectId[]
  User: User,
  Type: enum{CREATE, EDIT, TIME_SHIFT, DELETE}
  Data: {
    StartTime: number,
    EndTime: number,
    Text: string,
    Position: enum{TOP, BOTTOM}
  },
  Comments: Comment[]
}
```
In case of a `CREATE` change, the `SubtitleLineIds` is the new id of the new subtitle line.

In case of a `TIME_SHIFT` change, the `StartTime` and `EndTime` contain a positive or negative value to add to the previous time.



# Collaborator
The information about a user in relation to a branch that they are, or have collaborated
```
{
  User: User,
  Creator: boolean
  Admin: boolean
  Banned: boolean
}
```
# Comment
A comment made by a user about a commit or a particular change
```
{
  Type: enum{COMMIT, CHANGE}
  Created: Date
  Author: User
  Content: string
}
```
The comment can be from the moderator explaining why he is not approving the branch


# Merging

Merge will always occur from a branch that is in the process of being approved, into an already approved branch.

### Terminology

- **Source**: The branch that is performing the merge.
- **Target**: The branch that the source branch is merging into. This branch needs to be the last approved branch.
- **Mainline**: The path from the last approved branch, following the parents all the way down to the first commit of the tree.
- **Nearest Common Ancestor**: The nearest ancestor that both the source and the target have in common. Due to the nature of only being able to merge into approved branch, there are no criss-cross merges, so it is impossible to have two common ancestors at the same distance.
- **Target Line**: The part of the mainline that starts from the nearest common ancestor, and ends in the last approved commit of the mainline.
- **Merging Changes**: A list of changes that will be compared for the merge. Two lists will be compared, one from the source, and another from the target line. This list of changes is comprised of only the last change of each type of data of each subtitle line. For example: within the source branch, one commit changes the text of a line, and other later commit changes the text of the same line. If that is the case, for the purpose of the merge, only the last change is put into the merging changes list.


### Steps for merging

1. Find the nearest common ancestor.
2. Find the source branch and the target line.
3. Determine the merging changes list of both the source branch, and the target line.
4. Create a new branch with one commit inside, the commit having as its parent the target branch's latest commit.
5. Create the merged changes list, as a clone of the source branch's merging changes.
6. Compare all the merging changes and determine the conflicts.
7. If there are conflicts, show the diff screen and wait for the user to resolve the conflicts. For each conflict, if the user chooses to keep the change of the target line, remove that change from the merged changes, if they choose to keep the one in the source branch, keep the merged changes as is.
8. Store the merged changes in the newly created merged commit, and approve its branch.

### Conflicts
A conflict occurs when either the source branch or the target line:
- Edit data on a subtitle line that is also edited on other side;
- Delete a subtitle line that is edited on the other side;
- Create or edit a line that have the time span overlapping any subtitle line on the other side.

### Branch Approval Rules
- When approving a branch, if there is another front branch that is also approved, they need to be merged. A moderator is not able to finalize the approval of the branch without merging. This rule results in there only being one approved front branch at any time.
- After a successful merge, a new branch with a commit inside is created as the result of that merge, the branch has the *merged* status and counts as being approved for merging purposes.
- Users can only start a new branch from the approved front branch
- Once a branch is approved, it can no longer be modified
