export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'general';
  department: string;
  isActive: boolean;
  createdAt: string;
  lastLogin: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export interface RecordItem {
  _id: string;
  title: string;
  description: string;
  category: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  accessLevel: 'general' | 'admin';
  referenceId: string;
  assignedTo: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface RecordsResponse {
  records: RecordItem[];
  stats: {
    total: number;
    byStatus: Record<string, number>;
    byPriority: Record<string, number>;
  };
  meta: {
    total: number;
    userRole: string;
    accessNote: string;
  };
}

export interface UsersResponse {
  users: User[];
  stats: {
    total: number;
    active: number;
    admins: number;
  };
}

export interface ApiError {
  message: string;
}
