import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/cook/index/')({
  component: IngredientsComponent,
});

function IngredientsComponent() {
  return (
    <div className="p-2">
      <h3>Ingredients</h3>
    </div>
  );
}
