// src/pages/UsersPage.tsx

import AdminLayout from '../layouts/AdminLayout';
import UserList from '../components/users/UserList';
import './UsersPage.css';

export default function UsersPage() {
  return (
    <AdminLayout>
      <div className="users-page">
        <UserList />
      </div>
    </AdminLayout>
  );
}