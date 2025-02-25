## Routing

Routing refers to how an application’s endpoints (URIs) respond to client requests. For an introduction to routing, see Basic routing.

You define routing using methods of the Express app object that correspond to HTTP methods; for example, app.get() to handle GET requests and app.post to handle POST requests. For a full list, see app.METHOD. You can also use app.all() to handle all HTTP methods and app.use() to specify middleware as the callback function (See Using middleware for details).

These routing methods specify a callback function (sometimes called “handler functions”) called when the application receives a request to the specified route (endpoint) and HTTP method. In other words, the application “listens” for requests that match the specified route(s) and method(s), and when it detects a match, it calls the specified callback function.

In fact, the routing methods can have more than one callback function as arguments. With multiple callback functions, it is important to provide next as an argument to the callback function and then call next() within the body of the function to hand off control to the next callback.

## Middleware

Middleware in Express.js

Middleware in Express.js refers to functions that have access to the request (req), response (res), and the next function in the application's request-response cycle. They are used to modify request and response objects, execute code, end the request-response cycle, or call the next middleware in the stack.

Key Points for an Interview Answer:
Middleware functions can be built-in, third-party, or custom.
They are executed in the order they are defined.
Common use cases include logging, authentication, error handling, and parsing request bodies.
Middleware is applied using app.use() or as route-specific functions.

// These are just lingos made by developers to make req n res working

- user of middleware
- why we need middleware?

## diffence between JSON and Javascript

- JSON is a data format used for transferring data, with a strict syntax that ensures consistency across platforms.
- JavaScript is a programming language used to build applications, capable of handling complex operations, including data manipulation, UI interaction, and more.
