import { useSession } from "next-auth/react";
import React, { useContext, useState } from "react";
import { TodoListContext } from "~/context/todoListContext";
import { api } from "~/utils/api";

export const CreateTodo = () => {
  const [todoItem, setTodoItem] = useState({
    id: "",
    title: "",
    description: "",
  });
  const { data: sessionData } = useSession();
  const { selectedTodoList } = useContext(TodoListContext);

  const { data: todos, refetch: refetchTodos } = api.todo.getAll.useQuery(
    { todoListId: selectedTodoList?.id ?? "" },
    {
      enabled: sessionData?.user !== undefined,
    }
  );

  // To Create a Todo Sub-Task
  const createTodo = api.todo.createOrUpdate.useMutation({
    onSuccess: async () => {
      await refetchTodos();
    },
  });

  const handleResets = () => {
    setTodoItem({ id: "", title: "", description: "" });
  };

  return (
    <div className="card border border-gray-800 bg-[#060f114a] shadow-xl ">
      <div className="card-body">
        <h4 className="card-title">
          <input
            type="text"
            name="title"
            placeholder="Create sub-tasks for your Todo List e.g. Make copies of assignment"
            className="placeholder:text-md input-group-lg input-primary input w-full bg-transparent font-bold placeholder:font-medium placeholder:text-slate-700"
            value={todoItem.title}
            onChange={(e) =>
              setTodoItem({ ...todoItem, title: e.currentTarget.value })
            }
          />
        </h4>
        <textarea
          className="!focus:border-transparent !focus:outline-transparent rounded-lg bg-transparent p-3 placeholder:text-sm placeholder:text-slate-500"
          value={todoItem.description}
          name="description"
          placeholder="write a short descritpion for your sub task..."
          rows={2}
        ></textarea>
      </div>
      <div className="card-actions justify-end">
        <button
          className="btn-primary btn mb-5 mr-8 w-40 capitalize"
          onClick={() => {
            createTodo.mutate({
              id: todoItem.id,
              title: todoItem.title,
              description: todoItem.description,
              todoListId: selectedTodoList?.id ?? "",
            });
            handleResets();
          }}
          disabled={
            todoItem.title.trim().length === 0 &&
            todoItem.description.trim.length === 0
          }
        >
          Add Sub-Todo
        </button>
      </div>
    </div>
  );
};

export default CreateTodo;
