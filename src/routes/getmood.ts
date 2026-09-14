import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({
    message: '雰囲気一覧'
  });
});

export default router;