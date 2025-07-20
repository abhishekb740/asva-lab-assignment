import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { signUpSchema, type SignUpFormData } from '../../utils/validationSchemas';
import { authService } from '../../services/authService';
import { useAuthStore } from '../../stores/authStore';
import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input';
import Layout from '../../components/layout/Layout';
import { ROUTES } from '../../routes/routes';
import './RegisterPage.css';

const RegisterPage = (): React.ReactElement => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignUpFormData>({
    resolver: yupResolver(signUpSchema),
    defaultValues: {
      role: 'user'
    }
  });

  const registerMutation = useMutation({
    mutationFn: (data: SignUpFormData) => authService.signUp({
      email: data.email,
      password: data.password,
      role: data.role
    }),
    onSuccess: (response) => {
      // Auto-login after successful registration
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Update auth store
      const { initializeAuth } = useAuthStore.getState();
      initializeAuth();
      
      enqueueSnackbar(`Account created successfully! Welcome aboard ${response.user.email}`, { 
        variant: 'success',
        autoHideDuration: 4000 
      });
      
      reset();
      navigate(ROUTES.DASHBOARD);
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.error || 'Registration failed. Please try again.';
      enqueueSnackbar(errorMessage, { 
        variant: 'error',
        autoHideDuration: 6000 
      });
    },
  });

  const onSubmit = async (data: SignUpFormData) => {
    registerMutation.mutate(data);
  };

  return (
    <Layout showFooter={false}>
      <div className="register-page">
        <div className="register-container">
          <div className="register-card">
            <div className="register-header">
              <h1 className="register-title">Create Account</h1>
              <p className="register-subtitle">Join Asvalab and start managing projects</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="register-form">
              <Input
                label="Email"
                type="email"
                placeholder="Enter your email"
                {...register('email')}
                error={errors.email?.message}
                required
              />
              
              <div className="password-requirements">
                <p className="password-requirements-title">Password must contain:</p>
                <ul className="password-requirements-list">
                  <li>At least 8 characters</li>
                  <li>One uppercase letter (A-Z)</li>
                  <li>One lowercase letter (a-z)</li>
                  <li>One number (0-9)</li>
                </ul>
              </div>

              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                {...register('password')}
                error={errors.password?.message}
                required
              />
              <Input
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password"
                {...register('confirmPassword')}
                error={errors.confirmPassword?.message}
                required
              />

              <div className="role-selection">
                <label className="role-label">Account Type</label>
                <div className="role-options">
                  <label className="role-option">
                    <input
                      type="radio"
                      value="user"
                      {...register('role')}
                      className="role-radio"
                    />
                    <span className="role-option-content">
                      <strong>User</strong>
                      <small>Create and manage your own projects</small>
                    </span>
                  </label>
                  <label className="role-option">
                    <input
                      type="radio"
                      value="admin"
                      {...register('role')}
                      className="role-radio"
                    />
                    <span className="role-option-content">
                      <strong>Admin</strong>
                      <small>Manage all projects and users</small>
                    </span>
                  </label>
                </div>
                {errors.role && (
                  <span className="register-error-message">{errors.role.message}</span>
                )}
              </div>

              <Button
                type="submit"
                loading={registerMutation.isPending}
                disabled={registerMutation.isPending}
                size="large"
                className="register-submit-btn"
              >
                {registerMutation.isPending ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            <div className="register-footer">
              <p className="register-footer-text">
                Already have an account?{' '}
                <Link to={ROUTES.SIGNIN} className="register-footer-link">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RegisterPage; 
