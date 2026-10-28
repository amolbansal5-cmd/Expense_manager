import Sidebar from "./component/Sidebar";
import "./Dashboard.css";
import { toast } from "react-toastify";

import { useState, useEffect, useMemo } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";

function Dashboard() {
    const [expenses, setExpenses] = useState([]);
    const [income, setIncome] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("Food");
    const [payment, setPayment] = useState("UPI");
    const [date, setDate] = useState("");

    const [chartRange, setChartRange] = useState("This Month");

    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetch("http://localhost:5000/income", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then(res => res.json())
            .then(data => {
                setIncome(data);
            })
            .catch(err => console.log(err));

        fetch("http://localhost:5000/expenses", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then(res => res.json())
            .then(data => {
                setExpenses(data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    const validateForm = () => {

        const newErrors = {};

        if (title.trim() === "") {
            newErrors.title = "Title is required";
        }

        if (amount === "") {
            newErrors.amount = "Amount is required";
        } else if (Number(amount) <= 0) {
            newErrors.amount = "Amount must be greater than 0";
        }

        if (category === "") {
            newErrors.category = "Please select a category";
        }

        if (payment === "") {
            newErrors.payment = "Please select a payment method";
        }

        if (date === "") {
            newErrors.date = "Date is required";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;

    };

    const handleSaveExpense = async () => {

        if (!validateForm()) {
            return;
        }

        try {

            const response = await fetch("http://localhost:5000/add-expense", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },

                body: JSON.stringify({
                    title,
                    amount,
                    category,
                    payment,
                    date,
                }),

            });

            const data = await response.json();

            if (response.ok) {

                toast.success(data.message);

                setTitle("");
                setAmount("");
                setCategory("Food");
                setPayment("UPI");
                setDate("");
                setErrors({});

                setShowModal(false);

            } else {

                toast.error(data.message);

            }

        } catch (error) {

            console.log(error);
            toast.error("Unable to connect to server");

        }

    };

    const closeModal = () => {
        setShowModal(false);
        setErrors({});
    };

    const totalExpense = expenses.reduce(
        (sum, item) => sum + Number(item.amount),
        0
    );

    const totalIncome = income.reduce(
        (sum, item) => sum + Number(item.amount),
        0
    );

    const balance = totalIncome - totalExpense;

    const thisMonthExpense = expenses.filter((item) => {

        const expenseDate = new Date(item.date);
        const today = new Date();

        return (
            expenseDate.getMonth() === today.getMonth() &&
            expenseDate.getFullYear() === today.getFullYear()
        );

    });

    const totalThisMonth = thisMonthExpense.reduce(
        (sum, item) => sum + Number(item.amount),
        0
    );

    const chartData = useMemo(() => {

        const today = new Date();

        if (chartRange === "This Year") {

            const months = [
                "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ];

            const yearData = months.map((month) => ({
                label: month,
                income: 0,
                expense: 0
            }));

            income.forEach((item) => {
                const d = new Date(item.date);
                if (d.getFullYear() === today.getFullYear()) {
                    yearData[d.getMonth()].income += Number(item.amount);
                }
            });

            expenses.forEach((item) => {
                const d = new Date(item.date);
                if (d.getFullYear() === today.getFullYear()) {
                    yearData[d.getMonth()].expense += Number(item.amount);
                }
            });

            return yearData;

        }

        let targetMonth = today.getMonth();
        let targetYear = today.getFullYear();

        if (chartRange === "Last Month") {
            targetMonth = targetMonth === 0 ? 11 : targetMonth - 1;
            targetYear = targetMonth === 11 ? targetYear - 1 : targetYear;
        }

        const daysInMonth = new Date(targetYear, targetMonth + 1, 0).getDate();

        const dayData = Array.from({ length: daysInMonth }, (_, i) => ({
            label: `${i + 1}`,
            income: 0,
            expense: 0
        }));

        income.forEach((item) => {
            const d = new Date(item.date);
            if (d.getMonth() === targetMonth && d.getFullYear() === targetYear) {
                dayData[d.getDate() - 1].income += Number(item.amount);
            }
        });

        expenses.forEach((item) => {
            const d = new Date(item.date);
            if (d.getMonth() === targetMonth && d.getFullYear() === targetYear) {
                dayData[d.getDate() - 1].expense += Number(item.amount);
            }
        });

        return dayData;

    }, [chartRange, income, expenses]);

    return (
        <div className="dashboard">

            <Sidebar />

            <div className="main-content">

                <div className="header">

                    <div className="welcome">

                        <h1>👋 Welcome Back</h1>

                        <p>
                            Manage your finances, track your expenses and grow your savings.
                        </p>

                    </div>

                    <div className="header-right">

                        <button
                            className="add-btn"
                            onClick={() => setShowModal(true)}
                        >
                            + Add Expense
                        </button>

                    </div>

                </div>

                <div className="cards">

                    <div className="card income-card">
                        <span>💰</span>
                        <h3>Total Income</h3>
                        <h2>₹{totalIncome}</h2>
                    </div>

                    <div className="card expense-card">
                        <span>💸</span>
                        <h3>Total Expense</h3>
                        <h2>₹{totalExpense}</h2>
                    </div>

                    <div className="card balance-card">
                        <span>⚖️</span>
                        <h3>Balance</h3>
                        <h2>₹{balance}</h2>
                    </div>

                    <div className="card month-card">
                        <span>📅</span>
                        <h3>This Month</h3>
                        <h2>₹{totalThisMonth}</h2>
                    </div>

                </div>

                <div className="chart-box">

                    <div className="chart-header">
                        <h2>Expense Analytics</h2>

                        <select
                            value={chartRange}
                            onChange={(e) => setChartRange(e.target.value)}
                        >
                            <option>This Month</option>
                            <option>Last Month</option>
                            <option>This Year</option>
                        </select>

                    </div>

                    <ResponsiveContainer width="100%" height={320}>

                        <LineChart data={chartData}>

                            <CartesianGrid strokeDasharray="3 3" />

                            <XAxis dataKey="label" />

                            <YAxis />

                            <Tooltip />

                            <Legend />

                            <Line
                                type="monotone"
                                dataKey="income"
                                name="Income"
                                stroke="#22c55e"
                                strokeWidth={2}
                                dot={false}
                            />

                            <Line
                                type="monotone"
                                dataKey="expense"
                                name="Expense"
                                stroke="#ef4444"
                                strokeWidth={2}
                                dot={false}
                            />

                        </LineChart>

                    </ResponsiveContainer>

                </div>

                <div className="table-box">

                    <h2>Recent Expenses</h2>

                    <table>

                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Category</th>
                                <th>Amount</th>
                                <th>Payment</th>
                            </tr>
                        </thead>

                        <tbody>

                            {expenses.length > 0 ? (

                                [...expenses]
                                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                                    .slice(0, 5)
                                    .map((item) => (

                                        <tr key={item._id}>
                                            <td>{new Date(item.date).toLocaleDateString()}</td>
                                            <td>{item.category}</td>
                                            <td>₹{item.amount}</td>
                                            <td>{item.payment}</td>
                                        </tr>

                                    ))

                            ) : (

                                <tr>
                                    <td colSpan="4" style={{ textAlign: "center", padding: "30px" }}>
                                        No Expenses Yet
                                    </td>
                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

            {
                showModal && (

                    <div className="modal-overlay">

                        <div className="modal">

                            <h2>Add Expense</h2>

                            <div className="form-group">
                                <input
                                    type="text"
                                    placeholder={errors.title ? errors.title : "Expense Title"}
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className={errors.title ? "input-error" : ""}
                                />
                            </div>

                            <div className="form-group">
                                <input
                                    type="number"
                                    placeholder={errors.amount ? errors.amount : "Amount"}
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className={errors.amount ? "input-error" : ""}
                                />
                            </div>

                            <div className="form-group">
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className={errors.category ? "input-error" : ""}
                                >
                                    <option>Food</option>
                                    <option>Travel</option>
                                    <option>Shopping</option>
                                    <option>Fuel</option>
                                    <option>Others</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <select
                                    value={payment}
                                    onChange={(e) => setPayment(e.target.value)}
                                    className={errors.payment ? "input-error" : ""}
                                >
                                    <option>UPI</option>
                                    <option>Cash</option>
                                    <option>Card</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className={errors.date ? "input-error" : ""}
                                />
                            </div>

                            <div className="modal-buttons">

                                <button onClick={closeModal}>
                                    Cancel
                                </button>

                                <button onClick={handleSaveExpense}>
                                    Save
                                </button>

                            </div>

                        </div>

                    </div>

                )
            }

        </div>
    );
}

export default Dashboard;