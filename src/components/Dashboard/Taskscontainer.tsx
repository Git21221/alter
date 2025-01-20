import { useDispatch, useSelector } from "react-redux";
import { ReactSVG } from "react-svg";
import { RootState } from "../../feature/store/store";
import {
  setBoardView,
  setListView,
} from "../../feature/slices/ListBoardView.slice";
import { TbLogout2 } from "react-icons/tb";
import { Select } from "../Select";
import {
  taskCategory,
  TaskStatus,
  taskStatus,
  taskType,
} from "../../constant/taskType";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Search } from "../Search";
import { Button } from "../Button";
import {
  addTask,
  CheckedTask,
  deleteTask,
  filterTasks,
  removeCheckedTask,
  setCheckedTask,
  setFiltering,
  setNomalTask,
  sortTasksByDateAsc,
  sortTasksByDateDesc,
  Task,
  updateTaskStatus,
} from "../../feature/slices/Task.slice";
import { openModal, setEditTask } from "../../feature/slices/addTask.slice";
import { ImCheckboxChecked, ImCheckboxUnchecked } from "react-icons/im";
import { useState } from "react";
import {
  RiCheckboxCircleFill,
  RiDeleteBin6Line,
  RiDraggable,
  RiExpandUpDownFill,
} from "react-icons/ri";
import { TfiMoreAlt } from "react-icons/tfi";
import { HiPlus } from "react-icons/hi";
import { IoAddOutline, IoReturnDownBack } from "react-icons/io5";
import { Dropdown } from "../Dropdown";
import { MdArrowDropDown, MdArrowDropUp, MdDateRange, MdOutlineViewKanban } from "react-icons/md";
import { Dayjs } from "dayjs";
import { format } from "date-fns";
import { FaChevronDown } from "react-icons/fa";
import { PiListBold } from "react-icons/pi";
import { FiEdit3 } from "react-icons/fi";

const optionsCategory = [
  {
    value: taskCategory[0].name,
    label: taskCategory[0].title,
  },
  {
    value: taskCategory[1].name,
    label: taskCategory[1].title,
  },
];

const optionsStatus = [
  {
    value: taskStatus[0].name,
    label: taskStatus[0].title,
  },
  {
    value: taskStatus[1].name,
    label: taskStatus[1].title,
  },
  {
    value: taskStatus[2].name,
    label: taskStatus[2].title,
  },
];

const optionsMore = [
  {
    value: "edit",
    icon: <FiEdit3 />,
    label: "Edit",
  },
  {
    value: "delete",
    icon: <RiDeleteBin6Line />,
    label: "Delete",
  },
];

export function TopFirstRow() {
  return (
    <div className="headingAndProfile flex items-center justify-between">
      <p className="flex items-center ">
        <ReactSVG src="task_icon.svg" />
        <p className="text-2xl font-semibold">TaskBuddy</p>
      </p>
      <div className="profile flex items-center gap-1">
        <img
          src="fd930beee5a3918d920109c2020d3ccb.png"
          alt="profile"
          className="rounded-full object-cover aspect-auto w-9 h-9"
        />
        <p className="text-base text-[var(--profile-name-color)] font-bold">
          John Doe
        </p>
      </div>
    </div>
  );
}

export function TopSecondRow() {
  const { isList, isBoard } = useSelector(
    (state: RootState) => state.ListBoardView
  );
  const dispatch = useDispatch();
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4 text-lg">
        <div
          className={`flex items-center gap-1 cursor-pointer ${
            isList
              ? "border-b border-black text-black"
              : "border-[var(--border-color)] text-[var(--search-icon-color)]"
          }`}
          onClick={() => {
            dispatch(setListView());
          }}
        >
          <PiListBold />
          <p className="font-semibold">List</p>
        </div>
        <div
          className={`flex items-center cursor-pointer gap-1 ${
            isBoard
              ? "border-b border-black text-black"
              : "border-[var(--border-color)] text-[var(--search-icon-color)]"
          }`}
          onClick={() => {
            dispatch(setBoardView());
          }}
        >
          <MdOutlineViewKanban />
          <p className="font-semibold">Board</p>
        </div>
      </div>
      <div className="flex items-center gap-1 bg-[var(--color-faded-logout-background)] p-2 rounded-xl border border-[var(--color-faded-logout-border)] cursor-pointer">
        <TbLogout2 />
        <p className="text-sm font-semibold">Logout</p>
      </div>
    </div>
  );
}

