import React, { useContext } from 'react';
import { UserContext } from '../functions/GetCurrentUser';

const Profile = () => {
  const username = useContext(UserContext);

  return (
    <div>
      <p>Welcome, {username}!</p>
    </div>
  );
};

export default Profile;