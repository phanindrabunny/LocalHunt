/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from './page';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(),
}));

jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}));

describe('LoginPage', () => {
  const mockPush = jest.fn();
  const mockToast = jest.fn();
  let mockQuery: URLSearchParams;

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
    });
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
    mockQuery = new URLSearchParams();
    (useSearchParams as jest.Mock).mockReturnValue(mockQuery);
    
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('renders login form by default', () => {
    render(<LoginPage />);
    expect(screen.getByRole('heading', { name: /Sign In/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
  });

  it('switches to register form when register tab is clicked', () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByRole('tab', { name: /Register/i }));
    expect(screen.getByRole('heading', { name: /Create an Account/i })).toBeInTheDocument();
  });

  it('handles successful login', async () => {
    (signIn as jest.Mock).mockResolvedValue({ error: null });
    render(<LoginPage />);
    
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('credentials', {
        redirect: false,
        email: 'test@example.com',
        password: 'password123',
      });
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Login Successful!',
        description: 'Welcome back!',
      });
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('handles failed login', async () => {
    (signIn as jest.Mock).mockResolvedValue({ error: 'Invalid credentials' });
    render(<LoginPage />);
    
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'wrong@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Login Failed',
        description: 'Invalid email or password.',
        variant: 'destructive',
      });
    });
  });

  it('handles successful registration', async () => {
    mockQuery.set('register', 'true');
    global.fetch = jest.fn()
      .mockImplementationOnce(() => Promise.resolve({ 
        ok: true,
        json: () => Promise.resolve({ message: 'User created successfully' })
      }))
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ userId: 'newUser123' })
      }));

    (signIn as jest.Mock).mockResolvedValue({ error: null });

    render(<LoginPage />);

    const emailInput = screen.getAllByLabelText(/Email/i).find(el => el.closest('form')?.textContent?.includes('Create Account'));
    const passwordInput = screen.getAllByLabelText(/Password/i).find(el => el.closest('form')?.textContent?.includes('Create Account'));
    const createButton = screen.getByRole('button', { name: /Create Account/i });

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();

    fireEvent.change(emailInput!, { target: { value: 'new@example.com' } });
    fireEvent.change(passwordInput!, { target: { value: 'newpassword123' } });
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'new',
          email: 'new@example.com',
          password: 'newpassword123',
          role: 'user',
        }),
      });
      expect(signIn).toHaveBeenCalledWith('credentials', {
        redirect: false,
        email: 'new@example.com',
        password: 'newpassword123',
      });
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Registration Successful!',
        description: 'Your account has been created.',
      });
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  afterAll(() => {
    (global.fetch as jest.Mock).mockRestore();
  });
});
