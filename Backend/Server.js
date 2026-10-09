const express = require('express');
const cors = require('cors');

const registerRoute = require('./routes/register');
const loginRoute = require('./routes/login');
const resourceRoutes = require('./routes/resources');
const favoritesRoutes = require('./routes/favorites');

const app = express();
const PORT = 5000;

app.use(cors());          
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: "Backens is Running SuccessFully" });
});

app.use('/api', registerRoute);           
app.use('/api', loginRoute);               
app.use('/api/resources', resourceRoutes);
app.use('/api/favorites', favoritesRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});