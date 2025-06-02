"use client"
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Plus, CheckCircle2, Clock, AlertCircle, User, LogOut, Edit3, Trash2, X } from 'lucide-react';

// IndexedDB utility functions
const openDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('TaskBoardDB', 1);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('tasks')) {
                const store = db.createObjectStore('tasks', { keyPath: 'id' });
                store.createIndex('userAddress', 'userAddress', { unique: false });
            }
            if (!db.objectStoreNames.contains('users')) {
                db.createObjectStore('users', { keyPath: 'address' });
            }
        };
    });
};

const saveTask = async (task) => {
    const db = await openDB();
    const transaction = db.transaction(['tasks'], 'readwrite');
    const store = transaction.objectStore('tasks');
    return store.put(task);
};

const getTasks = async (userAddress) => {
    const db = await openDB();
    const transaction = db.transaction(['tasks'], 'readonly');
    const store = transaction.objectStore('tasks');
    const index = store.index('userAddress');
    return new Promise((resolve) => {
        const request = index.getAll(userAddress);
        request.onsuccess = () => resolve(request.result || []);
    });
};

const deleteTask = async (taskId) => {
    const db = await openDB();
    const transaction = db.transaction(['tasks'], 'readwrite');
    const store = transaction.objectStore('tasks');
    return store.delete(taskId);
};

const saveUser = async (user) => {
    const db = await openDB();
    const transaction = db.transaction(['users'], 'readwrite');
    const store = transaction.objectStore('users');
    return store.put(user);
};

const getUser = async (address) => {
    const db = await openDB();
    const transaction = db.transaction(['users'], 'readonly');
    const store = transaction.objectStore('users');
    return new Promise((resolve) => {
        const request = store.get(address);
        request.onsuccess = () => resolve(request.result);
    });
};

// Random profile picture API
const getRandomProfilePic = async () => {
    const randomId = Math.floor(Math.random() * 1000);
    try {
        const response = await fetch(`https://picsum.photos/id/${randomId}/info`);
        const data = await response.json();
        return `https://picsum.photos/id/${randomId}/150/150`;
    } catch (error) {
        return `https://picsum.photos/150/150?random=${randomId}`;
    }
};

