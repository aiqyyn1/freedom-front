import { useState, useEffect } from 'react'
import './App.css'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'
import ProfileGame from './ProfileGame'

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
  // State for active view
  const [activeView, setActiveView] = useState('profile') // 'charts', 'profile'

  // Charts data states
  const [activeChart, setActiveChart] = useState('channels')
  const [channelsData, setChannelsData] = useState(null)
  const [lifetimeData, setLifetimeData] = useState(null)
  const [commissionData, setCommissionData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Mock data for customer segments table
  const customerSegments = [
    {
      priority: 1,
      segment: "VIP-клиенты",
      description: "Клиенты с высокой активностью, частыми сделками и максимальными комиссиями. Они приносят основную прибыль компании.",
      recommendations: "Персональные бонусы, эксклюзивный доступ, VIP-ивенты, индивидуальные консультации, реферальные программы."
    },
    {
      priority: 2,
      segment: "Потенциальные лидеры",
      description: "Клиенты с высоким прошлым доходом (комиссиями), но с низкой текущей активностью. Риск ухода, но есть потенциал для возврата.",
      recommendations: "Персонализированные ре-активационные кампании, снижение комиссии при возврате, эксклюзивные предложения, email и push-уведомления."
    },
    {
      priority: 3,
      segment: "Средний класс",
      description: "Клиенты со стабильной умеренной активностью и комиссией. Это основной сегмент с возможностью роста.",
      recommendations: "Программы лояльности, регулярные обзоры рынка, акции по увеличению активности, геймификация, обучающие материалы."
    },
    {
      priority: 4,
      segment: "Новые клиенты",
      description: "Клиенты, недавно начавшие торговать, с низкой активностью и оборотами. Требуют поддержки и обучения.",
      recommendations: "Приветственные бонусы, обучающие вебинары, безрисковые сделки, onboarding-кампании, поддержка и сопровождение."
    },
    {
      priority: 5,
      segment: "Спящие клиенты",
      description: "Долгосрочно неактивные клиенты, риск полностью потерять их. Требуют стимулирования.",
      recommendations: "Автоматические триггерные сообщения, бонусы за возвращение, геймификация, опросы причин неактивности, SMS и push-уведомления."
    }
  ];

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

  // Render the charts view
  const renderChartsView = () => {
    return (
      <>
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

        <main className="bg-gray-800 shadow-md rounded-lg p-6 overflow-hidden mb-6">
          <div className="chart-container" style={{ height: '400px', position: 'relative' }}>
            {renderChart()}
          </div>
        </main>

        <section className="bg-gray-800 shadow-md rounded-lg overflow-hidden">
          <h2 className="text-xl font-bold text-white p-6 border-b border-gray-700">Сегментация клиентов</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-700 text-white">
                  <th className="py-4 px-6 font-semibold">Приоритет</th>
                  <th className="py-4 px-6 font-semibold">Сегмент</th>
                  <th className="py-4 px-6 font-semibold">Описание</th>
                  <th className="py-4 px-6 font-semibold">Рекомендации (Marketing Type)</th>
                  <th className="py-4 px-6 w-12 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 inline">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
                    </svg>
                  </th>
                </tr>
              </thead>
              <tbody>
                {customerSegments.map((segment, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-black text-white' : 'bg-gray-900 text-white'}>
                    <td className="py-4 px-6 border-b border-gray-700 font-bold">{segment.priority}</td>
                    <td className="py-4 px-6 border-b border-gray-700 font-medium">{segment.segment}</td>
                    <td className="py-4 px-6 border-b border-gray-700">{segment.description}</td>
                    <td className="py-4 px-6 border-b border-gray-700">{segment.recommendations}</td>
                    <td className="py-4 px-6 border-b border-gray-700 text-center">
                      <button className="text-gray-400 hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      {/* Navigation */}
      <nav className="flex justify-center mb-6">
        <div className="bg-gray-800 rounded-lg p-1 flex">
          <button
            className={`py-2 px-6 rounded-lg font-medium transition-all ${activeView === 'charts' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'}`}
            onClick={() => setActiveView('charts')}
          >
            Аналитика
          </button>
          <button
            className={`py-2 px-6 rounded-lg font-medium transition-all ${activeView === 'profile' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'}`}
            onClick={() => setActiveView('profile')}
          >
            Игровой профиль
          </button>
        </div>
      </nav>

      {/* Content */}
      {activeView === 'charts' ? renderChartsView() : <ProfileGame />}

      <footer className="mt-6 text-center text-gray-500">
        <p>Freedom Finance © 2023</p>
      </footer>
    </div>
  )
}

export default App
