
import { useEffect, useState } from 'react'
import './App.css'

const initialTasks = [
  { id: 1, title: 'Complete Data Structures assignment', subject: 'Advanced Data Structures', due: '2026-10-30', priority: 'High', status: 'In Progress' },
  { id: 2, title: 'Prepare for Computer Networks quiz', subject: 'Computer Networks', due: '2026-10-31', priority: 'Medium', status: 'Pending' },
  { id: 3, title: 'Submit Software Engineering report', subject: 'Software Engineering', due: '2026-11-02', priority: 'High', status: 'Pending' },
  { id: 4, title: 'Revise JavaScript concepts', subject: 'Web Applications', due: '2026-11-04', priority: 'Low', status: 'Completed' },
]

const initialEvents = [
  { id: 1, title: 'Technical Workshop', date: '2026-10-30', time: '10:00 AM', place: 'Computer Lab' },
  { id: 2, title: 'Project Review', date: '2026-11-02', time: '02:00 PM', place: 'Seminar Hall' },
  { id: 3, title: 'Coding Competition', date: '2026-11-05', time: '09:30 AM', place: 'Main Auditorium' },
]

function App() {
  const [tasks, setTasks] = useState([])
const [loadingTasks, setLoadingTasks] = useState(true)
  const [events] = useState(initialEvents)
  const [activePage, setActivePage] = useState('Dashboard')
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [form, setForm] = useState({
    title: '', subject: '', due: '', priority: 'Medium', status: 'Pending',
  })
  
  useEffect(() => {
    fetch('http://localhost:5000/api/tasks')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch tasks')
        }
        return response.json()
      })
      .then(data => {
        setTasks(data)
        setLoadingTasks(false)
      })
      .catch(error => {
        console.error('Error loading tasks:', error)
        setLoadingTasks(false)
      })
  }, [])


  const completed = tasks.filter(task => task.status === 'Completed').length
  const pending = tasks.filter(task => task.status !== 'Completed').length
  const today = new Date().toISOString().slice(0, 10)

  const visibleTasks = tasks.filter(task => {
    const matchesSearch = `${task.title} ${task.subject}`.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'All' || task.status === filter
    const matchesPage = activePage !== 'Tasks' || true
    return matchesSearch && matchesFilter && matchesPage
  })

  function openNewTask() {
    setEditingTask(null)
    setForm({ title: '', subject: '', due: '', priority: 'Medium', status: 'Pending' })
    setShowForm(true)
  }

  function openEditTask(task) {
  setEditingTask(task._id);

  setForm({
    title: task.title,
    subject: task.subject,
    due: task.due,
    priority: task.priority,
    status: task.status,
  });

  setShowForm(true);
}

  
async function saveTask(event) {
  event.preventDefault();

  if (!form.title.trim() || !form.subject.trim() || !form.due) {
    return;
  }

  const taskData = {
    title: form.title.trim(),
    subject: form.subject.trim(),
    due: form.due,
    priority: form.priority,
    status: form.status,
  };

  try {
    const url = editingTask !== null
      ? `http://localhost:5000/api/tasks/${editingTask}`
      : 'http://localhost:5000/api/tasks';

    const response = await fetch(url, {
      method: editingTask !== null ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      throw new Error('Could not save task');
    }

    const savedTask = await response.json();

    if (editingTask !== null) {
      setTasks(current =>
        current.map(task =>
          task._id === editingTask ? savedTask : task
        )
      );
    } else {
      setTasks(current => [...current, savedTask]);
    }

    setShowForm(false);
  } catch (error) {
    console.error('Error saving task:', error);
    alert('Could not save the task. Please check whether the backend is running.');
  }
}


  async function deleteTask(id) {
  if (!window.confirm('Are you sure you want to delete this task?')) {
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:5000/api/tasks/${id}`,
      { method: 'DELETE' }
    );

    if (!response.ok) {
      throw new Error('Failed to delete task');
    }

    setTasks(current =>
      current.filter(task => task._id !== id)
    );
  } catch (error) {
    console.error('Error deleting task:', error);
    alert('Could not delete the task. Please try again.');
  }
}

 async function changeStatus(id, status) {
  const task = tasks.find(item => item._id === id);

  if (!task) return;

  try {
    const response = await fetch(
      `http://localhost:5000/api/tasks/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...task,
          status: status,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to update status');
    }

    const updatedTask = await response.json();

    setTasks(current =>
      current.map(item =>
        item._id === id ? updatedTask : item
      )
    );
  } catch (error) {
    console.error('Error updating task status:', error);
    alert('Could not update task status. Please try again.');
  }
}

  function formatDate(date) {
    if (!date) return 'No date'
    return new Date(`${date}T00:00:00`).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
    })
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">C</div>
          <div><strong>CampusConnect</strong><span>STUDENT SPACE</span></div>
        </div>

        <p className="nav-label">WORKSPACE</p>
        {[
          ['Dashboard', '▦'],
          ['Tasks', '✓'],
          ['Events', '▣'],
        ].map(([page, icon]) => (
          <button
            key={page}
            className={`nav-link ${activePage === page ? 'active' : ''}`}
            onClick={() => setActivePage(page)}
          >
            <span className="nav-icon">{icon}</span>{page}
            {page === 'Tasks' && <span className="nav-count">{pending}</span>}
          </button>
        ))}

        <div className="sidebar-bottom">
          <div className="sidebar-note">
            <span className="note-icon">✦</span>
            <strong>Small steps, big goals.</strong>
            <p>Stay organized and make this semester count.</p>
          </div>
          <div className="profile">
            <div className="avatar">S</div>
            <div><strong>Student</strong><span>Campus member</span></div>
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumb">Workspace <span>/</span> {activePage}</div>
          <div className="topbar-right">
            <span className="today-label">{new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
            <div className="top-avatar">S</div>
          </div>
        </header>

        <div className="page-content">
          <section className="welcome-row">
            <div>
              <p className="eyebrow">YOUR CAMPUS, YOUR PACE</p>
              <h1>{activePage === 'Dashboard' ? 'Good things start here.' : activePage}</h1>
              <p className="subtitle">
                {activePage === 'Events'
                  ? 'Keep up with what is happening around campus.'
                  : activePage === 'Tasks'
                    ? 'Plan your work, meet your deadlines, and celebrate progress.'
                    : 'A little planning today makes tomorrow easier.'}
              </p>
            </div>
            {activePage !== 'Events' && (
              <button className="primary-button" onClick={openNewTask}><span>＋</span> Add task</button>
            )}
          </section>

          {activePage !== 'Events' && (
            <section className="stats-grid">
              <div className="stat-card"><div className="stat-top"><span>Total tasks</span><span className="stat-icon lavender">▤</span></div><strong>{tasks.length.toString().padStart(2, '0')}</strong><small>Across all subjects</small></div>
              <div className="stat-card"><div className="stat-top"><span>In progress / pending</span><span className="stat-icon peach">◷</span></div><strong>{pending.toString().padStart(2, '0')}</strong><small>Keep moving forward</small></div>
              <div className="stat-card"><div className="stat-top"><span>Completed</span><span className="stat-icon mint">✓</span></div><strong>{completed.toString().padStart(2, '0')}</strong><small>{tasks.length ? Math.round(completed / tasks.length * 100) : 0}% of all tasks</small></div>
            </section>
          )}

          {activePage !== 'Events' && (
            <section className="tasks-section">
              <div className="section-heading">
                <div><h2>{activePage === 'Tasks' ? 'All tasks' : 'Your tasks'}</h2><p>Keep your semester on track.</p></div>
                <button className="text-button" onClick={() => { setActivePage('Tasks'); setFilter('All') }}>View all <span>→</span></button>
              </div>

              <div className="toolbar">
                <div className="search-box"><span>⌕</span><input aria-label="Search tasks" placeholder="Search tasks or subjects..." value={search} onChange={event => setSearch(event.target.value)} /></div>
                <select aria-label="Filter tasks by status" value={filter} onChange={event => setFilter(event.target.value)}>
                  <option value="All">All statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="task-list">
                {visibleTasks.length === 0 ? (
                  <div className="empty-state"><span>✦</span><strong>No tasks found</strong><p>Try a different search or add a new task.</p></div>
                ) : visibleTasks.map(task => (
                  <article className="task-card" >
                    <button className={`task-check ${task.status === 'Completed' ? 'checked' : ''}`} title="Mark completed" aria-label={`Mark ${task.title} completed`} onClick={() => changeStatus(task.id, task.status === 'Completed' ? 'Pending' : 'Completed')}>{task.status === 'Completed' ? '✓' : ''}</button>
                    <div className="task-main">
                      <strong className={task.status === 'Completed' ? 'completed-title' : ''}>{task.title}</strong>
                      <span>{task.subject}</span>
                      <div className="task-meta"><span>▣ {formatDate(task.due)}</span><span className={`priority ${task.priority.toLowerCase()}`}>{task.priority} priority</span></div>
                    </div>
                    <div className="task-actions">
                      <span className={`status ${task.status.toLowerCase().replace(' ', '-')}`}>{task.status}</span>
                      <button className="icon-button" title="Edit task" aria-label="Edit task" onClick={() => openEditTask(task)}>✎</button>
                      <button className="icon-button delete-button" title="Delete task" aria-label="Delete task" onClick={() => deleteTask(task._id)}>×</button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {activePage !== 'Tasks' && (
            <section className="events-section">
              <div className="section-heading"><div><h2>Upcoming events</h2><p>Make room for something inspiring.</p></div><button className="text-button" onClick={() => setActivePage('Events')}>View events <span>→</span></button></div>
              <div className="events-grid">
                {events.map(event => (
                  <article className="event-card" key={event.id}>
                    <div className="event-date"><span>{new Date(`${event.date}T00:00:00`).toLocaleDateString('en-IN', { month: 'short' }).toUpperCase()}</span><strong>{new Date(`${event.date}T00:00:00`).getDate()}</strong></div>
                    <div className="event-info"><strong>{event.title}</strong><span>◷ {event.time}</span><span>⌖ {event.place}</span></div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {activePage === 'Events' && (
            <section className="events-section events-page">
              <div className="section-heading"><div><h2>Campus calendar</h2><p>Save the date for these upcoming activities.</p></div></div>
              <div className="events-grid">
                {events.map(event => (
                  <article className="event-card" key={event.id}>
                    <div className="event-date"><span>{new Date(`${event.date}T00:00:00`).toLocaleDateString('en-IN', { month: 'short' }).toUpperCase()}</span><strong>{new Date(`${event.date}T00:00:00`).getDate()}</strong></div>
                    <div className="event-info"><strong>{event.title}</strong><span>◷ {event.time}</span><span>⌖ {event.place}</span></div>
                  </article>
                ))}
              </div>
            </section>
          )}

          <footer className="footer"><span>CampusConnect</span><span>Built for your campus journey ✦</span></footer>
        </div>
      </main>

      {showForm && (
        <div className="modal-backdrop" onClick={event => { if (event.target === event.currentTarget) setShowForm(false) }}>
          <form className="task-form" onSubmit={saveTask}>
            <div className="form-heading"><div><p className="eyebrow">{editingTask !== null ? 'UPDATE YOUR WORK' : 'MAKE A PLAN'}</p><h2>{editingTask !== null ? 'Edit task' : 'Add a new task'}</h2></div><button type="button" className="close-button" onClick={() => setShowForm(false)}>×</button></div>
            <label>Task title<input autoFocus required maxLength={100} placeholder="e.g. Complete lab record" value={form.title} onChange={event => setForm({ ...form, title: event.target.value })} /></label>
            <label>Subject or course<input required maxLength={80} placeholder="e.g. Web Applications" value={form.subject} onChange={event => setForm({ ...form, subject: event.target.value })} /></label>
            <label>Due date<input required type="date" value={form.due} onChange={event => setForm({ ...form, due: event.target.value })} /></label>
            <div className="form-row">
              <label>Priority<select value={form.priority} onChange={event => setForm({ ...form, priority: event.target.value })}><option>Low</option><option>Medium</option><option>High</option></select></label>
              <label>Status<select value={form.status} onChange={event => setForm({ ...form, status: event.target.value })}><option>Pending</option><option>In Progress</option><option>Completed</option></select></label>
            </div>
            <button className="primary-button form-submit" type="submit">{editingTask !== null ? 'Save changes' : 'Create task'} <span>→</span></button>
          </form>
        </div>
      )}
    </div>
  )
}

export default App
