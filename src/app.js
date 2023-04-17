import express from 'express';
import cors from 'cors';

import auth from './routes/auth.js';
import api from './routes/api.js';

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: 'https://galleriid.onrender.com',
  })
);

app.use('/auth', auth);
app.use('/api', api);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
