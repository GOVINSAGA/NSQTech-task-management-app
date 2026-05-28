import { Router, Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

const router = Router();

router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    const { token, user } = await AuthService.login(email, password);

    res.json({
      message: 'Login successful',
      token,
      user,
    });
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
});

router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, firstName, lastName, role, department } = req.body;

    if (!email || !password || !firstName || !lastName) {
      res.status(400).json({
        message: 'Email, password, firstName, and lastName are required',
      });
      return;
    }

    const user = await AuthService.register({
      email,
      password,
      firstName,
      lastName,
      role,
      department,
    });

    res.status(201).json({
      message: 'User registered successfully',
      user,
    });
  } catch (error: any) {
    const status = error.message.includes('already exists') ? 409 : 400;
    res.status(status).json({ message: error.message });
  }
});

export default router;