export function TopThirdRow() {
  const dispatch = useDispatch();
  const defaultFilters = {
    category: {
      id: 0,
      name: "",
      title: "",
    },
    dueDate: null as string | null,
    searchQuery: "",
  };

  const [filters, setFilters] = useState(defaultFilters);

  // Check if any filter is active and dispatch the setFiltering state accordingly
  const checkIsFiltering = (updatedFilters: typeof filters) => {
    const isFiltering = !(
      updatedFilters.category.id === defaultFilters.category.id &&
      updatedFilters.category.name === defaultFilters.category.name &&
      updatedFilters.category.title === defaultFilters.category.title &&
      updatedFilters.dueDate === defaultFilters.dueDate &&
      updatedFilters.searchQuery.trim() === defaultFilters.searchQuery.trim()
    );

    dispatch(setFiltering(isFiltering)); // Dispatch whether filters are active
  };

  // Handle Category Filter Change
  const getValue = (value: string) => {
    const updatedCategory = {
      id: value === "work" ? 1 : 2, // Example: work => 1, else 2
      name: value,
      title: value,
    };

    const updatedFilters = { ...filters, category: updatedCategory };

    setFilters(updatedFilters);
    checkIsFiltering(updatedFilters);
    console.log("updated filter", updatedFilters);

    dispatch(filterTasks(updatedFilters)); // Dispatch filtered tasks
  };

  // Handle Due Date Filter Change
  const handleDateChange = (date: any) => {
    const updatedFilters = {
      ...filters,
      dueDate: format(date, "dd MMM, yyyy"), // Format date as "dd MMM, yyyy"
    };

    setFilters(updatedFilters);
    checkIsFiltering(updatedFilters);
    console.log(updatedFilters);
    dispatch(filterTasks(updatedFilters)); // Dispatch filtered tasks
  };

  // Handle Search Query Filter Change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    const updatedFilters = { ...filters, searchQuery: query };

    setFilters(updatedFilters);
    checkIsFiltering(updatedFilters);

    dispatch(filterTasks(updatedFilters)); // Dispatch filtered tasks
  };

  // Open Task Modal
  const handleAddTaskModal = () => {
    dispatch(openModal());
  };

  return (
    <div className="flex items-center justify-between">
      <div className="left flex items-center gap-4">
        <p>Filter by:</p>
        <div className="w-32">
          <Select
            label="category"
            items={optionsCategory} // Ensure optionsCategory is defined somewhere
            onChange={getValue} // Pass category value to getValue function
          />
        </div>
        <div className="w-32">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker label="Due Date" onChange={handleDateChange} />
          </LocalizationProvider>
        </div>
      </div>
      <div className="right flex items-center gap-4">
        <Search onChange={handleSearchChange} />
        <Button content="Add Task" onClick={handleAddTaskModal} />
      </div>
    </div>
  );
}

export function TableHeadings() {
  const dispatch = useDispatch();
  const { isAscSort, isDescSort } = useSelector(
    (state: RootState) => state.Task
  );

  const handleDateSort = () => {
    console.log(isAscSort, isDescSort);
    
    if (!isDescSort && !isAscSort) dispatch(sortTasksByDateAsc(true)); //if normal
    else if (isAscSort) dispatch(sortTasksByDateDesc(true)); //already asc
    else dispatch(setNomalTask()); //if desc
  };
  return (
    <div className="tableHeadings flex gap-3 w-full border-t p-2 text-[var(--search-icon-color)]">
      <p className="text-sm font-semibold flex-1">Task Name</p>
      <p className="text-sm font-semibold flex-1 flex items-center gap-2 cursor-default" onClick={handleDateSort}>
        Due on {isAscSort ? <MdArrowDropUp /> : isDescSort ? <MdArrowDropDown /> : <RiExpandUpDownFill />}
      </p>
      <p className="text-sm font-semibold flex-1">Task Status</p>
      <p className="text-sm font-semibold flex-1">Task Category</p>
      <p className="text-sm font-semibold flex-[0.15]"></p>
    </div>
  );
}

