import React, { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { type RouterOutputs, api } from "~/utils/api";
import EmptyState from "./EmptyState";

type Todo = RouterOutputs["todo"]["getAll"][0];

const TodoList: React.FC = () => {
  const { data: sessionData } = useSession();
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  const [todoItem, setTodoItem] = useState({
    id: "",
    name: "",
  });

  // Get all Todo Lists
  const { data: todos, refetch: refetchTodos } = api.todo.getAll.useQuery(
    undefined, // no input
    {
      enabled: sessionData?.user !== undefined,
    }
  );

  // To Create a TodoList
  const createTodoList = api.todo.createOrUpdate.useMutation({
    onSuccess: async () => {
      await refetchTodos();
    },
  });

  // Delete a TodoList
  const deleteTodoList = api.todo.delete.useMutation({
    onSuccess: () => {
      void refetchTodos();
    },
  });

  // Mark Todo List Completed
  const markDone = api.todo.markDone.useMutation({
    onSuccess: () => {
      void refetchTodos();
    },
  });

  // Mark Todo List NOT Completed
  const markUnDone = api.todo.markUnDone.useMutation({
    onSuccess: () => {
      void refetchTodos();
    },
  });

  // Clean up all fields
  const handleResetInputs = () => {
    setTodoItem({ name: "", id: "" });
    setTodoItem({ name: "", id: "" });
  };

  const handleCreateOrUpdate = () => {
    if (todoItem.name == "") {
      return;
    } else {
      createTodoList.mutate({
        name: todoItem.name,
        id: todoItem.id,
      });
    }
    handleResetInputs();
  };

  return (
    <div className="flex max-w-xl flex-[0.40] flex-col ">
      <div className="flex gap-3 px-2 md:gap-6">
        <input
          type="text"
          name=""
          value={todoItem.name}
          placeholder="Pick up groceries from..."
          className="input-bordered input input-md w-full bg-[#020005] placeholder:text-white/20"
          onChange={(e) => {
            setTodoItem({ ...todoItem, name: e.currentTarget.value });
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.currentTarget.value !== "")
              handleCreateOrUpdate();
          }}
        />
        <button
          className="text-md btn-primary btn font-semibold capitalize"
          onClick={handleCreateOrUpdate}
        >
          Create Todo
        </button>
      </div>
      <div className="divider"></div>
      {todos && todos?.length !== 0 ? (
        <ul className={`menu rounded-box min-h-16 w-full bg-[#15272c4a] p-2`}>
          {todos?.map((todo) => {
            return (
              <li
                key={todo.id}
                className={`${
                  selectedTodo === todo ? "bg-[#0d2434fc]" : ""
                }  flex flex-row items-center rounded-2xl pr-3 hover:bg-[#15162c4a]`}
                onClick={() => {
                  setSelectedTodo(todo);
                }}
              >
                <label className="label cursor-pointer bg-transparent hover:bg-transparent">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    className="checkbox-primary checkbox  rounded-full border-[1px]"
                    onClick={() => {
                      if (todo.completed) {
                        markUnDone.mutate({ id: todo.id });
                      } else {
                        markDone.mutate({ id: todo.id });
                      }
                    }}
                  />
                </label>

                <Link
                  href="#"
                  className={`${
                    todo.completed ? "text-slate-700 line-through" : ""
                  } -ml-4 mr-auto bg-transparent outline-none`}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedTodo(todo);
                  }}
                >
                  {todo.name}
                </Link>

                <span className="max-w-[145px] bg-transparent outline-none ">
                  <a
                    href="#edit"
                    className="btn-sm btn bg-primary capitalize text-black hover:bg-primary/60"
                    onClick={() => {
                      setTodoItem({ name: todo.name, id: todo.id });
                    }}
                  >
                    Edit
                  </a>

                  <label className="modal" id="edit">
                    <label htmlFor="" className="modal-box">
                      <input
                        type="text"
                        name=""
                        value={todoItem.name}
                        placeholder="Pick up groceries from..."
                        className="input-bordered input input-md w-full bg-[#020005] placeholder:text-white/20"
                        onChange={(e) => {
                          setTodoItem({
                            ...todoItem,
                            name: e.currentTarget.value,
                          });
                        }}
                        onKeyDown={(e) => {
                          if (
                            e.key === "Enter" &&
                            e.currentTarget.value !== ""
                          ) {
                            handleCreateOrUpdate();
                            handleResetInputs();
                          }
                        }}
                      />

                      <div className="modal-action">
                        <a
                          href="#"
                          className="text-md btn-primary btn font-semibold capitalize"
                          onClick={handleCreateOrUpdate}
                        >
                          Done
                        </a>
                        <a
                          href="#"
                          className="text-md btn-error btn font-semibold capitalize"
                          onClick={handleResetInputs}
                        >
                          Cancel
                        </a>
                      </div>
                    </label>
                  </label>
                  <a
                    href="#delete"
                    className="hover: btn-error btn-sm btn capitalize"
                  >
                    Delete
                  </a>
                  <label className="modal" id="delete">
                    <label htmlFor="" className="modal-box">
                      <p>Are you sure you want to delete the TodoList?</p>
                      <h2 className="text-xl font-semibold">
                        &ldquo;{todo.name}&ldquo;
                      </h2>
                      <div className="modal-action">
                        <a
                          href="#"
                          className="text-md btn-error btn font-semibold capitalize"
                          onClick={() => {
                            deleteTodoList.mutate({ id: todo.id });
                            handleResetInputs();
                          }}
                        >
                          Confirm Delete
                        </a>
                        <a
                          href="#"
                          className="text-md btn-primary btn font-semibold capitalize"
                          onClick={handleResetInputs}
                        >
                          Cancel
                        </a>
                      </div>
                    </label>
                  </label>
                </span>
              </li>
            );
          })}
        </ul>
      ) : (
        <EmptyState text={"You have Nothing here yet!"} />
      )}
    </div>
  );
};

export default TodoList;
