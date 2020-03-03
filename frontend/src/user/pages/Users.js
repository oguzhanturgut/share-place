import React, { Fragment, useEffect, useState } from 'react';

import UsersList from '../components/UsersList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

const Users = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadedUsers, setLoadedUsers] = useState();

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:5000/api/users');
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        setLoadedUsers(data.users);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);
  return (
    <Fragment>
      <ErrorModal error={error} onClear={() => setError(null)} />
      {isLoading && (
        <div className='center'>
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedUsers && <UsersList items={loadedUsers} />};
    </Fragment>
  );
};

export default Users;