export function SingleTask({
  task,
  index,
  setTaskData,
  taskData,
  name,
}: {
  task: Task;
  index: number;
  setTaskData: (data: Task) => void;
  taskData: Task;
  name: string;
}) {
  const dispatch = useDispatch();
  const { checkedTask } = useSelector((state: RootState) => state.Task);
  console.log(checkedTask);
  const toggleChecked = (id: number) => {
    if (!checkedTask.includes(id as unknown as CheckedTask))
      dispatch(setCheckedTask({ checkedTask: id }));
    else dispatch(removeCheckedTask({ checkedTask: id }));
  };
  return (
    <div
      key={index}
      className="select-none py-2 px-2 flex w-full items-center text-md border-t font-medium"
    >
      <div className="flex items-center gap-1 flex-1">
        {checkedTask.includes(task.id as unknown as CheckedTask) ? (
          <ImCheckboxChecked
            color="purple"
            className="outline-none border-none cursor-pointer"
            onClick={() => toggleChecked(task.id)}
          />
        ) : (
          <ImCheckboxUnchecked
            color="rgba(35,31,32,0.5)"
            className="cursor-pointer"
            onClick={() => toggleChecked(task.id)}
          />
        )}
        <RiDraggable
          color="rgba(35,31,32,0.5)"
          fontWeight={600}
          className="cursor-grab"
        />
        <RiCheckboxCircleFill
          color={`${
            name !== taskType.COMPLETED
              ? "rgba(35,31,32,0.4)"
              : "rgba(27, 141, 23, 1)"
          }`}
          className="text-lg"
        />
        <p
          className={`flex-1 line-clamp-1 ${
            name === taskType.COMPLETED ? "line-through" : ""
          }`}
        >
          {task.title}
        </p>
      </div>
      <div className="flex items-center gap-1 flex-1">
        <p>
          {format(new Date(), "dd MMM, yyyy") === task.dueOn
            ? "Today"
            : task.dueOn}
        </p>
      </div>
      <div className="relative flex items-center gap-1 flex-1">
        <Dropdown
          className="uppercase bg-[#DDDADD] px-2 py-0.5 rounded-md cursor-default"
          label={(task.status as TaskStatus)?.name}
          onChange={(data: string) => {
            dispatch(
              updateTaskStatus({
                task: {
                  id: task.id,
                  currStatus:
                    typeof task.status === "string"
                      ? task.status
                      : task.status.name.toString(),
                  updatedStatus: {
                    id: 1,
                    name: data,
                    title: data,
                    tasks: [],
                  },
                },
              })
            );
            setTaskData({
              ...taskData,
              status: {
                id: 1,
                name: data,
                title: data,
                tasks: [],
              },
            });
          }}
          items={optionsStatus}
        />
      </div>
      <div className="flex items-center gap-1 flex-1 capitalize">
        <p>
          {typeof task.category === "string"
            ? task.category
            : task.category.name}
        </p>
      </div>
      <Dropdown
        className="mx-3 cursor-pointer"
        classForDropdown="!-left-[140px]"
        classNameListForDelete="text-red-500"
        items={optionsMore}
        label={<TfiMoreAlt />}
        onChange={(value) => {
          if (value === "edit") dispatch(setEditTask(task));
          if (value === "delete")
            dispatch(
              deleteTask({ task: { id: task.id, status: task.status } })
            );
        }}
      />
    </div>
  );
}

