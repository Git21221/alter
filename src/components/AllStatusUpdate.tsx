import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../feature/store/store";
import { IoClose } from "react-icons/io5";
import {
  deleteAllTaskByCheckList,
  removeAllCheckedTask,
  updateStatusOfAllTasks,
} from "../feature/slices/Task.slice";
import { Dropdown } from "./Dropdown";
import { taskStatus } from "../constant/taskType";
import { Button } from "./Button";
import { LuSave } from "react-icons/lu";
import { useState } from "react";

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

export function AllStatusUpdate() {
  const dispatch = useDispatch();
  const [status, setStatus] = useState<string>("");
  const { checkedTask } = useSelector((state: RootState) => state.Task);
  const handleUpdateSelectedTask = () => {
    console.log(status);
    if (status && checkedTask.length > 0) {
      dispatch(updateStatusOfAllTasks({ status: status }));
    }
  };
  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[450px] bg-black p-3 rounded-xl text-white flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="border-[0.2px] border-[#ffffff69] px-4 py-2 rounded-xl flex items-center gap-2">
          {checkedTask.length} Task Selected
          <IoClose
            className="cursor-pointer"
            onClick={() => dispatch(removeAllCheckedTask())}
          />
        </div>
        <LuSave className="text-xl" onClick={handleUpdateSelectedTask} />
      </div>
      <div className="controls flex items-center gap-2">
        <Dropdown
          label="Status"
          items={optionsStatus}
          onChange={(data: string) => {
            setStatus(data);
          }}
          className="!px-4 !py-1 !border-[#ffffff69] !hover:bg-transparent"
          classForDropdown="!-top-44 !-left-16 !border-none !bg-black"
          classNameList="!hover:bg-black"
        />
        <Button
          className="px-4 py-1 bg-[rgb(255,53,53,0.2)] border border-[rgba(225,56,56,1)]"
          onClick={() => {
            dispatch(deleteAllTaskByCheckList());
          }}
          content={"Delete"}
        />
      </div>
    </div>
  );
}
