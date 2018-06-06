# General

### Pagination
All the "List" calls use a cursor-based pagination like this one:
https://stripe.com/docs/api/curl#pagination

### OrderBy parameters
`orderby` parameters accept a comma-separated list of sort keys. Each key sorts ascending by default, but may be reversed with the `desc` modifier, separated from the key with a space. Example usage for listing users:
`GET /users?orderBy=branchCount desc,name`
This will put users with more branches first, and then users with the same number of branches sorted by name.

### Parameters / Input
Parameters are appended to the query string with a `?`:
`OPERATION /path?key1=value1&key2=value2`
Inputs are passed in the body as an object:
`OPERATION /path`, Body: `{ key1: value1, key2: value2 }`

### Nested data

Collaborator, Change, Commit, and Branch are all nested inside each other. So when getting or listing them it makes sense to be able to specify their parents in the path. For example:


`GET /change/:change_id`
can also be: `GET /commit/:commit_id/change/:change_id`
or: `GET /branch/:branch_id/commit/:commit_id/change/:change_id`
or: `GET /tree/:tree_id/branch/:branch_id/commit/:commit_id/change/:change_id`


# User
```
{
  Username: string,
  Password: string,
  Roles: enum{ADMIN, MODERATOR}[],
  Branches: Branch[],
  Creation: Date,
  LastOnline: Date,
  banned: boolean,
  active: boolean
}
```

### List users
`GET /users`

##### Parameters:
Name|Type|Notes
--- | --- | ---
active | boolean | default: true
banned | boolean | default: true
orderby | string | valid keys: name, creation, branchCount, lastOnline


### Get one user
#### By id:
`GET /user/:user_id`
#### By name:
`GET /user`
##### Parameters:
Name|Type|Notes
--- | --- | ---
name | string

### Update
`PATCH /user/:user_id`

##### Input:
Name|Type|Notes
--- | --- | ---
roles | string[]
lastOnline | Date
banned | boolean
active | boolean

### Create
`POST /users`


##### Input:
Name|Type|Notes
--- | --- | ---
username | string | **required**
password | string | **required**
active | boolean | default: false
roles | string[]

### Delete
`DELETE /user/:user_id`


# Video Data
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

### List videos
`GET /videos`

##### Parameters:
Name|Type|Notes
--- | --- | ---
orderby | string | valid keys: name, creation, subtitleTreeCount, duration

### Get one video
##### By id:
`GET /video/:video_id`
##### By name:
`GET /video`
##### Parameters:
Name|Type|Notes
--- | --- | ---
name | string

### Update
`PATCH /video/video_id`

##### Input:
Name|Type|Notes
--- | --- | ---
name | string
url | string


### Create
`POST /videos`

##### Input:
Name|Type|Notes
--- | --- | ---
name | string | **required**
url | string

### Delete
`DELETE /video/video_id`

# SubtitleTree
```
{
  Creation: Date,
  Description: string,
  Language: string,
  Subtitle: Subtitle,
  Branches: Branch[]
}
```
### Get one Subtitle Tree
`GET /tree/:tree_id`

### List Subtitle Trees
`GET /trees`

##### Parameters:
Name|Type|Notes
--- | --- | ---
language | string
orderby | string | valid keys: creation, branchCount

### Create
`POST /trees`

##### Input:
Name|Type|Notes
--- | --- | ---
language | string | **required**
description | string

Will create a branch with an empty parentless commit inside as shown bellow, as to ensure a parentless commit is not accidentally created in any other way:
```
{
    collaborators: [],
    status: "APPROVED",
    commits: [{
        creation: { ...DateObj... },
        description: "",
        parent: null,
        comments: [],
        changes: []
    }]
}
```

### Delete
`DELETE /tree/:tree_id`

# Subtitle
```
{
  Lines:SubtitleLine[]
}
```
### Get one Subtitle
`GET /subtitle/:subtitle_id`

Deleting a tree also deletes all the branches inside, and by extension all the commits, comments, changes, and collaborators.

