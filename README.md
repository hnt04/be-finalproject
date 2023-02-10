## Back-end
### Features
- Only HR can create new user
## Database - Model
### User
***Authentication***
```javascript
employeeId: { 
            type: String, 
            required: true,
            unique: true, 
        },
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
        avatarUrl: {
            type: String,
            required: false,
            default: "",
        },
        department: {
            type: String,
            enum: [
            "GM",
            "HR",
            "Internal Communication",
            "Sales",
            "Finance",
            "IT",
            "Admin",
            "Marketing",
            "Legal",
            ],
            required: true,
        },
        role: {
            type: String,
            enum: [
            "General Manager",
            "Manager",
            "Supervisor",
            "Senior Officer",
            "Officer",
            "Junior Officer",
            "Intern",
            ],
            required: true,
        },
        phone: {
            type: Number,
            required: false,
            default: "",
        },
        tasks: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Task" }],
        commentCount: { 
            type: Number, 
            default:0 },
        postCount: { 
            type: Number, 
            default:0 },
        isDeleted: {
            type: Boolean,
            default:false,
            select: false
        },
```

### Task
```javascript
  {
    task_name: {
      type: String,
      required: true,
    },
    handler: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
      },
    ],
    assigner: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "WORKING", "REVIEW", "DONE", "ARCHIVE"],
      required: true,
      default: "PENDING",
    },
    reviewAt: {
      type: Date,
      require: true,
      default: Date,
    },
    deadlineAt: {
      type: Date,
      require: true,
    },
    taskCount: { 
      type: Number, 
      default:0 },
    isDeleted: {
      type: Boolean,
      default:false,
      select: false
  }
       
### Post

```javascript
{
        content: {
        type: String,
        require: true,
        },
        image: {
        type: String,
        require: "",
        },
        author: { 
            type: mongoose.SchemaTypes.ObjectId, 
            required: true,
            ref: "User" 
        },
        isDeleted: {
            type: Boolean,
            default:false,
            select: false
        },
        commentCount: { type: Number, default:0 },
        reaction: { like: { type: Number, default:0 }},
  }
  
```

### Comment
```javascript
{
        content: {
        type: String,
        require: true,
        },
        image: {
        type: String,
        require: true,
        },
        author: { 
            type: mongoose.SchemaTypes.ObjectId, require: true, ref: "User" 
        },
        post: {
            type: mongoose.SchemaTypes.ObjectId, require: true, ref: "Post"
        },
        reaction: { like: 0 },
  }
```
### Commendation
```javascript
{
    name: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
      },
    ],
    month: {
        type: String,
            enum: [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
            ],
            required: true,
      },
  },
```

## API EndPoints
### UserAPI
```javascript

// CREATE
/**
 * @route POST /users
 * @description Create new user
 * @access login required, private, HR
 */


// GET ALL USERS
/**
 * @route GET /users
 * @description Get a list of users
 * @access login required
 */


// GET MY USER
/**
 * @route GET /users/me
 * @description Get my user
 * @access login required
 */


// GET SINGLE USER
/**
 * @route GET /users/:id
 * @description Get a user profile
 * @access login required
 */

// UPDATE
/**
 * @route PUT /users
 * @description update a user
 * @access login required
 */


// GET ALL POST OF USER
/**
 * @route GET /users/:userId/posts
 * @description Get a list of posts
 * @access Login require
 */


// GET ALL TASK OF USER
/**
 * @route GET /users/:userId/tasks
 * @description Get a list of posts
 * @access Login require
 */

```

### TaskAPI
```javascript
// CREATE
/**
 * @route POST /tasks
 * @description create a task
 * @access login required
 */

// GET ALL TASKS
/**
 * @route GET /tasks
 * @description Get a list of tasks
 * @access login required
 */


// GET SINGLE TASK
/**
 * @route GET /tasks/:id
 * @description Get task by id
 * @access login required
 */


// UPDATE
/**
 * @route PUT /tasks
 * @description update a task
 * @access login required
 */


// DELETE
/**
 * @route DELETE /tasks
 * @description delete a task
 * @access login required
 */

```

### PostAPI
```javascript

// CREATE
/**
 * @route POST /posts
 * @description Create a new post
 * @access Login require
 */


// GET SINGLE POST
/**
 * @route GET /posts/:id
 * @description Get post by id
 * @access Login require
 */


// UPDATE
/**
 * @route PUT /posts/:id
 * @description update a post
 * @access Login require
 */

// DELETE
/**
 * @route DELETE /posts
 * @description delete a post
 * @access Login require
 */


// GET ALL COMMENTS IN POST
/**
 * @route GET /posts/:id/comments
 * @description Get a list of comments in post
 * @access Login require
 */
```

### CommentAPI:
```javascript
// CREATE
/**
 * @route POST /comments
 * @description Create new comment
 * @body {content,postId}
 * @access Login required
 */

// GET SINGLE POST
/**
 * @route GET /comments/:id
 * @description Get comment by id
 * @access public
 */

// UPDATE
/**
 * @route PUT /comments/:id
 * @description update a comment
 * @access public
 */

// DELETE 
/**
 * @route DELETE /comments
 * @description delete a comment
 * @access public
 */
```

### CommendationAPI
```javascript
// CREATE COMMENDATION OF MONTH
/**
 * @route POST /commendations
 * @description Create a list of commendation
 * @access login required
 */

// GET COMMENDATION OF MONTH
/**
 * @route GET /commendations
 * @description Get a list of commendation
 * @access login required
 */
```
