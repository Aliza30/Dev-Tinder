const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://NodeLearn:NodeLearn@namastenodebyaliza.7nlll.mongodb.net/Namaste_Node_test?retryWrites=true&w=majority&appName=NamasteNodeByAliza"
    );
};

module.exports = connectDB;
