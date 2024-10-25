import axios from "axios";
import "../App.css";
import { useState } from "react";

const Page = () => {
  let [data, setData] = useState([]);
  let [inputData, setinputData] = useState([]);
  let [dataFetched, setDataFetched] = useState(false);
  let [selectedTask, setSelectedTask] = useState(null);

  const dataFun = async () => {
    try {
      let data = await axios.get("http://127.0.0.1:8000/alltasks");
      let data_array = [...data.data];
      setData(data_array);
      setDataFetched(true);
      console.log("Data found");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleInputChange = (e) => {
    setinputData(e.target.value);
  };

  const handleSubmit = async () => {
    if (inputData.trim() === "") {
      console.warn("Input is empty, no data to submit!");
      return;
    }

    try {
      console.log("Submitting data:", inputData);
      const inp_data = await axios.post("http://127.0.0.1:8000/new_task", {
        task_name: inputData,
      });
      console.log("Data input success:", inp_data.data);

      setinputData("");

      dataFun();
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  const handleSelectChange = (e) => {
    const selectedTaskName = e.target.value;

    const task = data.find((task) => task.task_name === selectedTaskName);

    if (task) {
      setSelectedTask(task);
      console.log("Selected Task JSON:", task);
    }
  };

  const startFun = async (action) => {
    if (!selectedTask) {
      console.warn("No task selected!");
      return;
    }

    try {
      console.log(
        `Performing ${action} action for task:`,
        selectedTask.task_name
      );

      const response = await axios.patch(
        `http://localhost:8000/update_time/${action}/${selectedTask.id}`
      );
      console.log(`${action} action success:`, response.data);

      dataFun();
    } catch (error) {
      console.error(`Error performing ${action} action:`, error);
    }
  };

  return (
    <div className="mainDiv">
      <div className="inputDiv">
        <div className="submitDiv">
          <input
            value={inputData}
            onChange={handleInputChange}
            placeholder="Enter the Task Name"
          />
          <button onClick={handleSubmit}>Submit</button>
        </div>
        <div>
          <select
            onFocus={!dataFetched ? dataFun : null}
            onChange={handleSelectChange}
            defaultValue=""
          >
            <option value="" disabled>
              Select a task
            </option>
            {data.map((ele) => (
              <option key={ele.id} value={ele.task_name}>
                {ele.task_name}
              </option>
            ))}
          </select>
        </div>
      </div>
      {selectedTask && (
        <div className="tableDiv">
          <table>
            <thead>
              <tr>
                <th>Task</th>
                <th>Today</th>
                <th>Weekly</th>
                <th>Daily Work Track</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{selectedTask.task_name}</td>
                <td>{selectedTask.today_hours || "N/A"}</td>
                <td>{selectedTask.weekly_hours || "N/A"}</td>
                <td>
                  {selectedTask.daily_work_track &&
                    Object.keys(selectedTask.daily_work_track).length > 0 ? (
                    <table>
                      <thead>
                        <tr>
                          <th>Day</th>
                          <th>Start Time</th>
                          <th>End Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(selectedTask.daily_work_track).map(
                          ([day, times]) => (
                            <tr key={day}>
                              <td>{day}</td>
                              <td>{times.start_time || "N/A"}</td>
                              <td>{times.end_time || "N/A"}</td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  ) : (
                    "No data available"
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <div className="buttonDiv">
        <button onClick={() => startFun("start")}>Start</button>
        <button onClick={() => startFun("end")}>End</button>
      </div>
    </div>
  );
};

export default Page;
