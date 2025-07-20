import * as yup from 'yup';

export const signInSchema = yup.object({
  email: yup
    .string()
    .matches(
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Email must include @ and domain extension (e.g., user@gmail.com)'
    )
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});

export const signUpSchema = yup.object({
  email: yup
    .string()
    .matches(
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Email must include @ and domain extension (e.g., user@gmail.com)'
    )
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(128, 'Password must be less than 128 characters')
    .matches(/(?=.*[a-z])/, 'Password must contain at least one lowercase letter')
    .matches(/(?=.*[A-Z])/, 'Password must contain at least one uppercase letter')
    .matches(/(?=.*\d)/, 'Password must contain at least one number')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
  role: yup
    .string()
    .oneOf(['user', 'admin'], 'Invalid role')
    .default('user'),
});

export type SignInFormData = yup.InferType<typeof signInSchema>;
export type SignUpFormData = yup.InferType<typeof signUpSchema>; 
