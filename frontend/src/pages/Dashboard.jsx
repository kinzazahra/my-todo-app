import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('General');
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/login');
        } else {
            fetchTasks();
        }
    }, [token, navigate]);

    const fetchTasks = async () => {
        try {
            const res = await axios.get('/api/tasks', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks(res.data);
        } catch (err) {
            console.error("Failed to fetch tasks");
        }
    };

    const addTask = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/tasks', { title, category }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTitle('');
            fetchTasks();
        } catch (err) {
            alert("Error adding task");
        }
    };

    const toggleComplete = async (id) => {
        try {
            await axios.put(`/api/tasks/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchTasks();
        } catch (err) {
            alert("Failed to update task");
        }
    };

    const deleteTask = async (id) => {
        try {
            await axios.delete(`/api/tasks/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchTasks();
        } catch (err) {
            alert("Failed to delete task");
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="dashboard-content">
            <nav>
                <Link to="/dashboard" className="active">Dashboard</Link>
                <a href="#" onClick={(e) => { e.preventDefault(); logout(); }}>Logout</a>
            </nav>

            {/* Statistics Dashboard */}
            <div className="stats-container">
                <div className="stat-card stat-pending">
                    Pending: {tasks.filter(t => !t.completed).length}
                </div>
                <div className="stat-card stat-completed">
                    Completed: {tasks.filter(t => t.completed).length}
                </div>
            </div>
            
            <form onSubmit={addTask} className="input-group">
                <input 
                    type="text" 
                    placeholder="What's your next task?" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <div style={{ display: 'flex', gap: '10px' }}>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} style={{flex: 1}}>
                        <option value="General">General</option>
                        <option value="Work">Work</option>
                        <option value="Personal">Personal</option>
                        <option value="Urgent">Urgent</option>
                    </select>
                    <button type="submit" style={{flex: 1}}>Add Task</button>
                </div>
            </form>

            <div className="items-container">
                {tasks.length === 0 ? (
                    <div className="empty-state">
                        <p>Your list is empty. Relax!</p>
                    </div>
                ) : (
                    tasks.map((task) => (
                        <li key={task._id}>
                            <div className="item-content">
                                <input 
                                    type="checkbox" 
                                    className="item-checkbox" 
                                    checked={task.completed}
                                    onChange={() => toggleComplete(task._id)}
                                />
                                <span className={`item-text ${task.completed ? 'completed' : ''}`}>
                                    {task.title} <small>({task.category})</small>
                                </span>
                            </div>
                            <button className="delete-btn" onClick={() => deleteTask(task._id)}>Delete</button>
                        </li>
                    ))
                )}
            </div>
        </div>
    );
};

export default Dashboard;