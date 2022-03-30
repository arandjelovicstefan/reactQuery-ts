import axios from 'axios';
import { nanoid } from 'nanoid';
import React, { FormEventHandler, useState } from 'react';
import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from 'react-query';
import { IPerson } from '../../interfaces/IPerson';
import { fetchPerson } from './PersonPage';

const createPerson = async (person: IPerson) => {
  const response = await axios.post('http://localhost:3005/persons', person);
  return response.data;
};

const handlePersonCreate = async (person: IPerson) =>
  createPerson({ id: person.id, name: person.name, age: person.age });

const CreatePersonPage: React.FC = () => {
  const [enabled, setEnabled] = useState(false);
  const queryClient = useQueryClient();

  const { data: QueryData }: UseQueryResult<IPerson, Error> = useQuery<IPerson, Error>(
    'person',
    fetchPerson,
    {
      enabled,
    }
  );

  const mutation: UseMutationResult<IPerson, Error, IPerson> = useMutation<IPerson, Error, IPerson>(
    'createPerson',
    handlePersonCreate,
    {
      //pre mutacije
      onMutate: (variables: IPerson) => {
        return console.log('mutation variables', variables);
      },
      onSuccess: (data: IPerson, _variables: IPerson) => {
        // queryClient.invalidateQueries('person');
        // ODRADICE ISTO STO I BUTTON NA 84-TOJ LINIJI, SAMO STO CE OVDE UVEK ODRADITI ON SUCCESS
        return console.log('mutation data', data);
      },
      onError: (error: Error, _variables: IPerson) => {
        console.log('error', error.message);
        return console.log('rolling back');
      },
    }
  );

  const { data, isLoading, isError, error, isSuccess } = mutation;

  const onSubmit: FormEventHandler<HTMLFormElement> = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    const target = event.target as typeof event.target & {
      name: { value: string };
      age: { value: number };
    };
    const id = nanoid();
    const name = target.name.value;
    const age = target.age.value;
    mutation.mutate({ id, name, age });
  };

  return (
    <div>
      <hr />
      {isLoading ? (
        <p>Adding person...</p>
      ) : (
        <div>
          {isError ? <div>An error occured: {error?.message}</div> : null}
          {isSuccess ? (
            <div>
              Person added! Person name is {data?.name} and he is {data?.age} years old{' '}
            </div>
          ) : null}
        </div>
      )}
      <br />
      <button
        type='button'
        onClick={() => {
          setEnabled(!enabled);
          queryClient.invalidateQueries('person');
        }}
      >
        Invalidate Cache
      </button>
      <form onSubmit={onSubmit}>
        <label htmlFor='name'>Name</label>
        <br />
        <input type='text' id='name' name='name' />
        <br />
        <label htmlFor='age'>Age</label>
        <br />
        <input type='text' id='age' name='age' />
        <br />
        <input type='submit' value={'Submit'} />
      </form>
    </div>
  );
};

export default CreatePersonPage;
