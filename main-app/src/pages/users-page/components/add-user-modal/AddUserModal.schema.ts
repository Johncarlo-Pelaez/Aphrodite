import { object, string, SchemaOf } from 'yup';
import { CreateUserParams } from 'apis/user';
export { addUserFormSchema };

const addUserFormSchema: SchemaOf<CreateUserParams> = object().shape({
  email: string().email().required('Email is required.'),
});
