import Sidebar from "./Sidebar";
import "../css/Analytics.css";
import { useEffect, useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";
import {
    PieChart,
    Pie,
    Cell,
    Legend
} from "recharts";
import {
    BarChart,
    Bar
} from "recharts";
function Analytics() {
    const [expenses, setExpenses] = useState([]);
const [income, setIncome] = useState([]);
    const data = [
    { month: "Jan", expense: 4000 },
    { month: "Feb", expense: 3200 },
    { month: "Mar", expense: 5100 },
    { month: "Apr", expense: 2800 },
    { month: "May", expense: 6500 },
    { month: "Jun", expense: 4300 },
];

const COLORS = [
    "#2563eb",
    "#22c55e",
    "#f59e0b",
    "#ef4444"
];

useEffect(() => {

    fetch("https://expense-manager-h6zo.onrender.com/expenses", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    })
    .then(res => res.json())
    .then(data => {
        setExpenses(Array.isArray(data) ? data : []);
    })
    .catch(err => console.log(err));

    fetch("https://expense-manager-h6zo.onrender.com/income", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    })
    .then(res => res.json())
    .then(data => {
        setIncome(Array.isArray(data) ? data : []);
    })
    .catch(err => console.log(err));

}, []);


console.log(expenses);
console.log(income);
const monthlyExpenses = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
].map(month => ({
  month,
  expense: 0,
}));
expenses.forEach((item) => {

    const monthIndex = new Date(item.date).getMonth();

    monthlyExpenses[monthIndex].expense += Number(item.amount);

});
const categoryTotals = {};
expenses.forEach((item) => {

    if (categoryTotals[item.category]) {

        categoryTotals[item.category] += Number(item.amount);

    } else {

        categoryTotals[item.category] = Number(item.amount);

    }

});
const categoryData = Object.keys(categoryTotals).map((category) => ({

    name: category,

    value: categoryTotals[category]

}));
const incomeExpenseData = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
].map(month => ({
    month,
    income: 0,
    expense: 0
}));
income.forEach(item => {

    const monthIndex = new Date(item.date).getMonth();

    incomeExpenseData[monthIndex].income += Number(item.amount);

});
expenses.forEach(item => {

    const monthIndex = new Date(item.date).getMonth();

    incomeExpenseData[monthIndex].expense += Number(item.amount);

});

    return (

       <div className="analytics-page">
<Sidebar />
    <div className="analytics-content">

        <h1>📊 Analytics</h1>

        {/* Line Chart */}
        <div className="chart-container">

            <h2>Monthly Expenses</h2>

            <ResponsiveContainer width="100%" height={350}>

              <LineChart data={monthlyExpenses}>

                    <CartesianGrid strokeDasharray="3 3"/>

                    <XAxis dataKey="month"/>

                    <YAxis/>

                    <Tooltip/>

                    <Line
                        type="monotone"
                        dataKey="expense"
                        stroke="#2563eb"
                        strokeWidth={3}
                    />

                </LineChart>

            </ResponsiveContainer>

        </div>



        {/* Pie Chart */}

        <div className="pie-container">

            <h2>Expense by Category</h2>

            <ResponsiveContainer width="100%" height={350}>

                <PieChart>

                    <Pie
                        data={categoryData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={120}
                        label
                    >

                        {categoryData.map((entry,index)=>(

                            <Cell
                                key={index}
                                fill={COLORS[index]}
                            />

                        ))}

                    </Pie>

                    <Tooltip/>

                    <Legend/>

                </PieChart>

            </ResponsiveContainer>

        </div>



        {/* Bar Chart */}

        <div className="bar-container">

            <h2>Income vs Expense</h2>

            <ResponsiveContainer width="100%" height={350}>

                <BarChart data={incomeExpenseData}>

                    <CartesianGrid strokeDasharray="3 3"/>

                    <XAxis dataKey="month"/>

                    <YAxis/>

                    <Tooltip/>

                    <Legend/>

                    <Bar
                        dataKey="income"
                        fill="#22c55e"
                        radius={[8,8,0,0]}
                    />

                    <Bar
                        dataKey="expense"
                        fill="#ef4444"
                        radius={[8,8,0,0]}
                    />

                </BarChart>

            </ResponsiveContainer>

        </div>

    </div>

</div>
    );

}

export default Analytics;