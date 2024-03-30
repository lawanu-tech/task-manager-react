import { useState,useEffect } from "react";
import MaterialTable from "@material-table/core";
import { Modal,Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

export default function App()
{
  // open create a new task modal
  const [createTaskModal, setCreateTaskModal] = useState(false);
    // store task details
  const [tasks, setTasks] = useState(() => {
    const storedTasks = localStorage.getItem("tasks");
    return storedTasks ? JSON.parse(storedTasks) : [];
  });

    // store the selected task
    const [selectedTask, setSelectedTask] = useState({});
  // open the edit task modal
  const [taskUpdationModal, setTaskUpdationModal] = useState(false);
    const columns=[
       
    {
        title: "TITLE",
        field: "title",
      },
      {
        title: "DESCRIPTION",
        field: "description",
      },
      {
        title: "DUE DATE",
        field: "dueDate",
      },
      {
        title: "PRIORITY",
        field: "priority",
        lookup: {
          High: "High",
          Medium: "Medium",
          Low: "Low",
          
        }
        
      },
      {
        title: "STATUS",
        field: "status",
        lookup: {
          Upcoming: "Upcoming",
          Overdue: "Overdue",
          Completed: "Completed",
          
        },
      }
    ]
function addTask(e)
{
  e.preventDefault();
  const title = e.target.title.value;
  const description = e.target.description.value;
  const dueDate = e.target.dueDate.value;
  const priority = e.target.priority.value;
  const completed="NO";
  const status=getTaskStatus({dueDate,completed})
  const task={
    id: Date.now(),
    title,
    description,
    dueDate,
    priority,
    completed,
    status
  };
  e.target.title.value = "";
  e.target.description.value = "";
  e.target.dueDate.value = "";
  e.target.priority.value = "Medium";
  setTasks([...tasks, task]);
  setCreateTaskModal(false);
}
const getTaskStatus = (task) => {
  console.log(task);
  if (task.completed==="YES") {
    return "Completed";
  } else if (task.dueDate) {
    const dueDate = new Date(task.dueDate);
    const currentDate = new Date();
    if (currentDate > dueDate) {
      return "Overdue";
    } else {
      return "Upcoming";
    }
  } else {
    return "Upcoming";
  }
};

function editTask(taskDetails)
{const task={
  id: taskDetails.id,
  title:taskDetails.title,
  description:taskDetails.description,
  dueDate:taskDetails.dueDate,
  priority:taskDetails.priority,
  completed:taskDetails.completed,
}
setSelectedTask(task);
  setTaskUpdationModal(true);
}

function onSelectedTaskChange(e)
{
  const { name, value } = e.target;
  setSelectedTask(prevTask => ({
    ...prevTask,
    [name]: value
  }));
}

function updateTask(e)
{
  e.preventDefault();
    const updatedTask = {
      id: selectedTask.id,
      title: e.target.title.value,
      description: e.target.description.value,
      dueDate: e.target.dueDate.value,
      priority: e.target.priority.value,
      completed: selectedTask.completed,
    };
    updatedTask.status=getTaskStatus(updatedTask);
    const updatedTasks = tasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    );
    setTasks(updatedTasks);
    setTaskUpdationModal(false);

}
function onDeleteTask(id) {
  const updatedTasks = tasks.filter((task) => task.id !== id);
  setTasks(updatedTasks);
  setTaskUpdationModal(false);
}

useEffect(() => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}, [tasks]
)

    return(
        <div className="container">
                <h3 className="text-center m-1 text-success">Task Management Dashboad</h3>
            <div className="table-responsive">
            <MaterialTable
           onRowClick={(event, rowData) => editTask(rowData)}
          title="Tasks Overview"
          columns={columns}
          data={tasks}
          options={{
            filtering: true,
            headerStyle: {
              backgroundColor: "#288859",
              color: "#fff",
            },
            rowStyle: {
              backgroundColor: "#eee",
            },
          }}
        />
        
        </div>
        <button
          className="btn btn-lg btn-success form-control m-1"
          onClick={() => setCreateTaskModal(true)}
        >
          Add Task
        </button>
        {createTaskModal ? (
          <Modal
            show={createTaskModal}
            backdrop="static"
            centered
            onHide={() => setCreateTaskModal(false)}
          >
            <Modal.Header closeButton>Add a new Task</Modal.Header>
            <Modal.Body>
              <form onSubmit={addTask}>
                <div className="input-group m-1">
                  <label className="label label-md input-group-text">
                    TITLE
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    required
                  />
                </div>
                <div className="input-group m-1">
                  <label className="label label-md input-group-text">
                    DESCRIPTION
                  </label>
                  <textarea
                    type="text"
                    className=" md-textarea form-control"
                    rows="3"
                    name="description"
                  />
                </div>
                <div className="input-group m-1">
                  <label className="label label-md input-group-text">
                    DUE DATE
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    name="dueDate"
                    required
                  />
                </div>
                <div className="input-group m-1">
                  <label className="label label-md input-group-text">
                    PRIORITY
                  </label>
                  <select className="form-select"
                     name="priority"
                  >
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                   </select>
                </div>

                <div className="d-flex justify-content-end">
                  <Button
                    variant="secondary"
                    className="m-1"
                    onClick={() => setCreateTaskModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button className="m-1" type="submit" variant="success">
                    Create
                  </Button>
                </div>
              </form>
            </Modal.Body>
          </Modal>
        ) : null}
            
          {taskUpdationModal ? (
          <Modal
            show={taskUpdationModal}
            backdrop="static"
            centered
            onHide={() => setTaskUpdationModal(false)}
          >
            <Modal.Header closeButton>Edit Task</Modal.Header>
            <Modal.Body>
              <form onSubmit={updateTask}>
                <div className="input-group m-1">
                  <label className="label label-md input-group-text">
                    TITLE
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    value={selectedTask.title}
                    onChange={onSelectedTaskChange}
                    required
                  />
                </div>
                <div className="input-group m-1">
                  <label className="label label-md input-group-text">
                    DESCRIPTION
                  </label>
                  <textarea
                    type="text"
                    value={selectedTask.description}
                    className=" md-textarea form-control"
                    rows="3"
                    name="description"
                    onChange={onSelectedTaskChange}
                    required
                  />
                </div>
                <div className="input-group m-1">
                  <label className="label label-md input-group-text">
                    DUE DATE
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    name="dueDate"
                    value={selectedTask.dueDate}
                    onChange={onSelectedTaskChange}
                    required
                  />
                </div>
                <div className="input-group m-1">
                  <label className="label label-md input-group-text">
                    PRIORITY
                  </label>
                  <select className="form-select"
                     value={selectedTask.priority}
                     name="priority"
                     onChange={onSelectedTaskChange}
                     required
                  >
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                   </select>
                </div>
                <div className="input-group m-1">
                  <label className="label label-md input-group-text">
                    COMPLETED
                  </label>
                  <select className="form-select"
                     value={selectedTask.completed}
                     name="completed"
                     onChange={onSelectedTaskChange}
                     required
                  >
                    <option>YES</option>
                    <option>NO</option>
                    
                   </select>
                </div>

                <div className="d-flex justify-content-end">
                  <Button
                    variant="secondary"
                    className="m-1"
                    onClick={() => setTaskUpdationModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="danger"
                    className="m-1"
                    onClick={()=>onDeleteTask(selectedTask.id)}
                  >
                    Delete
                  </Button>
                  <Button className="m-1" type="submit" variant="success">
                    Update
                  </Button>
                </div>
              </form>
            </Modal.Body>
          </Modal>
        ) : null}  
        </div>
        )
}