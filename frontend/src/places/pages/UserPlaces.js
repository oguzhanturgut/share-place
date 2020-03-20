import React, {Fragment, useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';

import PlaceList from '../components/PlaceList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

import {useHttpClient} from '../../shared/hooks/http-hook';

const UserPlaces = () => {
  const [loadedPlaces, setLoadedPlaces] = useState();
  const [isLoading, error, sendRequest, clearError] = useHttpClient();

  const {userId} = useParams();

  useEffect(() => {
    (async () => {
      try {
        const data = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`);
        setLoadedPlaces(data.places);
      } catch (error) {
      }
    })();
  }, [sendRequest, userId]);
  const onDeletePlace = deletedPlaceId => {
    setLoadedPlaces(prevPlaces => prevPlaces.filter(place => place.id !== deletedPlaceId));
  };

  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError}/>
      {isLoading && (
        <div className='center'>
          <LoadingSpinner/>
        </div>
      )}
      {!isLoading && loadedPlaces && (
        <PlaceList items={loadedPlaces} onDeletePlace={onDeletePlace}/>
      )}
    </Fragment>
  );
};

export default UserPlaces;
