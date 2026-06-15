import { getTodoItems } from "@/lib/data";
import { createTodo, deleteTodo } from "@/app/admin/actions";
import SubmitButton from "@/components/SubmitButton";

export default async function AdminTodoPage() {
  const items = await getTodoItems();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">To-do vazifalari</h1>
        <p className="text-muted text-sm">
          Foydalanuvchilar uchun bajariladigan vazifalar ro&apos;yxati.
        </p>
      </div>

      <form
        action={createTodo}
        className="bg-card border rounded-2xl p-5 space-y-3"
      >
        <h2 className="font-semibold">➕ Yangi vazifa</h2>
        <input
          name="title"
          required
          placeholder="Vazifa nomi *"
          className="w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:border-brand"
        />
        <input
          name="description"
          placeholder="Izoh (ixtiyoriy)"
          className="w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:border-brand"
        />
        <input
          name="position"
          type="number"
          placeholder="Tartib"
          className="w-28 rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:border-brand"
        />
        <div>
          <SubmitButton>Qo&apos;shish</SubmitButton>
        </div>
      </form>

      <div className="space-y-2">
        {items.map((i) => (
          <div
            key={i.id}
            className="bg-card border rounded-2xl p-4 flex items-center justify-between gap-3"
          >
            <div className="min-w-0">
              <div className="font-medium truncate">{i.title}</div>
              {i.description && (
                <div className="text-xs text-muted truncate">
                  {i.description}
                </div>
              )}
            </div>
            <form action={deleteTodo}>
              <input type="hidden" name="id" value={i.id} />
              <SubmitButton variant="danger" size="sm" confirm="O'chirilsinmi?">
                ✕
              </SubmitButton>
            </form>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-muted text-sm text-center py-4">
            Hali vazifa yo&apos;q.
          </p>
        )}
      </div>
    </div>
  );
}
