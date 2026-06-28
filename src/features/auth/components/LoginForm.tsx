'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm as useRHForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { useLogin } from '../hooks/useLogin';
import { loginSchema, LoginFormData } from '../schemas/login.schema';

export const LoginForm = () => {
  const { login, isLoading, error } = useLogin();

  const form = useRHForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    await login(data);
  };

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader className="space-y-1 text-center">
        <div className="mb-4 flex justify-center">
          {/* Logo Placeholder */}
          <div className="bg-primary text-primary-foreground flex h-12 w-12 items-center justify-center rounded-md text-xl font-bold">
            EC
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Password</FormLabel>
                    {/* Forgot password placeholder */}
                    <a
                      href="#"
                      className="text-primary text-sm hover:underline"
                      tabIndex={-1}
                    >
                      Forgot password?
                    </a>
                  </div>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && (
              <div className="text-destructive bg-destructive/10 rounded-md p-3 text-sm">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="border-background h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
