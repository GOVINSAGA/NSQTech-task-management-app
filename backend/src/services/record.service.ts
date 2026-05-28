import { Record, IRecord } from '../models/Record';

export class RecordService {
  static async getRecordsForUser(
    userRole: string
  ): Promise<IRecord[]> {
    const filter =
      userRole === 'admin' ? {} : { accessLevel: 'general' };

    return Record.find(filter)
      .populate('assignedTo', 'firstName lastName email')
      .sort({ createdAt: -1 });
  }

  static async getRecordById(recordId: string): Promise<IRecord | null> {
    return Record.findById(recordId).populate(
      'assignedTo',
      'firstName lastName email'
    );
  }

  static async getRecordStats(): Promise<{
    total: number;
    byStatus: Record<string, number>;
    byPriority: Record<string, number>;
  }> {
    const [total, statusAgg, priorityAgg] = await Promise.all([
      Record.countDocuments(),
      Record.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Record.aggregate([
        { $group: { _id: '$priority', count: { $sum: 1 } } },
      ]),
    ]);

    const byStatus: Record<string, number> = {};
    statusAgg.forEach((s: any) => (byStatus[s._id] = s.count));

    const byPriority: Record<string, number> = {};
    priorityAgg.forEach((p: any) => (byPriority[p._id] = p.count));

    return { total, byStatus, byPriority };
  }
}
