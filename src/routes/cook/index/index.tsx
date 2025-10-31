import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/cook/index/')({
  beforeLoad: () => {
    throw redirect({
      to: '/cook/ingredientsType',
    });
  },
});
