'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm as useRHForm } from 'react-hook-form';
import logo from '../../../assets/icn-eatcloud.png';

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
          <img
            src={logo.src}
            alt="EatCloud"
            className="h-12"
          />
        </div>
        <CardTitle className="text-2xl font-bold">Bienvenido de nuevo</CardTitle>
        <CardDescription>
          Ingresa tus credenciales para acceder a tu cuenta
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
                  <FormLabel>Correo electrónico</FormLabel>
                  <FormControl>
                    <Input placeholder="nombre@ejemplo.com" {...field} />
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
                    <FormLabel>Contraseña</FormLabel>
                    {/* Forgot password placeholder */}
                    <a
                      href="#"
                      className="text-primary text-sm hover:underline"
                      tabIndex={-1}
                    >
                      ¿Olvidaste tu contraseña?
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

            <Button type="submit" className="w-full bg-sky-500 hover:bg-sky-600" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="border-background h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
                  Iniciando sesión...
                </div>
              ) : (
                'Iniciar Sesión'
              )}
            </Button>

            <div className="text-muted-foreground mt-4 text-center text-sm">
              ¿No tienes una cuenta?{' '}
              <Link href="/register" className="text-primary hover:underline">
                Regístrate
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
