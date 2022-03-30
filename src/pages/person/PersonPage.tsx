// import axios from 'axios';
import axios from 'axios';
import React from 'react';
import { useQuery, UseQueryResult } from 'react-query';
import PersonComponent from '../../components/PersonComponent';
import { IPerson } from '../../interfaces/IPerson';
import CreatePersonPage from './CreatePerson';

export const fetchPerson = async (): Promise<IPerson> => {
  const response = await axios.get('http://localhost:3005/persons');
  return response.data;
};

const PersonPage: React.FC = () => {
  const { error, data, isLoading, isError }: UseQueryResult<IPerson, Error> = useQuery<
    IPerson,
    Error,
    IPerson,
    string
  >('person', fetchPerson, {
    // refetchOnWindowFocus: false,
    // select: () => ...
    // staleTime: 5 * 1000,
    keepPreviousData: true,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div> {error?.message} </div>;
  }

  return (
    <div>
      <p>{data?.id}</p>
      <p>{data?.name}</p>
      <p>{data?.age}</p>
      <h1>Person component</h1>
      <PersonComponent />
      <br />
      <CreatePersonPage />
    </div>
  );
};

export default PersonPage;