const TaskBoard = () => {
    const [user, setUser] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [isConnecting, setIsConnecting] = useState(false);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [taskForm, setTaskForm] = useState({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium'
    });

    useEffect(() => {
        checkConnection();
    }, []);

    useEffect(() => {
        if (user) {
            loadTasks();
        }
    }, [user]);

    const checkConnection = async () => {
        if (typeof window !== 'undefined' && window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                if (accounts.length > 0) {
                    await connectWallet();
                }
            } catch (error) {
                console.error('Error checking connection:', error);
            }
        }
    };

    const connectWallet = async () => {
        setIsConnecting(true);
        try {
            if (!window.ethereum) {
                alert('Please install MetaMask or another Web3 wallet');
                return;
            }

            const provider = new ethers.BrowserProvider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = await provider.getSigner();
            const address = await signer.getAddress();

            let userData = await getUser(address);
            if (!userData) {
                const profilePic = await getRandomProfilePic();
                userData = {
                    address,
                    profilePic,
                    joinedAt: new Date().toISOString()
                };
                await saveUser(userData);
            }

            setUser(userData);
        } catch (error) {
            console.error('Error connecting wallet:', error);
            alert('Failed to connect wallet');
        } finally {
            setIsConnecting(false);
        }
    };

    const disconnectWallet = () => {
        setUser(null);
        setTasks([]);
    };

    const loadTasks = async () => {
        if (user) {
            const userTasks = await getTasks(user.address);
            setTasks(userTasks);
        }
    };

    const handleSubmitTask = async () => {
        if (!taskForm.title.trim()) return;

        const task = {
            id: editingTask ? editingTask.id : Date.now().toString(),
            ...taskForm,
            userAddress: user.address,
            createdAt: editingTask ? editingTask.createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        await saveTask(task);
        await loadTasks();
        resetTaskForm();
    };

    const resetTaskForm = () => {
        setTaskForm({ title: '', description: '', status: 'todo', priority: 'medium' });
        setEditingTask(null);
        setShowTaskModal(false);
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
        setTaskForm({
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority
        });
        setShowTaskModal(true);
    };

    const handleDeleteTask = async (taskId) => {
        if (confirm('Are you sure you want to delete this task?')) {
            await deleteTask(taskId);
            await loadTasks();
        }
    };

    const updateTaskStatus = async (taskId, newStatus) => {
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            const updatedTask = { ...task, status: newStatus, updatedAt: new Date().toISOString() };
            await saveTask(updatedTask);
            await loadTasks();
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
            case 'in-progress': return <Clock className="w-5 h-5 text-blue-500" />;
            default: return <AlertCircle className="w-5 h-5 text-gray-500" />;
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'border-l-red-500 bg-red-50';
            case 'medium': return 'border-l-yellow-500 bg-yellow-50';
            case 'low': return 'border-l-green-500 bg-green-50';
            default: return 'border-l-gray-500 bg-gray-50';
        }
    };

    const tasksByStatus = {
        todo: tasks.filter(t => t.status === 'todo'),
        'in-progress': tasks.filter(t => t.status === 'in-progress'),
        completed: tasks.filter(t => t.status === 'completed')
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
                    <div className="max-w-md w-full space-y-8 text-center">
                        <div className="space-y-4">
                            <div className="w-24 h-24 mx-auto bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <CheckCircle2 className="w-12 h-12 text-white" />
                            </div>
                            <h1 className="text-4xl font-bold text-white">TaskBoard</h1>
                            <p className="text-xl text-blue-100">Manage your tasks with Web3 authentication</p>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                                <h2 className="text-xl font-semibold text-white mb-4">Connect Your Wallet</h2>
                                <p className="text-blue-100 mb-6">Sign in with your Web3 wallet to start managing your tasks securely on the blockchain.</p>

                                <button
                                    onClick={connectWallet}
                                    disabled={isConnecting}
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                                >
                                    {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                                </button>
                            </div>

                            <div className="text-sm text-blue-200">
                                <p>✨ Secure Web3 authentication</p>
                                <p>🔒 Your data stays with you</p>
                                <p>🚀 Modern task management</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-4">
                            <CheckCircle2 className="w-8 h-8 text-blue-600" />
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                TaskBoard
                            </h1>
                        </div>

                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setShowTaskModal(true)}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 shadow-lg"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Add Task</span>
                            </button>

                            <div className="flex items-center space-x-3">
                                <img
                                    src={user.profilePic}
                                    alt="Profile"
                                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-lg"
                                />
                                <div className="hidden sm:block">
                                    <p className="text-sm font-medium text-gray-900">
                                        {user.address.slice(0, 6)}...{user.address.slice(-4)}
                                    </p>
                                </div>
                                <button
                                    onClick={disconnectWallet}
                                    className="text-gray-500 hover:text-red-600 transition-colors"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Todo Column */}
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                                <AlertCircle className="w-5 h-5 text-gray-500 mr-2" />
                                To Do ({tasksByStatus.todo.length})
                            </h2>
                        </div>
                        <div className="space-y-4">
                            {tasksByStatus.todo.map((task) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onEdit={handleEditTask}
                                    onDelete={handleDeleteTask}
                                    onStatusChange={updateTaskStatus}
                                />
                            ))}
                        </div>
                    </div>

                    {/* In Progress Column */}
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                                <Clock className="w-5 h-5 text-blue-500 mr-2" />
                                In Progress ({tasksByStatus['in-progress'].length})
                            </h2>
                        </div>
                        <div className="space-y-4">
                            {tasksByStatus['in-progress'].map((task) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onEdit={handleEditTask}
                                    onDelete={handleDeleteTask}
                                    onStatusChange={updateTaskStatus}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Completed Column */}
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                                <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                                Completed ({tasksByStatus.completed.length})
                            </h2>
                        </div>
                        <div className="space-y-4">
                            {tasksByStatus.completed.map((task) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onEdit={handleEditTask}
                                    onDelete={handleDeleteTask}
                                    onStatusChange={updateTaskStatus}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            {/* Task Modal */}
            {showTaskModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-900">
                                {editingTask ? 'Edit Task' : 'Add New Task'}
                            </h3>
                            <button
                                onClick={resetTaskForm}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Task Title
                                </label>
                                <input
                                    type="text"
                                    value={taskForm.title}
                                    onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter task title..."
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={taskForm.description}
                                    onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter task description..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Status
                                    </label>
                                    <select
                                        value={taskForm.status}
                                        onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="todo">To Do</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Priority
                                    </label>
                                    <select
                                        value={taskForm.priority}
                                        onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={resetTaskForm}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSubmitTask}
                                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                                >
                                    {editingTask ? 'Update Task' : 'Add Task'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
    return (
        <div className={`bg-white rounded-xl p-4 border-l-4 shadow-sm hover:shadow-md transition-all duration-200 ${getPriorityColor(task.priority)}`}>
            <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 text-sm">{task.title}</h3>
                <div className="flex space-x-1">
                    <button
                        onClick={() => onEdit(task)}
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                    >
                        <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onDelete(task.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {task.description && (
                <p className="text-gray-600 text-sm mb-3">{task.description}</p>
            )}

            <div className="flex items-center justify-between">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${task.priority === 'high' ? 'bg-red-100 text-red-800' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                    }`}>
                    {task.priority}
                </span>

                <select
                    value={task.status}
                    onChange={(e) => onStatusChange(task.id, e.target.value)}
                    className="text-xs border border-gray-300 rounded px-2 py-1 bg-white"
                >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                </select>
            </div>
        </div>
    );
};

const getPriorityColor = (priority) => {
    switch (priority) {
        case 'high': return 'border-l-red-500';
        case 'medium': return 'border-l-yellow-500';
        case 'low': return 'border-l-green-500';
        default: return 'border-l-gray-500';
    }
};

export default TaskBoard;