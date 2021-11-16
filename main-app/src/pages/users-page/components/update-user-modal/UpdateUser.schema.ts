import * as yup from 'yup';
import { Role } from 'models';
import { UpdateUserApi } from 'apis';

export const updateUserSchema = yup.object().shape({
  email: yup.string().email().required('Email is required.'),
  objectId: yup.string().required('Object ID is required.'),
  role: yup
    .mixed<Role>()
    .oneOf(Object.values(Role))
    .required('Role is required.'),
  firstname: yup.string().required('Firstname must be filled'),
  lastname: yup.string().required('Lastname must be filled'),
});

export const initialFormState: UpdateUserApi = {
  email: '',
  role: Role.ENCODER,
  objectId: '',
  firstname: '',
  lastname: '',
};
