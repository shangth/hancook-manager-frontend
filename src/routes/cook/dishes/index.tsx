import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/cook/dishes/')({
  component: DishesComponent,
});

function DishesComponent() {
  return (
    <div className="p-2">
      <h3>Dishes</h3>
    </div>
  );
}
