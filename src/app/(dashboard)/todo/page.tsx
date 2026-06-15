import { getTodoItems } from "@/lib/data";
import TodoList from "@/components/TodoList";

export default async function TodoPage() {
  const items = await getTodoItems();

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          ✅ To-do list
        </h1>
        <p className="text-muted text-sm mt-1">
          Bajarilishi kerak bo&apos;lgan vazifalar. Belgilashlar faqat sizga
          ko&apos;rinadi.
        </p>
      </header>

      {items.length === 0 ? (
        <div className="bg-card border rounded-2xl p-8 text-center text-muted">
          Hozircha vazifalar yo&apos;q. Admin panel orqali qo&apos;shing.
        </div>
      ) : (
        <TodoList items={items} />
      )}
    </div>
  );
}
