import { useEffect, useState } from "react";
import { StyledDescriptionEditor } from "../Tiptap";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { format } from "date-fns";
import { Select } from "../Select";
import { taskStatus } from "../../constant/taskType";
import { IoClose } from "react-icons/io5";

const options = [
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

export function Preview({
  preview,
  handleClick,
}: {
  preview: string;
  handleClick: () => void;
}) {
  return (
    preview &&
    typeof preview === "string" && (
      <div className="relative rounded-xl border cursor-pointer">
        <img
          src={preview}
          alt="Preview"
          className="aspect-square object-cover rounded-xl"
        />
        <div
          className="absolute bg-[#FAFAFA] rounded-full text-black p-1 border -top-2 -right-2"
          onClick={handleClick}
        >
          <IoClose size={20} />
        </div>
      </div>
    )
  );
}

export function ModifyTask({
  editTask,
  setEditTask,
}: {
  editTask: any;
  setEditTask: (data: any) => void;
}) {
  console.log(editTask);

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);
  useEffect(() => {
    const newPreview = editTask.attachment.map((file: File) =>
      URL.createObjectURL(file)
    );
    setPreview(newPreview);
  }, [editTask]);
  const getValue = (value: string) => {
    setEditTask({
      ...editTask,
      status: {
        id: value === "todo" ? 1 : value === "inprogress" ? 2 : 3,
        name: value,
        title: value,
        tasks: [],
      },
    });
  };

  const handleDrop = (event: any) => {
    event.preventDefault();
    event.stopPropagation();

    // Get the dropped files
    const files: File[] = Array.from(event.dataTransfer.files);

    setUploadedFiles((prev) => [...prev, ...files]);
    const newPreview = files.map((file) => URL.createObjectURL(file));
    setPreview((prev) => [...prev, ...newPreview]);
    setEditTask({
      ...editTask,
      attachment: [...editTask.attachment, ...files],
    });
  };

  const handleDragOver = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    // Check if files are selected
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setUploadedFiles((prev) => [...prev, ...fileArray]);

      // Create file previews
      const newPreview = fileArray.map((file) => URL.createObjectURL(file));
      setPreview((prev) => [...prev, ...newPreview]);

      // Update taskData with new files
      setEditTask({
        ...editTask,
        attachment: [...editTask.attachment, ...fileArray],
      });
    }
  };

  return (
    <form className="space-y-6 rounded-lg">
      {/* Task Title */}
      <div>
        <input
          type="text"
          id="task-title"
          name="task-title"
          placeholder="Task title"
          className="w-full border rounded-md p-2 bg-[#f1f1f1] outline-none focus:outline-none"
          value={editTask.title}
          onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
        />
      </div>

      {/* Description */}
      <div>
        <StyledDescriptionEditor
          taskData={editTask}
          setTaskData={setEditTask}
        />
      </div>

      <div className="flex gap-4">
        {/* Task Category */}
        <div className="flex flex-1 flex-col gap-4">
          <label className="block text-sm font-medium text-gray-700">
            Task Category*
          </label>
          <div className="flex gap-4">
            <button
              type="button"
              className={`w-20 h-[40px] font-semibold text-sm border  rounded-full ${
                editTask.category && editTask.category.name === "work"
                  ? "bg-[var(--color-primary)] text-white"
                  : ""
              }`}
              onClick={() =>
                setEditTask({
                  ...editTask,
                  category: {
                    id: "1",
                    name: "work",
                    title: "Work",
                  },
                })
              }
            >
              Work
            </button>
            <button
              type="button"
              className={`w-20 h-[40px] font-semibold text-sm border rounded-full ${
                editTask.category && editTask.category.name === "personal"
                  ? "bg-[var(--color-primary)] text-white"
                  : ""
              }`}
              onClick={() =>
                setEditTask({
                  ...editTask,
                  category: {
                    id: "2",
                    name: "personal",
                    title: "Personal",
                  },
                })
              }
            >
              Personal
            </button>
          </div>
        </div>

        {/* Due On */}
        <div className="flex flex-1 flex-col gap-4">
          <label
            htmlFor="due-on"
            className="block text-sm font-medium text-gray-700"
          >
            Due On*
          </label>
          <div className="w-44">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Due Date"
                value={
                  editTask.dueOn ? dayjs(editTask.dueOn, "DD MMM, YYYY") : null
                }
                onChange={(date: Dayjs | null) =>
                  setEditTask({
                    ...editTask,
                    dueOn: format(date?.toDate() ?? new Date(), "dd MMM, yyyy"),
                  })
                }
              />
            </LocalizationProvider>
          </div>
        </div>

        {/* Task Status */}
        <div className="flex flex-1 flex-col gap-4">
          <label
            htmlFor="task-status"
            className="block text-sm font-medium text-gray-700"
          >
            Task Status*
          </label>
          <div className="w-44">
            <Select
              label="category"
              items={options}
              onChange={getValue}
              val={
                typeof editTask.status === "object" ? editTask.status.name : ""
              }
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Attachment
        </label>
        <div
          className="flex items-center p-4 mt-1 border-2 border-dashed rounded-md border-gray-300 justify-center"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <p className="text-gray-500">Drop your files here or </p>
          <button
            type="button"
            className="ml-1 text-blue-500 underline"
            onClick={() => document.getElementById("file-input")?.click()}
          >
            <input
              type="file"
              id="file-input"
              className="hidden"
              onChange={handleFileInputChange}
              multiple
              accept=".jpg, .jpeg, .png"
            />
            Update
          </button>
        </div>

        {/* Display previews */}
        {preview.length > 0 && (
          <div className="mt-4 select-none">
            <div className="grid grid-cols-3 grid-rows-auto gap-4 rounded-lg">
              {preview.map((preview, index) => (
                <div key={preview}>
                  {" "}
                  {/* Use preview URL or unique value as the key */}
                  <Preview
                    preview={preview}
                    handleClick={() => {
                      setPreview((prev) => prev.filter((_, i) => i !== index));
                      setEditTask({
                        ...editTask,
                        attachment: editTask.attachment.filter(
                          (_: any, i: number) => i !== index
                        ),
                      });
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
