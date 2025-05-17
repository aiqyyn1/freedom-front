import { useState, useEffect } from 'react'
import './ProfileGame.css'

function ProfileGame() {
  // Mock user data
  const [userData, setUserData] = useState({
    name: "Алексей",
    level: 4,
    xp: 75, // percentage of current level progress
    totalXp: 2350,
    nextLevelXp: 3000,
    trades: 23,
    lastActive: "3 месяца назад"
  })

  // Mock tasks data
  const [dailyTasks, setDailyTasks] = useState([
    { id: 1, title: "Сделать 2 трейда сегодня", completed: false, progress: 0, total: 2, xpReward: 50 },
    { id: 2, title: "Пополнить счет на любую сумму", completed: false, progress: 0, total: 1, xpReward: 30 },
    { id: 3, title: "Посетить обучающий вебинар", completed: false, progress: 0, total: 1, xpReward: 40 }
  ])

  const [weeklyTasks, setWeeklyTasks] = useState([
    { id: 1, title: "Сделать 10 трейдов за неделю", completed: false, progress: 3, total: 10, xpReward: 150 },
    { id: 2, title: "Совершить трейды на сумму 50,000₸", completed: false, progress: 15000, total: 50000, xpReward: 200 },
    { id: 3, title: "Пригласить друга", completed: false, progress: 0, total: 1, xpReward: 100 }
  ])

  // Mock rewards data
  const [rewards, setRewards] = useState([
    { level: 1, title: "Бонус 500₸", claimed: true },
    { level: 2, title: "Персональная консультация", claimed: true },
    { level: 3, title: "Бонус 1,000₸", claimed: true },
    { level: 4, title: "VIP-статус на неделю", claimed: false },
    { level: 5, title: "Худи от Freedom", claimed: false },
    { level: 6, title: "Бонус 2,000₸", claimed: false },
    { level: 7, title: "Доступ к премиум-вебинарам", claimed: false }
  ])

  const [showAnimation, setShowAnimation] = useState(false)
  const [showWelcomeBack, setShowWelcomeBack] = useState(true)

  // Complete a task
  const completeTask = (taskType, taskId) => {
    if (taskType === 'daily') {
      setDailyTasks(dailyTasks.map(task => {
        if (task.id === taskId) {
          if (!task.completed) {
            setShowAnimation(true)
            setTimeout(() => setShowAnimation(false), 1500)

            // Update user XP
            const newXp = Math.min(userData.xp + task.xpReward / 10, 100)
            const levelUp = newXp === 100

            setUserData({
              ...userData,
              xp: levelUp ? 0 : newXp,
              level: levelUp ? userData.level + 1 : userData.level,
              totalXp: userData.totalXp + task.xpReward
            })
          }
          return { ...task, completed: true, progress: task.total }
        }
        return task
      }))
    } else {
      setWeeklyTasks(weeklyTasks.map(task => {
        if (task.id === taskId) {
          if (!task.completed) {
            setShowAnimation(true)
            setTimeout(() => setShowAnimation(false), 1500)

            // Update user XP
            const newXp = Math.min(userData.xp + task.xpReward / 10, 100)
            const levelUp = newXp === 100

            setUserData({
              ...userData,
              xp: levelUp ? 0 : newXp,
              level: levelUp ? userData.level + 1 : userData.level,
              totalXp: userData.totalXp + task.xpReward
            })
          }
          return { ...task, completed: true, progress: task.total }
        }
        return task
      }))
    }
  }

  // Claim a reward
  const claimReward = (level) => {
    setRewards(rewards.map(reward => {
      if (reward.level === level) {
        return { ...reward, claimed: true }
      }
      return reward
    }))
  }

  // Close welcome back modal
  const closeWelcomeBack = () => {
    setShowWelcomeBack(false)
  }

  return (
    <div className="profile-game">
      {/* Welcome back modal */}
      {showWelcomeBack && (
        <div className="welcome-back-overlay">
          <div className="welcome-back-modal">
            <h2>С возвращением в игру!</h2>
            <p>Мы скучали по тебе, {userData.name}! Ты не был с нами {userData.lastActive}.</p>
            <p>Выполняй задания, получай опыт и поднимайся в уровне, чтобы получить ценные призы!</p>
            <button className="welcome-back-btn" onClick={closeWelcomeBack}>Начать игру</button>
          </div>
        </div>
      )}

      {/* XP Animation */}
      {showAnimation && (
        <div className="xp-animation">
          <span>+XP</span>
        </div>
      )}

      <div className="profile-container">
        <div className="profile-header">
          <h1>Игровой профиль</h1>
          <div className="user-info">
            <div className="avatar">
              {userData.name.charAt(0)}
            </div>
            <div className="user-details">
              <h2>{userData.name}</h2>
              <p>Последняя активность: {userData.lastActive}</p>
            </div>
          </div>
        </div>

        <div className="level-section">
          <div className="level-container">
            <div className="level-badge">
              <span className="level-number">{userData.level}</span>
              <span className="level-text">LVL</span>
            </div>
            <div className="level-progress">
              <div className="xp-info">
                <span>XP: {userData.totalXp} / {userData.nextLevelXp}</span>
                <span className="trades-count">{userData.trades} Trades</span>
              </div>
              <div className="progress-bar">
                <div className="progress" style={{ width: `${userData.xp}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="tasks-section">
          <h2>Ежедневные задания</h2>
          <div className="tasks-container">
            {dailyTasks.map(task => (
              <div key={task.id} className={`task-card ${task.completed ? 'completed' : ''}`}>
                <div className="task-header">
                  <h3>{task.title}</h3>
                  <span className="xp-reward">+{task.xpReward} XP</span>
                </div>
                <div className="task-progress">
                  <div className="progress-bar">
                    <div
                      className="progress"
                      style={{ width: `${(task.progress / task.total) * 100}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">{task.progress}/{task.total}</span>
                </div>
                {!task.completed && (
                  <button
                    className="complete-task-btn"
                    onClick={() => completeTask('daily', task.id)}
                  >
                    Выполнить
                  </button>
                )}
                {task.completed && (
                  <div className="completed-badge">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                    <span>Выполнено</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <h2>Еженедельные задания</h2>
          <div className="tasks-container">
            {weeklyTasks.map(task => (
              <div key={task.id} className={`task-card ${task.completed ? 'completed' : ''}`}>
                <div className="task-header">
                  <h3>{task.title}</h3>
                  <span className="xp-reward">+{task.xpReward} XP</span>
                </div>
                <div className="task-progress">
                  <div className="progress-bar">
                    <div
                      className="progress"
                      style={{ width: `${(task.progress / task.total) * 100}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">
                    {task.id === 2
                      ? `${task.progress.toLocaleString()}₸/${task.total.toLocaleString()}₸`
                      : `${task.progress}/${task.total}`}
                  </span>
                </div>
                {!task.completed && (
                  <button
                    className="complete-task-btn"
                    onClick={() => completeTask('weekly', task.id)}
                  >
                    Выполнить
                  </button>
                )}
                {task.completed && (
                  <div className="completed-badge">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                    <span>Выполнено</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="rewards-section">
          <h2>Награды за уровни</h2>
          <div className="rewards-container">
            {rewards.map(reward => (
              <div key={reward.level} className={`reward-card ${userData.level >= reward.level ? 'available' : 'locked'} ${reward.claimed ? 'claimed' : ''}`}>
                <div className="reward-level">Уровень {reward.level}</div>
                <div className="reward-title">{reward.title}</div>
                {userData.level >= reward.level && !reward.claimed ? (
                  <button
                    className="claim-reward-btn"
                    onClick={() => claimReward(reward.level)}
                  >
                    Получить
                  </button>
                ) : reward.claimed ? (
                  <div className="claimed-badge">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                    <span>Получено</span>
                  </div>
                ) : (
                  <div className="locked-badge">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                    </svg>
                    <span>Заблокировано</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileGame 