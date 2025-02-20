const express = require('express');
const app = express();
// app.use ==> Match all the HTTP methods api call to /

app.use("/test", (req, res) => {
    console.log('Hello from /hello');
    res.send('Running Test'); // Send response
});
// app.use("/", (req, res) => {
//     res.send('Response from 3000'); // Send response
// });

//----------------------------Handle Get Call seperately------------------------------------
// get call ==> handle only get call to /user

app.get("/user", (req, res) => {
    res.send({ firstname: "John", lastname: "Doe" }); // Send response
});
// post call ==> handle only post call to /user
app.post("/user", (req, res) => {
    res.send("Saved data to DB");
});
//Delete call ==> handle only delete call to /user

app.delete("/user", (req, res) => {
    res.send("Deleted data from DB");
});

//----------------------------Handle Post Call seperately------------------------------------

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
