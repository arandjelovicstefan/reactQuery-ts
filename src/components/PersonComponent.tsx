import { useQuery, UseQueryResult } from 'react-query';
import { IPerson } from '../interfaces/IPerson';
import { fetchPerson } from '../pages/person/PersonPage';

const PersonComponent = () => {
  const { data }: UseQueryResult<IPerson, Error> = useQuery<IPerson, Error>('person', fetchPerson);
  return (
    <div>
      <p>{data?.id}</p>
      <p>{data?.name}</p>
      <p>{data?.age}</p>
    </div>
  );
};

export default PersonComponent;
