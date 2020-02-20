import React from 'react';
import './UsersList.css';
import UserItem from './UserItem';

const UsersList = props => {
  return props.items.length === 0 ? (
    <div className='center'>
      <h2>No users found</h2>
    </div>
  ) : (
    <ul className='users-list'>
      {props.items.map(user => {
        return (
          <UserItem
            key={user.id}
            id={user.id}
            image={user.image}
            name={user.name}
            placeCount={user.places}
          />
        );
      })}
    </ul>
  );
};

export default UsersList;
