import { useState, useEffect } from 'react'
import './App.css'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend)

// Generate random colors for chart segments
const generateColors = (count) => {
  const colors = []
  const backgroundColors = []
  const borderColors = []

  for (let i = 0; i < count; i++) {
    const r = Math.floor(Math.random() * 255)
    const g = Math.floor(Math.random() * 255)
    const b = Math.floor(Math.random() * 255)

    backgroundColors.push(`rgba(${r}, ${g}, ${b}, 0.6)`)
    borderColors.push(`rgba(${r}, ${g}, ${b}, 1)`)
  }

  colors.push(backgroundColors)
  colors.push(borderColors)
  return colors
}

function App() {
  const [activeChart, setActiveChart] = useState('channels')
  const [channelsData, setChannelsData] = useState(null)
  const [lifetimeData, setLifetimeData] = useState(null)
  const [commissionData, setCommissionData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fetch data from the three endpoints
    const fetchData = async () => {
      try {
        setIsLoading(true)

        // Fetch data from the first endpoint (default)
        const channelsResponse = await fetch('http://18.157.112.83:8081/api/channels')
        const channelsData = await channelsResponse.json()
        console.log('Channels data:', channelsData)
        setChannelsData(channelsData)

        // Fetch data from the second endpoint (lifetime)
        const lifetimeResponse = await fetch('http://18.157.112.83:8081/api/channels?type=lifetime')
        const lifetimeData = await lifetimeResponse.json()
        console.log('Lifetime data:', lifetimeData)
        setLifetimeData(lifetimeData)

        // Fetch data from the third endpoint (commission_sum)
        const commissionResponse = await fetch('http://18.157.112.83:8081/api/channels?type=commission_sum')
        const commissionData = await commissionResponse.json()
        console.log('Commission sum data:', commissionData)
        setCommissionData(commissionData)

        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setIsLoading(false)
      }
    }

    fetchData()
  }, []) // Empty dependency array ensures this runs once on component mount

  // Prepare chart data for Channels
  const prepareChannelsChartData = () => {
    if (!channelsData) return null

    const labels = channelsData.map(item => item.channel)
    const data = channelsData.map(item => item.user_count)
    const [backgroundColors, borderColors] = generateColors(labels.length)

    return {
      labels,
      datasets: [
        {
          label: 'Количество пользователей',
          data,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1,
        },
      ],
    }
  }

  // Prepare chart data for Lifetime
  const prepareLifetimeChartData = () => {
    if (!lifetimeData) return null

    const labels = lifetimeData.map(item => item.channel)
    const data = lifetimeData.map(item => item.avg_lifetime_days)
    const [backgroundColors, borderColors] = generateColors(labels.length)

    return {
      labels,
      datasets: [
        {
          label: 'Среднее время жизни (дни)',
          data,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1,
        },
      ],
    }
  }

  // Prepare chart data for Commission
  const prepareCommissionChartData = () => {
    if (!commissionData) return null

    const labels = commissionData.map(item => item.channel)
    const data = commissionData.map(item => item.total_commission)
    const [backgroundColors, borderColors] = generateColors(labels.length)

    return {
      labels,
      datasets: [
        {
          label: 'Общая комиссия',
          data,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1,
        },
      ],
    }
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#fff',
          font: {
            size: 14
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }

            if (activeChart === 'channels') {
              label += context.raw.toLocaleString() + ' пользователей';
            } else if (activeChart === 'lifetime') {
              label += context.raw.toFixed(2) + ' дней';
            } else if (activeChart === 'commission') {
              label += context.raw.toLocaleString() + ' ₸';
            }

            return label;
          }
        }
      }
    }
  }

  const renderChart = () => {
    if (isLoading) {
      return <div className="loading">Загрузка данных...</div>
    }

    switch (activeChart) {
      case 'channels':
        return <Pie data={prepareChannelsChartData()} options={chartOptions} />
      case 'lifetime':
        return <Pie data={prepareLifetimeChartData()} options={chartOptions} />
      case 'commission':
        return <Pie data={prepareCommissionChartData()} options={chartOptions} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <header className="bg-gray-800 shadow-md rounded-lg p-6 mb-6">
        <h1 className="text-2xl font-bold text-white">Анализ каналов привлечения</h1>
        <p className="text-gray-400">Статистика по каналам привлечения клиентов</p>
      </header>

      <div className="button-group mb-6 flex gap-4">
        <button
          className={`py-2 px-4 rounded-lg font-medium ${activeChart === 'channels' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
          onClick={() => setActiveChart('channels')}
        >
          Количество пользователей
        </button>
        <button
          className={`py-2 px-4 rounded-lg font-medium ${activeChart === 'lifetime' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
          onClick={() => setActiveChart('lifetime')}
        >
          Среднее время жизни
        </button>
        <button
          className={`py-2 px-4 rounded-lg font-medium ${activeChart === 'commission' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
          onClick={() => setActiveChart('commission')}
        >
          Общая комиссия
        </button>
      </div>

      <main className="bg-gray-800 shadow-md rounded-lg p-6 overflow-hidden">
        <div className="chart-container" style={{ height: '500px', position: 'relative' }}>
          {renderChart()}
        </div>
      </main>

      <footer className="mt-6 text-center text-gray-500">
        <p>Анализ каналов привлечения © 2023</p>
      </footer>
    </div>
  )
}

export default App
