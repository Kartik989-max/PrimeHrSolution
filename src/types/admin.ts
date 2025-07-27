export interface AdminData {
  username: string;
  email?: string;
  role: 'admin';
  lastLogin?: Date;
  permissions?: string[];
}

export interface AdminUser {
  id: string;
  username: string;
  email?: string;
  role: 'admin';
  lastLogin?: Date;
  permissions?: string[];
} 