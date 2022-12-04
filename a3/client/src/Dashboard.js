import React from 'react'

import {
  Routes,
  Route,
  Link
} from "react-router-dom";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Chart.js Bar Chart',
    },
  },
};

const labels = ['pokemonImage', 'getPokemons', 'addPokemon', 'deletePokemon', ];

export const data = {
  labels,
  datasets: [
    {
      label: 'users',
      data: [8, 16, 0, 0],
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      label: 'admins',
      data: [0, 2, 9, 10],
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
};

function Dashboard({ accessToken, setAccessToken, refreshToken }) {
  return (
    <div>

      <h1>
        Dashboard
      </h1>
      <nav>
        <table
          style={{
            border: "1px solid black",
            borderCollapse: "collapse",
            width: "100%"
          }}
        >
          <tr>
            <td>
              data
            </td>
            <td>
              <Link to="/dashboard/data">
                Data
              </Link>
            </td>
          </tr>
          <tr>
            <td>
              settings
            </td>
            <td>
              <Link to="/dashboard/settings">
                Settings
              </Link>
            </td>
          </tr>
        </table>
      </nav>

      <Bar data={data} options={options} />

      {/* <Routes>
        <Route path="/report/1" element={<Report id={1} accessToken={accessToken} setAccessToken={setAccessToken} refreshToken={refreshToken} />} />
        <Route path="/report/2" element={<Report id={2} accessToken={accessToken} setAccessToken={setAccessToken} refreshToken={refreshToken} />} />
        <Route path="/report/3" element={<Report id={3} accessToken={accessToken} setAccessToken={setAccessToken} refreshToken={refreshToken} />} />
      </Routes> */}

    </div>
  )
}

export default Dashboard