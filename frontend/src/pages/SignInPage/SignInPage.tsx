import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, Link } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useAuthStore } from '../../stores/authStore';
import { signInSchema, type SignInFormData } from '../../utils/validationSchemas';
import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input';
import Layout from '../../components/layout/Layout';
import { ROUTES } from '../../routes/routes';
import './SignInPage.css';

const SignInPage = (): React.ReactElement => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { signIn, isLoading } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignInFormData>({
    resolver: yupResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormData) => {
    const result = await signIn(data);
    
    if (result.success) {
      enqueueSnackbar('Login successful! Welcome back', { 
        variant: 'success',
        autoHideDuration: 3000 
      });
      reset();
      navigate(ROUTES.DASHBOARD);
    } else {
      enqueueSnackbar(result.error || 'Login failed. Please try again.', { 
        variant: 'error',
        autoHideDuration: 5000 
      });
    }
  };

  return (
    <Layout showFooter={false}>
      <div className="signin-page">
        <div className="signin-container">
          <div className="signin-card">
            <div className="signin-header">
              <h1 className="signin-title">Welcome Back</h1>
              <p className="signin-subtitle">Sign in to your AsvaLab account</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="signin-form">
              <Input
                label="Email"
                type="email"
                placeholder="Enter your email"
                {...register('email')}
                error={errors.email?.message}
                required
              />

              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                {...register('password')}
                error={errors.password?.message}
                required
              />

              <Button
                type="submit"
                loading={isLoading}
                disabled={isLoading}
                size="large"
                className="signin-submit-btn"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="signin-footer">
              <p className="signin-footer-text">
                Don't have an account?{' '}
                <Link to={ROUTES.REGISTER} className="signin-footer-link">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SignInPage; 