### Create
`POST /subtitles`

##### Input:
Name|Type|Notes
--- | --- | ---
lines | Object[] | Example: `[{startTime: 0:00:05, endTime: 0:00:06, text: "Hi..."}, {startTime: 0:00:06, endTime: 0:00:07, text: "This is an example", positionY: 0.5}]`

### Delete
`DELETE /subtitle/:subtitle_id`

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

No queries for Subtitle Line.

# Branch
```
{
  Collaborators: Collaborator[],
  Status: enum{UNMODIFIED, IN_PROGRESS, FINISHED, APPROVED, MERGED},
  Deleted: boolean,
  Commits: Commit[]
}
```

### List branches
`GET /branches`
(and nested paths)

##### Parameters:
Name|Type|Notes
--- | --- | ---
orderby | string | valid keys: status, deleted, collaboratorCount, commitCount


### Get one branch
`GET /branch/:branch_id`
(and nested paths)

### Update
`PATCH /branch/:branch_id`
(and nested paths)

##### Input:
Name|Type|Notes
--- | --- | ---
status | string
deleted | boolean

### Create
`POST /trees/:tree_id/branches/`

`status` is `UNMODIFIED` by default. Assigning `MERGED` status is only through the merge query.

### Merge branches
`POST trees/:tree_id/branches/:branch_id/merge/:target_branch_id`

Target branch must be approved otherwise 400 Bad Request.

# Commit
```
{
  Creation: Date,
  Description: string,
  Parent: Commit,
  IsMergeCommit: boolean,
  Comments: Comment[],
  Changes: Change[]
}
```

### List Commits
`GET /commits`
(and nested paths)

##### Parameters:
Name|Type|Notes
--- | --- | ---
orderby | string | valid keys: creation, isMergeCommit, commentCount, changeCount

### Get one commit
`GET /commit/:commit_id`
(and nested paths)



### Update
`PATCH /commit/:commit_id`
(and nested paths)

##### Input:
Name|Type|Notes
--- | --- | ---
description | string


### Create
`POST /branch/:branch_id/commit`
(and nested paths)

##### Input:
Name|Type|Notes
--- | --- | ---
description | string |
partent | string | **required**

# Change
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

### List changes

`GET /changes`
(and nested paths)

##### Parameters:
Name|Type|Notes
--- | --- | ---
orderby | string | valid keys: status, deleted, collaboratorCount, commitCount


### Get one change
`GET /change/:change_id`
(and nested paths)

### Create
`POST /commit/:commit_id/change`
(and nested paths)

##### Input:
Name|Type|Notes
--- | --- | ---
subtitleLineIds | string[] | **required**
user | string | **required**
type | string | **required**
data | Object | **required**


# Collaborator
```
{
  User: User,
  Creator: boolean
  Admin: boolean
  Banned: boolean
}
```
### Add a user as a collaborator
`PUT /branches/:branch_id/collaborators/:user_id`
(and nested paths)

##### Parameters:
Name|Type|Notes
--- | --- | ---
admin | boolean | default: false

Also adds the branch in the user's branch field.


### Update
`PATCH /collaborators/:collaborator_id`
(and nested paths)

##### Parameters:
Name|Type|Notes
--- | --- | ---
admin | boolean
banned | boolean

### Delete
`DELETE /branches/:branch_id/collaborators/:collaborator_id`
(and nested paths)

Also deletes the reference in the branch.

# Comment
```
{
  Type: enum{COMMIT, CHANGE}
  Created: Date
  Author: User
  Content: string
}
```

### List comments

`GET /comments`
(and nested paths)

##### Parameters:
Name|Type|Notes
--- | --- | ---
orderby | string | valid keys: created, author, type


### Get one comment
`GET /comment/:comment_id`
(and nested paths)

### Create

##### On a change
`POST /change/:change_id/comment`
(and nested paths)
##### On a commit
`POST /commit/:commit_id/comment`
(and nested paths)

##### Input:
Name|Type|Notes
--- | --- | ---
author | string | **required**
content | string | **required**
