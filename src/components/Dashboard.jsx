import { useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { calculateWeeklyMetrics, calculateTotalMetrics } from '../utils/metrics';
import '../styles/Dashboard.scss';

const Dashboard = ({ issues }) => {
  const [showModal, setShowModal] = useState(false);
  const weeklyData = calculateWeeklyMetrics(issues);
  const { totalCreated, totalClosed, averageClosureRate } = calculateTotalMetrics(issues);

  return (
    <div className="dashboard">
      <div className="stats-cards">
        <div className="stat-card">
          <h3>Total Issues</h3>
          <p>{totalCreated}</p>
        </div>
        <div className="stat-card">
          <h3>Closed Issues</h3>
          <p>{totalClosed}</p>
        </div>
        <div className="stat-card">
          <h3>Average Closure Rate</h3>
          <p>{averageClosureRate.toFixed(1)}%</p>
        </div>
      </div>

      <div className="charts">
        <div className="chart-container">
          <h3>Weekly Issues Created vs Closed</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="weekStart" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="created" stroke="#0366d6" name="Created" />
              <Line type="monotone" dataKey="closed" stroke="#2ea44f" name="Closed" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Weekly Closure Rate</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="weekStart" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="closureRate" fill="#0366d6" name="Closure Rate (%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <button className="view-all-btn" onClick={() => setShowModal(true)}>
        View All Issues
      </button>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>All Issues</h2>
              <button className="return-btn" onClick={() => setShowModal(false)}>
                Return to Dashboard
              </button>
            </div>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>State</th>
                  <th>Created At</th>
                  <th>Closed At</th>
                </tr>
              </thead>
              <tbody>
                {issues
                  .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                  .map((issue) => (
                    <tr key={issue.id}>
                      <td>{issue.number}</td>
                      <td>{issue.title}</td>
                      <td>{issue.state}</td>
                      <td>{new Date(issue.created_at).toLocaleDateString()}</td>
                      <td>
                        {issue.closed_at
                          ? new Date(issue.closed_at).toLocaleDateString()
                          : '-'}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 