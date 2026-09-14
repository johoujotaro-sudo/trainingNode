import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import getMoodRouter from './routes/getmood.js';
import getMusicRouter from './routes/getmusic.js';


//const express = require("express");
const app = express();

const port = 3000;

app.use(express.json());
app.use('/getmood', getMoodRouter);
app.use('/getmusic', getMusicRouter);

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello from Express!' });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
  next();
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});