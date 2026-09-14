import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({
    message: '音楽一覧'
  });
});

export default router;