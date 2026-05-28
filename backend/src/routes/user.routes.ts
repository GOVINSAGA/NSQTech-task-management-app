import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { roleGuard } from '../middleware/roleGuard';
import { UserService } from '../services/user.service';

const router = Router();

router.get(
  '/me',
  authenticate,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const user = await UserService.getUserById(req.user!._id.toString());
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      res.json({ user });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
);

router.get(
  '/',
  authenticate,
  roleGuard('admin'),
  async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
      const users = await UserService.getAllUsers();
      const stats = await UserService.getUserCount();
      res.json({ users, stats });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
);

router.put(
  '/:id',
  authenticate,
  roleGuard('admin'),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const allowedUpdates = ['firstName', 'lastName', 'role', 'department', 'isActive'];
      const updates: any = {};

      allowedUpdates.forEach((field) => {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      });

      if (Object.keys(updates).length === 0) {
        res.status(400).json({ message: 'No valid fields to update' });
        return;
      }

      const user = await UserService.updateUser(id, updates);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      res.json({ message: 'User updated successfully', user });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
);

router.delete(
  '/:id',
  authenticate,
  roleGuard('admin'),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (req.user!._id.toString() === id) {
        res.status(400).json({ message: 'Cannot delete your own account' });
        return;
      }

      const deleted = await UserService.deleteUser(id);
      if (!deleted) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      res.json({ message: 'User deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
);

export default router;
