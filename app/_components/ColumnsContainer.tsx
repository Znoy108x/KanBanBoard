"use client"
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { PlusCircleIcon, Trash2Icon } from "lucide-react";
import { Column, Id, Task } from "@/Types";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import TaskBar from "./TaskBar";

interface Props {
    column: Column;
    deleteColumn: (id: Id) => void;
    updateColumn: (id: Id, title: string) => void;
    createTask: (columnId: Id) => void;
    updateTask: (id: Id, content: string) => void;
    deleteTask: (id: Id) => void;
    tasks: Task[];
}

function ColumnContainer({
    column,
    deleteColumn,
    updateColumn,
    createTask,
    tasks,
    deleteTask,
    updateTask,
}: Props) {
    const [editMode, setEditMode] = useState(false);
    const tasksIds = useMemo(() => {
        return tasks.map((task) => task.id);
    }, [tasks]);
    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: column.id,
        data: {
            type: "Column",
            column,
        },
        disabled: editMode,
    });
    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };
    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className=" bg-columnBackgroundColor opacity-40 border-2 border-pink-500 w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col "
            ></div>
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className=" bg-columnBackgroundColor w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col">
            <div
                {...attributes}
                {...listeners}
                onClick={() => {
                    setEditMode(true);
                }}
                className=" bg-[#E11D48] text-md h-[60px] cursor-grab rounded-md rounded-b-none p-3 font-bold border-columnBackgroundColor border-4 flex items-center justify-between ">
                <div className="flex gap-2">
                    <div
                        className=" flex justify-center items-center bg-columnBackgroundColor px-2 py-1 text-sm rounded-full ">
                        {tasks.length}
                    </div>
                    {!editMode && column.title}
                    {editMode && (
                        <input
                            className="bg-black focus:border-rose-500 border rounded outline-none px-2"
                            value={column.title}
                            onChange={(e) => updateColumn(column.id, e.target.value)}
                            autoFocus
                            onBlur={() => {
                                setEditMode(false);
                            }}
                            onKeyDown={(e) => {
                                if (e.key !== "Enter") return;
                                setEditMode(false);
                            }}
                        />
                    )}
                </div>
                <button
                    onClick={() => {
                        deleteColumn(column.id);
                    }}
                    className=" stroke-gray-500 hover:stroke-white hover:bg-columnBackgroundColor rounded px-1 py-2 "
                >
                    <Trash2Icon />
                </button>
            </div>
            <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
                <SortableContext items={tasksIds}>
                    {tasks.map((task) => (
                        <TaskBar
                            key={task.id}
                            task={task}
                            deleteTask={deleteTask}
                            updateTask={updateTask}
                        />
                    ))}
                </SortableContext>
            </div>
            <button
                className="flex gap-2 items-center border-columnBackgroundColor border-2 rounded-md p-4 border-x-columnBackgroundColor hover:bg-mainBackgroundColor hover:text-rose-500 active:bg-black"
                onClick={() => {
                    createTask(column.id);
                }}
            >
                <PlusCircleIcon />
                Add task
            </button>
        </div>
    );
}

export default ColumnContainer;