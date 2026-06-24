import { useState, useEffect } from "react";
import { analyzeTask } from "./services/gemini";

function App() {
  const [task, setTask] = useState("");
  const [deadline, setDeadline] = useState("");
  const [hours, setHours] = useState("");
  const [tasks, setTasks] = useState([]);
  const [aiResult, setAiResult] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");

    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "tasks",
      JSON.stringify(tasks)
    );
  }, [tasks]);

  function addTask() {
    const newTask = {
      task,
      deadline,
      hours,
      completed: false,
    };

    setTasks([...tasks, newTask]);

    setTask("");
    setDeadline("");
    setHours("");
  }
  function deleteTask(indexToDelete) {
    setTasks(
      tasks.filter(
        (_, index) => index !== indexToDelete
      )
    );
  }

  function toggleComplete(index) {
    const updatedTasks = [...tasks];

    updatedTasks[index].completed =
      !updatedTasks[index].completed;

    setTasks(updatedTasks);
  }

  async function handleAnalyze() {
    try {
      setLoading(true);

      const result = await analyzeTask(
        task,
        deadline,
        hours
      );

      setAiResult(result);
    } catch (error) {
      console.error(error);
      setAiResult("Error connecting to Gemini.");
    } finally {
      setLoading(false);
    }
  }

  async function analyzeSavedTask(item) {
    const result = await analyzeTask(
      item.task,
      item.deadline,
      item.hours
    );

    setAiResult(result);
  }

  function getUrgency(deadline) {
    const today = new Date();
    const dueDate = new Date(deadline);

    const daysLeft = Math.ceil(
      (dueDate - today) / (1000 * 60 * 60 * 24)
    );

    if (daysLeft <= 2) return " Urgent";
    if (daysLeft <= 7) return " Medium";

    return " Safe";
  }

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >

      <div
        style={{
          textAlign: "center",
          padding: "30px",
          marginBottom: "20px",
        }}
      >
        <h1
          style={{
            fontSize: "3rem",
            color: "#60a5fa",
          }}
        >
          BeforeTomorrow
        </h1>

        <p
          style={{
            fontSize: "1.2rem",
            color: "#cbd5e1",
          }}
        >
          
        </p>

        <p
          style={{
            marginTop: "10px",
            color: "#94a3b8",
          }}
        >
          AI-powered task planning, deadline prediction,
          and productivity coaching.
        </p>
      </div>

      <hr />

      <div
        style={{
          backgroundColor: "#1e293b",
          padding: "20px",
          borderRadius: "15px",
          marginBottom: "20px",
        }}
      >
      <h2>Add Task</h2>

      <input
        type="text"
        placeholder="Task Name"
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />

      <br /><br />

      <input
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
      />

      <br /><br />

      <input
        type="number"
        placeholder="Estimated Hours"
        value={hours}
        onChange={(e) => setHours(e.target.value)}
      />

      <br /><br />

      <button onClick={addTask}
      style={{
        backgroundColor: "#3b82f6",
        color: "white",
        border: "none",
        padding: "10px 16px",
        borderRadius: "8px",
        margin: "5px",
        cursor: "pointer",
      }}
      >
        Add Task
      </button>
      </div>

      <hr />

      <h2>AI Analysis</h2>

      {loading && <p>Analyzing...</p>}

      <div
        style={{
          backgroundColor: "#1e293b",
          padding: "20px",
          borderRadius: "15px",
          marginBottom: "20px",
          textAlign: "left",
        }}
      >
        <pre
          style={{
            whiteSpace: "pre-wrap",
            color: "#e2e8f0",
          }}
        >
          {aiResult}
        </pre>
      </div>

      <div
        style={{
          backgroundColor: "#1e293b",
          padding: "15px",
          borderRadius: "12px",
          marginBottom: "20px",
        }}
      >
        <h2>Dashboard</h2>

        <p>Total Tasks: {tasks.length}</p>

        <p>
          Completed: {
            tasks.filter(task => task.completed).length
          }
        </p>

        <p>
          Pending: {
            tasks.filter(task => !task.completed).length
          }
        </p>
      </div>

      <hr />

      <h2>Your Tasks</h2>

      {tasks.length === 0 && (
        <p>
          No tasks yet. Add your first task!
        </p>
      )}

      {tasks.map((item, index) => (
        <div
          key={index}
          style={{
            backgroundColor: "#1e293b",
            padding: "15px",
            borderRadius: "12px",
            marginBottom: "15px",
            boxShadow: "0 0 10px rgba(0,0,0,0.2)",
          }}
        >
          <h3>{item.task}</h3>
          <p>Deadline: {item.deadline}</p>
          <p>Hours: {item.hours}</p>
          <p>{getUrgency(item.deadline)}</p>
          {item.completed && (
            <p
              style={{
                color: "lightgreen",
                fontWeight: "bold",
              }}
            >
               Completed
            </p>
          )}

          <button
            onClick={() => analyzeSavedTask(item)}
            style={{
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              padding: "10px 16px",
              borderRadius: "8px",
              marginRight: "10px",
              cursor: "pointer",
            }}
          >
            Analyze
          </button>

          <button
            onClick={() => toggleComplete(index)}
            style={{
              backgroundColor: "#22c55e",
              color: "white",
              border: "none",
              padding: "10px 16px",
              borderRadius: "8px",
              marginRight: "10px",
              cursor: "pointer",
            }}
          >
            {item.completed ? "Undo" : "Complete"}
          </button>

          <button
            onClick={() => deleteTask(index)}
            style={{
              backgroundColor: "#ef4444",
              color: "white",
              border: "none",
              padding: "10px 16px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Delete
          </button>

          <hr />
        </div>
      ))}

      <hr/>
          <div
            style={{
              textAlign: "center",
              padding: "20px",
              color: "#94a3b8",
            }}
          >
            <p>BeforeTomorrow © 2026</p>
            <p>Built with React + Gemini AI</p>
          </div>

    </div>
  );
}

export default App;