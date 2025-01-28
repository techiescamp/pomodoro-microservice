import React, { useEffect, useState } from 'react'
import Chart from 'chart.js/auto'
import { CategoryScale } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import Report from './Report'
import { useAuth } from '../../context/AuthContext'
import { useTask } from '../../context/TaskContext'
import axios from 'axios'

Chart.register(CategoryScale)

const TChart = () => {
  const { user } = useAuth()
  const { setList, list } = useTask()
  const token = sessionStorage.getItem('token')

  const [isLoading, setIsLoading] = useState(false)
  
  const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']

  const [labels, setLabels] = useState(null)
  const [totalAct, setTotalAct] = useState(null)
  //
  const [monthlyTaskData, setMonthlyTaskData] = useState([])
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()) // default to current year

  useEffect(() => {
    const fetchChartList = async() => {
      try {
        const resp = await axios.get('http://localhost:7000/api/getAllTasks', {
            headers: { Authorization: `Bearer ${token}` }
        })
        setList(resp.data.userTasks)
        return list
      } catch (err) {
          console.error('Error fetching tasks ', err)
      } finally {
        setIsLoading(false)
      }
    }
    if(user) fetchChartList()
  },[user, token])

  useEffect(() => { 
    if(list && list.length > 0) {
        const formattedDate = list.map(t => t.date && t.date.split('T')[0])
        setLabels(formattedDate) // x-axis
  
        const tasks = list && list.map(t => t.tasks.reduce((total, task) => {
          return total += Number(task.act * task.timer)
        }, 0))
        setTotalAct(tasks) // y-axis for weekly report
  
        const processMonthlyChart = (data) => {
          const yearData ={}
  
          data.forEach(entry => {
            const entryDate = new Date(entry.date)
            const year = entryDate.getFullYear()
            const month = entryDate.getMonth()
  
            if(!yearData[year]) {
              yearData[year] = Array(12).fill(0) // new year ? initialize months
            }
  
            entry.tasks.forEach(task => {
              if(task.checked) {
                yearData[year][month] += Number(task.act) * Number(task.timer)
              }
            })
          })
          return yearData
        }
  
        const processedData = processMonthlyChart(list)
        setMonthlyTaskData(processedData)
        setIsLoading(false)
      }
  },[list])


  const chartData = {
    labels: month,
    datasets: [
      {
        label: 'Monthly finished focus tasks',
        data: monthlyTaskData[selectedYear] || Array(12).fill(0),
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1
      }
    ]
  }

  const barData = {
    labels: labels,
    datasets: [
      {
        label: 'Weekly finished tasks',
        data: totalAct,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(225, 90, 132, 1)',
        borderWidth: 1
      }
    ]
  }

  const options = {
    responsive: true, // ensure the chart resizes
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'User Focus Report'
      },
      scales: {
        x: { ticks: {
                font: {
                  size: 10, 
                },
              }, 
            },
        y: { ticks: {
              font: {
                size: 10,
              },
            },
          },
      }, // end scales
    } // end plugin
  }

  return (
    <>
      <div className='bg-report'>
        <Report />
      </div>

      <div id='chart-container'>
        <h3 className='my-4 text-center text-decoration-underline fw-bold'>Report of your focus</h3>
        {!user && <p className='text-secondary text-center fs-4 fw-semibold py-2'>! Please login to view your reports</p>}
        
        {isLoading ? 
          (
            <div className="text-center py-4">
              <p className="text-muted">Loading charts...</p>
            </div>
          ) 
          :
          ( <> {/* weekly report */}
            <div id='weekly'>
              <h4 className='mb-3 tex-center text-decoration-underline text-danger fw-bold'>
                Weekly Report
              </h4>

              <div className='bar-chart-container'>
                <Bar options={options} data={barData} className='mb-4' />
              </div>
            </div>

            {/* monthly report */}
            <div id='monthly'>
              <h4 className='mb-3 tex-center text-decoration-underline text-success fw-bold'>
                Monthly Report
              </h4>

              <label htmlFor='yearSelect'>- Select Year - </label>
              <select
                id='yearSelect'
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                {monthlyTaskData && Object.keys(monthlyTaskData).map(year => (
                  <option key={year} value={year}>  {year}  </option>
                ))}
              </select>

              <Bar options={options} data={chartData} className='mb-4' />
            </div>
          </>)
        }
      </div>
    </>
  )
}

export default TChart