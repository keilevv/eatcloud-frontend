'use client';

import { zodResolver } from '@hookform/resolvers/zod';
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

import { useUpdateProfile } from '../hooks/useUpdateProfile';
import { updateProfileSchema, UpdateProfileFormData } from '../schemas/updateProfile.schema';

export const UpdateProfileForm = () => {
  const { updateProfile, isLoading, error, success } = useUpdateProfile();

  const form = useRHForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: UpdateProfileFormData) => {
    await updateProfile(data);
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
        <CardTitle className="text-2xl font-bold">Actualizar Perfil</CardTitle>
        <CardDescription>
          Actualiza la información de tu cuenta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Tu nombre" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo electrónico</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="nombre@ejemplo.com" {...field} />
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
                  <FormLabel>Nueva contraseña (opcional)</FormLabel>
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

            {success && (
              <div className="text-green-600 bg-green-50 rounded-md p-3 text-sm">
                Perfil actualizado exitosamente
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="border-background h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
                  Actualizando...
                </div>
              ) : (
                'Actualizar Perfil'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
