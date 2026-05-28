import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { roleGuard } from '../middleware/roleGuard';
import { delayMiddleware } from '../middleware/delay';
import { RecordService } from '../services/record.service';

const router = Router();

router.get(
  '/',
  authenticate,
  delayMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const records = await RecordService.getRecordsForUser(req.user!.role);
      const stats = await RecordService.getRecordStats();

      res.json({
        records,
        stats,
        meta: {
          total: records.length,
          userRole: req.user!.role,
          accessNote:
            req.user!.role === 'admin'
              ? 'Showing all records (admin access)'
              : 'Showing general-access records only',
        },
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
);

router.post(
  '/',
  authenticate,
  roleGuard('admin'),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const record = await RecordService.createRecord(req.body);
      res.status(201).json({ record, message: 'Record created successfully' });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
);

router.get(
  '/stats',
  authenticate,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const stats = await RecordService.getRecordStats();
      res.json({ stats });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
);

export default router;
