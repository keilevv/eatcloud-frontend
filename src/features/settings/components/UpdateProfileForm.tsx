'use client';

import { useEffect } from 'react';
import { useForm as useRHForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useSession } from '@/features/auth/hooks/useSession';

import { useUpdateProfile } from '../hooks/useUpdateProfile';
import { getChangedProfileFields } from '../utils/getChangedProfileFields';

interface UpdateProfileFormValues {
  name: string;
  email: string;
  password: string;
}

export const UpdateProfileForm = () => {
  const { user, isLoading: isSessionLoading } = useSession();
  const { updateProfile, isLoading, error, success, setSuccess, setError } =
    useUpdateProfile();

  const form = useRHForm<UpdateProfileFormValues>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (!user) return;

    form.reset({
      name: user.name,
      email: user.email,
      password: '',
    });
  }, [user, form]);

  const onSubmit = async (data: UpdateProfileFormValues) => {
    if (!user) return;

    const changes = getChangedProfileFields(
      { name: user.name, email: user.email },
      data,
    );

    if (Object.keys(changes).length === 0) {
      setError(null);
      setSuccess(false);
      return;
    }

    const updatedUser = await updateProfile(changes);

    if (updatedUser) {
      form.reset({
        name: updatedUser.name,
        email: updatedUser.email,
        password: '',
      });
    }
  };

  if (isSessionLoading) {
    return (
      <div className="text-muted-foreground text-sm">Cargando perfil...</div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="w-full max-w-2xl space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Perfil</h2>
        <p className="text-muted-foreground text-sm">
          Administra la información de tu cuenta.
        </p>
      </div>

      <Separator />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="max-w-md">
                <FormLabel>Nueva contraseña</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Dejar en blanco para no cambiar"
                    {...field}
                  />
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
            <div className="rounded-md bg-green-50 p-3 text-sm text-green-600">
              Perfil actualizado exitosamente
            </div>
          )}

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
