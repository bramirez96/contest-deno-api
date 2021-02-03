# Routes

This server application has been built with multiple applications in mind. All applications will share the same `/auth` and `/user` routes to improve auth across our various apps.

## Auth: `/api/auth`

> None of the auth endpoints require token authentication.

### Auth Endpoints

| Endpoint      | Method | Description                           | Request Body | Query Params     | Return         |
| ------------- | ------ | ------------------------------------- | ------------ | ---------------- | -------------- |
| `/register`   | POST   | Register a new user for the site      | `SignupBody` | none             | `{ message }`  |
| `/login`      | POST   | Log an existing user in               | `LoginBody`  | none             | `AuthResponse` |
| `/activation` | GET    | Activate a user's account from email  | none         | `token`, `email` | Redirect       |
| `/reset`      | GET    | Send a password reset email to a user | none         | `email`          | `{ message }`  |
| `/reset`      | POST   | Reset a user's password with a code   | `ResetBody`  | none             | none           |

### Auth Request Data Types

| Type           | Values                                                                 |
| -------------- | ---------------------------------------------------------------------- |
| `SignupBody`   | `{ codename, email, parentEmail, password, age, firstname, lastname }` |
| `LoginBody`    | `{ email, password }`                                                  |
| `AuthResponse` | `{ token, user }`                                                      |
| `ResetBody`    | `{ email, password, code }`                                            |

## Users: `/api/users`

Many of the user endpoints will require admin-level privileges. All will require authentication.

### User Endpoints

| Endpoint           | Method | Description                                 | Request Body        | Query Params        | Return       |
| ------------------ | ------ | ------------------------------------------- | ------------------- | ------------------- | ------------ |
| `/`                | GET    | Get a list of users (ordered and paginated) | none                | `PaginationParams`  | `IUser[]`    |
| `/`                | POST   | Add a new user to the database              | `INewUser`          | none                | `IUser`      |
| `/:id`             | GET    | Get a user with the specified `id`          | none                | none                | `IUser`      |
| `/:id`             | PUT    | Update a user with the specified `id`       | `Partial<INewUser>` | none                | none         |
| `/:id`             | DELETE | Delete a user with the specified `id`       | none                | none                | none         |
| `/:id/submissions` | GET    | Get a user's most recent subs               | none                | `limit?`, `offset?` | `ISubItem[]` |

### User Request Data Types

| Type               | Values                                                    |
| ------------------ | --------------------------------------------------------- |
| `PaginationParams` | `limit`, `offset`, `orderBy`, `order`,`first`             |
| `INewUser`         | `{ codename, email, parentEmail, password, age, roleId }` |

## Pagination Param Details

Paginated endpoints exist to reduce resource strain on the database. All of the values are optional and have a default when omitted. `limit` limits the amount of rows returned from the table, and `offset` skips a certain number of rows in a query. Used together, this allows you to query the database a section at a time. By paginating your databse requests, you speed up server requests and DB queries.

| Field     | Type                                         | Default     |
| --------- | -------------------------------------------- | ----------- |
| `limit`   | `number`                                     | `10`        |
| `offset`  | `number`                                     | `0`         |
| `orderBy` | `string` (MUST be names of a database field) | `'id'`      |
| `order`   | 'ASC' or 'DESC'                              | `'ASC'`     |
| `first`   | 'true' or `undefined`                        | `undefined` |
