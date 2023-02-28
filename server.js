const express = require('express');
const cors = require('cors');
const guestTokenRouter = require('./index');

const PORT = 3001;
const app = express();
app.use(cors());

app.use('/guest-token', guestTokenRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})