import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import "../css/Income.css";

function Income() {

    const [income, setIncome] = useState([]);

    const [showModal, setShowModal] = useState(false);

    const [source, setSource] = useState("");
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState("");

    // Fetch Income
    const fetchIncome = () => {

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

    };

    useEffect(() => {
        fetchIncome();
    }, []);

    // Add Income
    const handleAddIncome = async () => {

        if (source === "" || amount === "" || date === "") {
            alert("Please fill all fields");
            return;
        }

        try {

            const response = await fetch(
                "http://localhost:5000/add-income",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },

                    body: JSON.stringify({
                        source,
                        amount,
                        date,
                    }),
                }
            );

            const data = await response.json();

            alert(data.message);

            if (response.ok) {

                setSource("");
                setAmount("");
                setDate("");

                setShowModal(false);

                fetchIncome();

            }

        } catch (error) {

            console.log(error);

        }

    };

    const totalIncome = income.reduce(
        (sum, item) => sum + Number(item.amount),
        0
    );

    return (

        <div className="income-page">
<Sidebar />
            

            <div className="income-content">

                <div className="income-header">

                    <div>

                        <h1>Income</h1>

                        <p>Manage all your income here.</p>

                    </div>

                    <button
                        className="add-income-btn"
                        onClick={() => setShowModal(true)}
                    >
                        + Add Income
                    </button>

                </div>

                <div className="income-card">

                    <h3>Total Income</h3>

                    <h2>₹{totalIncome}</h2>

                </div>

                <div className="income-table">

                    <table>

                        <thead>

                            <tr>

                                <th>Date</th>
                                <th>Source</th>
                                <th>Amount</th>

                            </tr>

                        </thead>

                        <tbody>

                            {
                                income.map((item) => (

                                    <tr key={item._id}>

                                        <td>
                                            {new Date(item.date).toLocaleDateString()}
                                        </td>

                                        <td>{item.source}</td>

                                        <td>₹{item.amount}</td>

                                    </tr>

                                ))
                            }

                        </tbody>

                    </table>

                </div>

            </div>

            {
                showModal && (

                    <div className="modal-overlay">

                        <div className="modal">

                            <h2>Add Income</h2>

                            <input
                                type="text"
                                placeholder="Income Source"
                                value={source}
                                onChange={(e) => setSource(e.target.value)}
                            />

                            <input
                                type="number"
                                placeholder="Amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />

                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />

                            <div className="modal-buttons">

                                <button
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={handleAddIncome}
                                >
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

export default Income;