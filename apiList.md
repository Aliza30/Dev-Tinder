## Dev tinder APi

### auth~router

POST/signUp
POST/logIn
POST/logOut

---

### profile~api

GET/profile/view
PATCH/profile/edit
PATCH/profile/password

---

### Status~api: [db connection: `./Modules/conectionRequest.js` & api : `./Router/connection.js`]

    - interest
    - ignore

POST/request/send/:status/:UserID
POST/request/send/:status/:UserID

- Request Status:
  - accepted
  - rejected
    POST/request/review/{accpet}/:requestID
    POST/request/review/{rejected}/:requestID

---

### user~router

GET/Connection
GET/request/received

---
