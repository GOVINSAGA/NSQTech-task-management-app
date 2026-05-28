import mongoose from 'mongoose';
import { config } from '../config';
import { connectDatabase } from '../config/database';
import { User } from '../models/User';
import { Record } from '../models/Record';

const seedUsers = [
  {
    email: 'admin@nsqtech.com',
    password: 'Admin@123',
    firstName: 'Priya',
    lastName: 'Sharma',
    role: 'admin',
    department: 'Engineering',
    isActive: true,
  },
  {
    email: 'user@nsqtech.com',
    password: 'User@123',
    firstName: 'Rahul',
    lastName: 'Verma',
    role: 'general',
    department: 'Operations',
    isActive: true,
  },
  {
    email: 'anita.das@nsqtech.com',
    password: 'User@123',
    firstName: 'Anita',
    lastName: 'Das',
    role: 'general',
    department: 'Marketing',
    isActive: true,
  },
  {
    email: 'vikram.singh@nsqtech.com',
    password: 'User@123',
    firstName: 'Vikram',
    lastName: 'Singh',
    role: 'general',
    department: 'Support',
    isActive: false,
  },
  {
    email: 'meera.nair@nsqtech.com',
    password: 'Admin@123',
    firstName: 'Meera',
    lastName: 'Nair',
    role: 'admin',
    department: 'DevOps',
    isActive: true,
  },
];

const recordTemplates = [
  { title: 'Server latency spike on US-East cluster', category: 'Bug Report', status: 'open', priority: 'critical', accessLevel: 'admin' },
  { title: 'User onboarding flow redesign', category: 'Feature Request', status: 'in-progress', priority: 'high', accessLevel: 'general' },
  { title: 'SSL certificate renewal for api.nsqtech.com', category: 'Maintenance', status: 'open', priority: 'high', accessLevel: 'admin' },
  { title: 'Customer unable to reset password', category: 'Support Ticket', status: 'resolved', priority: 'medium', accessLevel: 'general' },
  { title: 'Quarterly vulnerability assessment Q2', category: 'Security Audit', status: 'in-progress', priority: 'critical', accessLevel: 'admin' },
  { title: 'Add dark mode toggle to settings', category: 'Feature Request', status: 'open', priority: 'low', accessLevel: 'general' },
  { title: 'Database backup job failing on weekends', category: 'Bug Report', status: 'in-progress', priority: 'high', accessLevel: 'admin' },
  { title: 'New employee laptop provisioning', category: 'Support Ticket', status: 'open', priority: 'medium', accessLevel: 'general' },
  { title: 'API rate limiter tuning for v2 endpoints', category: 'Maintenance', status: 'closed', priority: 'medium', accessLevel: 'admin' },
  { title: 'Dashboard loading time exceeds 4 seconds', category: 'Bug Report', status: 'open', priority: 'high', accessLevel: 'general' },
  { title: 'Implement two-factor authentication', category: 'Security Audit', status: 'open', priority: 'critical', accessLevel: 'admin' },
  { title: 'Export report to CSV feature', category: 'Feature Request', status: 'resolved', priority: 'medium', accessLevel: 'general' },
  { title: 'Kubernetes node auto-scaling policy', category: 'Maintenance', status: 'in-progress', priority: 'high', accessLevel: 'admin' },
  { title: 'Email notification delivery delays', category: 'Bug Report', status: 'open', priority: 'medium', accessLevel: 'general' },
  { title: 'Penetration test — external network', category: 'Security Audit', status: 'closed', priority: 'high', accessLevel: 'admin' },
  { title: 'Mobile app push notification support', category: 'Feature Request', status: 'open', priority: 'medium', accessLevel: 'general' },
  { title: 'Log rotation config on prod servers', category: 'Maintenance', status: 'resolved', priority: 'low', accessLevel: 'admin' },
  { title: 'Billing invoice generation error', category: 'Bug Report', status: 'in-progress', priority: 'critical', accessLevel: 'general' },
  { title: 'VPN access request for remote team', category: 'Support Ticket', status: 'closed', priority: 'low', accessLevel: 'general' },
  { title: 'Compliance audit trail implementation', category: 'Security Audit', status: 'open', priority: 'high', accessLevel: 'admin' },
  { title: 'Add pagination to user management table', category: 'Feature Request', status: 'in-progress', priority: 'low', accessLevel: 'general' },
  { title: 'CDN cache invalidation on deployment', category: 'Maintenance', status: 'open', priority: 'medium', accessLevel: 'admin' },
  { title: 'SSO integration with Azure AD', category: 'Feature Request', status: 'open', priority: 'high', accessLevel: 'admin' },
  { title: 'Printer not connecting on floor 3', category: 'Support Ticket', status: 'resolved', priority: 'low', accessLevel: 'general' },
  { title: 'Memory leak in notification microservice', category: 'Bug Report', status: 'open', priority: 'critical', accessLevel: 'admin' },
];

export const seedDatabase = async (): Promise<void> => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log(`[Seed] Database already has ${userCount} users — skipping seed`);
      return;
    }

    console.log('[Seed] Seeding database with initial data...');

    const createdUsers = await User.create(seedUsers);
    console.log(`[Seed] Created ${createdUsers.length} users`);

    const recordsWithAssignment = recordTemplates.map((record, index) => ({
      ...record,
      description: `Auto-generated record for assessment demonstration. ${record.title}`,
      assignedTo: createdUsers[index % createdUsers.length]._id,
    }));

    const createdRecords = await Record.create(recordsWithAssignment);
    console.log(`[Seed] Created ${createdRecords.length} records`);

    console.log('[Seed] Database seeding complete');
    console.log('[Seed] Admin login:   admin@nsqtech.com / Admin@123');
    console.log('[Seed] General login: user@nsqtech.com  / User@123');
  } catch (error) {
    console.error('[Seed] Seeding failed:', error);
  }
};

if (require.main === module) {
  (async () => {
    await connectDatabase();
    await seedDatabase();
    await mongoose.disconnect();
    process.exit(0);
  })();
}
