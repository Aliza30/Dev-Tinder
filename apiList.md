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

### Status~api:

    - interest
    - ignore

POST/request/send/{interest}/:UserID
POST/request/send/{ignore}/:UserID

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
