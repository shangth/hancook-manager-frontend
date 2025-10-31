import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/cook/dishesType/')({
  component: DishesTypeComponent,
});

function DishesTypeComponent() {
  return (
    <div className="p-2">
      <h3>Dishes Type</h3>
    </div>
  );
}
