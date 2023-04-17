import { useParams } from 'react-router-dom';
import UserComponent from '../components/GetUserComponent';

function UserPage() {
  const { userId } = useParams();

  return (
    <div className="user-page">
      <UserComponent userId={userId} />
    </div>
  );
}

export default UserPage;
