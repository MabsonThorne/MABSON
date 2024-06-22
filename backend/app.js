const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const translationRoutes = require('./routes/translationRoutes');
const cors = require('./middleware/cors');
const errorHandler = require('./middleware/errorHandler');
const auth = require('./middleware/auth');
require('dotenv').config();

app.use(express.json());
app.use(cors);

app.use('/api', userRoutes);
app.use('/api', productRoutes);
app.use('/api', orderRoutes);
app.use('/api', translationRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://106.52.158.123:${PORT}`);
});
