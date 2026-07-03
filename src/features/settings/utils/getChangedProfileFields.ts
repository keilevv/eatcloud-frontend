import { UpdateProfileData } from '../types/settings.types';

interface ProfileFormValues {
  name: string;
  email: string;
  password: string;
}

interface CurrentProfile {
  name: string;
  email: string;
}

export const getChangedProfileFields = (
  current: CurrentProfile,
  form: ProfileFormValues,
): UpdateProfileData => {
  const changes: UpdateProfileData = {};

  if (form.name !== current.name) {
    changes.name = form.name;
  }

  if (form.email !== current.email) {
    changes.email = form.email;
  }

  if (form.password.trim()) {
    changes.password = form.password;
  }

  return changes;
};
