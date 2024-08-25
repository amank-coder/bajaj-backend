const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');
const app = express();
app.use(express.json());

// Enable CORS
app.use(cors());

// MongoDB Connection
const mongoURI = 'mongodb+srv://dhanesh:5VM6gnQYekvCFCC3@cluster0.ujsiz.mongodb.net/';
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err.message);
});

const sampleUser = {
    full_name: "john_doe",
    dob: "17091999",
    email: "john@xyz.com",
    roll_number: "ABCD123"
};

// Save the sample user to the database (for demo purposes)
User.findOne({ email: sampleUser.email }).then((user) => {
    if (!user) {
        const newUser = new User(sampleUser);
        newUser.save();
    }
});

// GET endpoint to return operation_code
app.get('/bfhl', (req, res) => {
    res.status(200).json({
        operation_code: 1
    });
});

// POST endpoint to process the data
app.post('/bfhl', async (req, res) => {
    const { data } = req.body;
    if (!data || !Array.isArray(data)) {
        return res.status(400).json({
            is_success: false,
            error: "Invalid input"
        });
    }

    // Fetch user details from the database
    const user = await User.findOne({ email: sampleUser.email });
    if (!user) {
        return res.status(404).json({
            is_success: false,
            error: "User not found"
        });
    }

    let numbers = [];
    let alphabets = [];
    let highestLowercase = "";

    data.forEach(item => {
        if (!isNaN(item)) {
            numbers.push(item);
        } else if (typeof item === 'string') {
            alphabets.push(item);
            if (item >= 'a' && item <= 'z' && item > highestLowercase) {
                highestLowercase = item;
            }
        }
    });

    res.status(200).json({
        is_success: true,
        user_id: `${user.full_name}_${user.dob}`,
        email: user.email,
        roll_number: user.roll_number,
        numbers: numbers,
        alphabets: alphabets,
        highest_lowercase_alphabet: highestLowercase ? [highestLowercase] : []
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
