import { useEffect, useState } from "react";
import "../css/Expenses.css";
import Sidebar from "./Sidebar";
import { toast } from "react-toastify";


function Expenses() {
    const [showModal, setShowModal] = useState(false);
const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
const [deleteId, setDeleteId] = useState(null);
    const [editId, setEditId] = useState("");

    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("Food");
    const [amount, setAmount] = useState("");
    const [payment, setPayment] = useState("UPI");
    const [date, setDate] = useState("");

    const [expenses, setExpenses] = useState([]);

    // ---- Filter states ----
    const [searchText, setSearchText] = useState("");
    const [filterCategory, setFilterCategory] = useState("All");
    const [filterPayment, setFilterPayment] = useState("All");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const fetchExpenses = () => {

        fetch("http://localhost:5000/expenses", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
        
            .then((res) => res.json())
            .then((data) => {
                setExpenses(data);
            })
            .catch((error) => {
                console.log(error);
                toast.error("Unable to load expenses");
            });

    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    const confirmDeleteExpense = (id) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
};

const handleDelete = async () => {

    try {

        const response = await fetch(
            `http://localhost:5000/expense/${deleteId}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );

        const data = await response.json();

        if (response.ok) {

            toast.success(data.message);

            fetchExpenses();

        } else {

            toast.error(data.message);

        }

    } catch (error) {

        console.log(error);

        toast.error("Unable to connect to server");

    } finally {

        setShowDeleteConfirm(false);
        setDeleteId(null);

    }

};

    const handleEdit = (expense) => {

        setEditId(expense._id);
        setTitle(expense.title);
        setCategory(expense.category);
        setAmount(expense.amount);
        setPayment(expense.payment);
        setDate(expense.date.slice(0, 10));

        setShowModal(true);

    };

    const handleUpdate = async () => {

        if (
            title === "" ||
            amount === "" ||
            category === "" ||
            payment === "" ||
            date === ""
        ) {
            toast.error("Please fill all fields");
            return;
        }

        try {

            const response = await fetch(
                `http://localhost:5000/expense/${editId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({
                        title,
                        category,
                        amount,
                        payment,
                        date,
                    }),
                }
            );

            const data = await response.json();

            if (response.ok) {

                toast.success(data.message);
                setShowModal(false);
                fetchExpenses();

            } else {

                toast.error(data.message);

            }

        } catch (error) {

            console.log(error);
            toast.error("Unable to connect to server");

        }

    };

    const clearFilters = () => {
        setSearchText("");
        setFilterCategory("All");
        setFilterPayment("All");
        setFromDate("");
        setToDate("");
    };

    // ---- Apply all filters together ----
    const filteredExpenses = expenses.filter((expense) => {

        const matchesSearch = expense.title
            .toLowerCase()
            .includes(searchText.toLowerCase());

        const matchesCategory =
            filterCategory === "All" || expense.category === filterCategory;

        const matchesPayment =
            filterPayment === "All" || expense.payment === filterPayment;

        const expenseDate = new Date(expense.date);

        const matchesFrom = fromDate === "" || expenseDate >= new Date(fromDate);
        const matchesTo = toDate === "" || expenseDate <= new Date(toDate);

        return (
            matchesSearch &&
            matchesCategory &&
            matchesPayment &&
            matchesFrom &&
            matchesTo
        );

    });

    const totalExpense = filteredExpenses.reduce(
        (sum, item) => sum + Number(item.amount),
        0
    );

    return (

        <div className="expenses-page">
            <Sidebar />

            <div className="expenses-header">

                <h1>My Expenses</h1>

                <input
                    type="text"
                    placeholder="Search Expenses..."
                    className="search-box"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />

            </div>

            <div className="filters-bar">

                <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                >
                    <option value="All">All Categories</option>
                    <option value="Food">Food</option>
                    <option value="Travel">Travel</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Fuel">Fuel</option>
                    <option value="Others">Others</option>
                </select>

                <select
                    value={filterPayment}
                    onChange={(e) => setFilterPayment(e.target.value)}
                >
                    <option value="All">All Payment Types</option>
                    <option value="UPI">UPI</option>
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                </select>

                <div className="date-range">
                    <label>From</label>
                    <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                    />
                </div>

                <div className="date-range">
                    <label>To</label>
                    <input
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                    />
                </div>

                <button className="clear-filters-btn" onClick={clearFilters}>
                    Clear Filters
                </button>

            </div>

            <div className="summary-card">

                <h3>Total Expenses</h3>

                <h2>₹{totalExpense}</h2>

            </div>

            <div className="table-container">

                <table>

                    <thead>

                        <tr>
                            <th>Date</th>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Amount</th>
                            <th>Payment</th>
                            <th>Action</th>
                        </tr>

                    </thead>

                    <tbody>

                        {filteredExpenses.length > 0 ? (

                            filteredExpenses.map((expense) => (

                                <tr key={expense._id}>

                                    <td>
                                        {new Date(expense.date).toLocaleDateString()}
                                    </td>

                                    <td>
                                        {expense.title}
                                    </td>

                                    <td>

                                        <span
                                            className={`badge ${expense.category.toLowerCase()}`}
                                        >
                                            {expense.category}
                                        </span>

                                    </td>

                                    <td className="amount">
                                        ₹{expense.amount}
                                    </td>

                                    <td>
                                        {expense.payment}
                                    </td>

                                    <td>

                                        <button
                                            className="action-btn edit"
                                            onClick={() => handleEdit(expense)}
                                        >
                                            ✏ Edit
                                        </button>

                                        <button
    className="action-btn delete"
    onClick={() => confirmDeleteExpense(expense._id)}   // ✅ sahi
>
    🗑 Delete
</button>

                                    </td>

                                </tr>

                            ))

                        ) : (

                            <tr>

                                <td colSpan="6" className="no-data">
                                    No Expenses Found
                                </td>

                            </tr>

                        )}

                    </tbody>

                </table>

            </div>

            {
                showModal && (

                    <div className="modal-overlay">

                        <div className="modal">

                            <h2>Edit Expense</h2>

                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />

                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />

                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option>Food</option>
                                <option>Travel</option>
                                <option>Shopping</option>
                                <option>Fuel</option>
                                <option>Others</option>
                            </select>

                            <select
                                value={payment}
                                onChange={(e) => setPayment(e.target.value)}
                            >
                                <option>UPI</option>
                                <option>Cash</option>
                                <option>Card</option>
                            </select>

                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />

                            <div className="modal-buttons">

                                <button onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>

                                <button onClick={handleUpdate}>
                                    Update
                                </button>

                            </div>

                        </div>

                    </div>

                )
            }
            {
    showDeleteConfirm && (

        <div className="modal-overlay">

            <div className="confirm-modal">

                <div className="confirm-icon">🗑️</div>

                <h2>Delete Expense?</h2>

                <p>This action cannot be undone. Are you sure you want to delete this expense?</p>

                <div className="modal-buttons">

                    <button
                        className="cancel-btn"
                        onClick={() => {
                            setShowDeleteConfirm(false);
                            setDeleteId(null);
                        }}
                    >
                        Cancel
                    </button>

                    <button className="confirm-delete-btn" onClick={handleDelete}>
                        Yes, Delete
                    </button>

                </div>

            </div>

        </div>

    )
}

        </div>

    );

}

export default Expenses;