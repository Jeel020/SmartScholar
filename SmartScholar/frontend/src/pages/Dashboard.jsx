import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div>
      <h1>SmartScholar Dashboard</h1>

      <p>Assignments: 5 Pending</p>
      <p>Attendance: 87%</p>

      <Link to="/assignments">Assignments</Link>
      <br />

      <Link to="/attendance">Attendance</Link>
      <br />

      <Link to="/notes">Notes</Link>
    </div>
  );
}

export default Dashboard;