export function TaskCategories({
  categoryKey,
  title,
  name,
  tasks,
  taskData,
  setTaskData,
}: {
  categoryKey: number;
  title: string;
  name: string;
  tasks: Task[];
  taskData: Task;
  setTaskData: (data: Task) => void;
}) {
  const [inlineModal, setInlineModal] = useState<boolean>(false);
  const [openAccordion, setOpenAccordion] = useState<boolean>(false);
  const dispatch = useDispatch();
  const openAddTaskModalInline = () => {
    setInlineModal(true);
  };
  const [open, setOpen] = useState(false);

  const handleDropdownClick = () => {
    setOpen(true);
  };
  const handleAccordion = () => {
    setOpenAccordion((prev) => !prev);
  };
  return (
    <div className="taskCategory" key={categoryKey}>
      <h3
        onClick={handleAccordion}
        className={`categoryTitle ${
          name === taskType.TODO
            ? "bg-[var(--todo-bg-color)]"
            : name === taskType.IN_PROGRESS
            ? "bg-[var(--inprogress-bg-color)]"
            : "bg-[var(--completed-bg-color)]"
        } rounded-t-xl p-3 font-semibold text-base flex justify-between items-center`}
      >
        {title} ({tasks.length})
        <FaChevronDown
          className={`duration-500 ${openAccordion ? "-rotate-180" : ""}`}
        />
      </h3>
      {openAccordion && (
        <div
          className={`taskList bg-[#f1f1f1] rounded-b-xl transition-all duration-1000 ${
            !openAccordion ? "max-h-0" : "max-h-full"
          }`}
        >
          {/* add task section */}
          {name === taskType.TODO ? (
            <div
              className="addTask ml-10 flex items-center gap-2 p-2 cursor-pointer"
              onClick={openAddTaskModalInline}
            >
              <HiPlus className="text-[var(--color-primary)]" />{" "}
              <span className="uppercase font-bold">add task</span>
            </div>
          ) : null}
          {/* inline modal */}
          {inlineModal && (
            <div className="inlineModal flex gap-3 p-2">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Enter task name"
                  className="bg-transparent border-none outline-none p-2 border border-[var(--border-color)] rounded-md"
                  onChange={(e) => {
                    setTaskData &&
                      setTaskData({
                        ...taskData,
                        title: e.target.value || "",
                      });
                  }}
                />
                <div className="flex items-center gap-2 mt-3">
                  <Button
                    content={
                      <>
                        Add <IoReturnDownBack />
                      </>
                    }
                    onClick={() => {
                      dispatch(
                        addTask({
                          task: { ...taskData, description: "TaskBuddy" },
                        })
                      );
                      setTaskData({
                        id: Date.now(),
                        title: "",
                        description: "",
                        category: {
                          id: 1,
                          name: "work",
                          title: "Work",
                        },
                        dueOn: null,
                        status: {
                          id: 1,
                          name: "",
                          title: "",
                          tasks: [],
                        },
                        attachment: [],
                      });
                      setInlineModal(false);
                    }}
                    className="px-3 py-[6px]"
                  />
                  <Button
                    content="Cancel"
                    onClick={() => setInlineModal(false)}
                    className="px-3 py-[6px] bg-transparent text-black"
                  />
                </div>
              </div>
              <div className="flex-1 relative">
                {/* Dropdown Button */}
                <Dropdown
                  onClick={handleDropdownClick}
                  label={
                    taskData.dueOn ? (
                      taskData.dueOn
                    ) : (
                      <div className="flex gap-2 items-center">
                        <MdDateRange className="text-xl text-[rgba(0,0,0,0.6)]" />{" "}
                        <span className="font-semibold text-[rgba(0,0,0,0.6)]">
                          Add Date
                        </span>
                      </div>
                    )
                  }
                  onChange={() => {}}
                  className="px-2 py-2 flex items-center"
                />

                {/* Date Picker */}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Due Date"
                    open={open}
                    onOpen={() => setOpen(true)}
                    onClose={() => setOpen(false)}
                    onChange={(date: Dayjs | null) =>
                      setTaskData({
                        ...taskData,
                        dueOn: format(
                          date?.toDate() ?? new Date(),
                          "dd MMM, yyyy"
                        ),
                      })
                    }
                    slotProps={{
                      textField: {
                        sx: {
                          zIndex: -1,
                          position: "absolute",
                          top: "-10px",
                        },
                      },
                    }}
                  />
                </LocalizationProvider>
              </div>
              <div className="flex-1">
                <Dropdown
                  label={<IoAddOutline />}
                  items={optionsStatus}
                  onChange={(data: string) =>
                    setTaskData({
                      ...taskData,
                      status: {
                        id: 1,
                        name: data,
                        title: data,
                        tasks: [],
                      },
                    })
                  }
                  className={"px-2 py-2"}
                />
              </div>
              <div className="flex-1">
                <Dropdown
                  label={<IoAddOutline />}
                  items={optionsCategory}
                  onChange={(data: string) =>
                    setTaskData({
                      ...taskData,
                      category: {
                        id: 1,
                        name: data,
                        title: data,
                      },
                    })
                  }
                />
              </div>
              <div className="flex-[0.15]"></div>
            </div>
          )}
          {/* list of all tasks */}
          {tasks.length > 0 ? (
            tasks.map((task, index) => (
              <SingleTask
                task={task}
                index={index}
                setTaskData={setTaskData}
                taskData={taskData}
                name={name}
              />
            ))
          ) : (
            <p className="text-gray-400 text-center flex h-60 items-center justify-center">
              No Tasks in {title}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export function BoardViewCategories({
  key,
  tasks,
  name,
  title,
}: {
  key: number;
  tasks: Task[];
  name: string;
  title: string;
}) {
  const dispatch = useDispatch();
  return (
    <div
      key={key}
      className="flex flex-col w-80 bg-[#f1f1f1] border rounded-xl p-4 h-[710px]"
    >
      {/* Column Header */}
      <div className="mb-4">
        <span
          className={`px-3 py-1 text-sm font-semibold rounded-md ${
            name === "todo"
              ? "bg-[rgba(250,195,255,1)] text-pink-800"
              : name === "inprogress"
              ? "bg-[rgba(133,217,241,1)] text-blue-800"
              : "bg-[rgba(162,214,160,1)] text-green-800"
          }`}
        >
          {title.toUpperCase()}
        </span>
      </div>

      <div className="flex flex-col gap-2 h-full overflow-y-auto">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div
              key={task.id}
              className="bg-white border border-gray-200 rounded-lg py-[10px] px-[14px] flex flex-col justify-between h-28"
            >
              {/* Task Title and Actions */}
              <div className="flex justify-between items-center">
                <h3
                  className={`text-lg font-semibold line-clamp-2 overflow-hidden ${
                    name === taskType.COMPLETED ? "line-through" : ""
                  }`}
                >
                  {task.title}
                </h3>
                <Dropdown
                  className="cursor-pointer"
                  classForDropdown="!-left-[140px]"
                  classNameListForDelete="text-red-500"
                  items={optionsMore}
                  label={<TfiMoreAlt />}
                  onChange={(value) => {
                    if (value === "edit") dispatch(setEditTask(task));
                    if (value === "delete")
                      dispatch(
                        deleteTask({
                          task: { id: task.id, status: task.status },
                        })
                      );
                  }}
                />
              </div>

              {/* Task Metadata */}
              <div className="flex justify-between items-center text-sm text-gray-500 mt-4">
                <p className="font-medium">
                  {typeof task.category === "string"
                    ? task.category
                    : task.category.name}
                </p>
                <p>
                  {format(new Date(), "dd MMM, yyyy") === task.dueOn
                    ? "Today"
                    : task.dueOn}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center flex h-full items-center justify-center">
            No Tasks in {title}
          </p>
        )}
      </div>
    </div>
  );
}

export function TasksContainer({
  taskData,
  setTaskData,
}: {
  taskData: any;
  setTaskData: (data: any) => void;
}) {
  const {
    tasks,
    ascSort,
    descSort,
    isAscSort,
    isDescSort,
    filteredTasks,
    isFiltering,
  } = useSelector((state: RootState) => state.Task);
  console.log("Filtered task", filteredTasks);
  const { isList, isBoard } = useSelector(
    (state: RootState) => state.ListBoardView
  );

  return (
    <div className="flex flex-col gap-3">
      <TopFirstRow />
      <TopSecondRow />
      <TopThirdRow />
      {isList && <TableHeadings />}
      {isList &&
        !isFiltering &&
        !isAscSort &&
        !isDescSort &&
        tasks.map((data, index) => (
          <TaskCategories
            taskData={taskData}
            setTaskData={setTaskData}
            key={index}
            categoryKey={index}
            title={data.title}
            name={data.name}
            tasks={data.tasks}
          />
        ))}
      {isList &&
        isAscSort &&
        ascSort.map((data, index) => (
          <TaskCategories
            taskData={taskData}
            setTaskData={setTaskData}
            key={index}
            categoryKey={index}
            title={data.title}
            name={data.name}
            tasks={data.tasks}
          />
        ))}
      {isList &&
        isDescSort &&
        descSort.map((data, index) => (
          <TaskCategories
            taskData={taskData}
            setTaskData={setTaskData}
            key={index}
            categoryKey={index}
            title={data.title}
            name={data.name}
            tasks={data.tasks}
          />
        ))}
      {isList &&
        isFiltering &&
        filteredTasks.map((data, index) => (
          <TaskCategories
            taskData={taskData}
            setTaskData={setTaskData}
            key={index}
            categoryKey={index}
            title={data.title}
            name={data.name}
            tasks={data.tasks}
          />
        ))}
      <div className="flex gap-5">
        {isBoard &&
          !isFiltering &&
          tasks.map((data, index) => (
            <BoardViewCategories
              key={index}
              tasks={data.tasks}
              name={data.name}
              title={data.title}
            />
          ))}
        {isBoard &&
          isFiltering &&
          filteredTasks.map((data, index) => (
            <BoardViewCategories
              key={index}
              tasks={data.tasks}
              name={data.name}
              title={data.title}
            />
          ))}
      </div>
    </div>
  );
}
