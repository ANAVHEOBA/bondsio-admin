import { useParams } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import UserProfile from '../components/users/UserProfile';
import './UserProfilePage.css';

export default function UserProfilePage() {
  const { userId } = useParams<{ userId: string }>();

  if (!userId) {
    return (
      <AdminLayout>
        <div className="user-profile-page">
          <div className="user-profile-error">User ID not provided</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="user-profile-page">
        <UserProfile />
      </div>
    </AdminLayout>
  );
}