import { object, string, SchemaOf } from 'yup';
import { SignInParams } from 'hooks/auth';
export { signinFormSchema };

const signinFormSchema: SchemaOf<SignInParams> = object().shape({
  email: string().email().required('Email is required.'),
});
