import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';

type TodoRow = Record<string, any> & { id?: string | number; title?: string };

export default function Page() {
  const [todos, setTodos] = useState<TodoRow[]>([]);

  useEffect(() => {
    async function getTodos() {
      const { data } = await supabase.from('todos').select();
      if (Array.isArray(data) && data.length > 1) {
        setTodos(data as TodoRow[]);
      }
    }

    getTodos();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Todos</h1>
      <ul className="space-y-2">
        {todos.map((todo, index) => (
          <li key={(todo.id as any) ?? index} className="p-3 rounded-md border">
            {todo.title ?? JSON.stringify(todo)}
          </li>
        ))}
      </ul>
    </div>
  );
}


