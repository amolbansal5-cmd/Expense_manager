
import Sidebar from "./Sidebar";
import "../css/UserManagement.css";
import { toast } from "react-toastify";
import { useState, useEffect, useRef } from "react";

const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Andaman and Nicobar Islands", "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu", "Delhi",
    "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

function UserManagement() {
    // Edit popup ke liye alag states
const [showEditPopup, setShowEditPopup] = useState(false);
const [editUserId, setEditUserId] = useState(null);

const [editFirstName, setEditFirstName] = useState("");
const [editLastName, setEditLastName] = useState("");
const [editEmail, setEditEmail] = useState("");
const [editDob, setEditDob] = useState("");
const [editState, setEditState] = useState("");
const [editCity, setEditCity] = useState("");
const [editUserType, setEditUserType] = useState("");

const [editCityList, setEditCityList] = useState([]);
const [editLoadingCities, setEditLoadingCities] = useState(false);
const [editErrors, setEditErrors] = useState({});

// Jab edit popup khulta hai to state set hote hi city reset na ho,
// isliye purani city ko "pending" rakhte hain
const pendingEditCityRef = useRef(null);
const [users, setUsers] = useState([]);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [dob, setDob] = useState("");
    const [state, setState] = useState("");
    const [city, setCity] = useState("");
    const [userType, setUserType] = useState("");
    const [showAddPopup, setShowAddPopup] = useState(false);

    const [cityList, setCityList] = useState([]);
    const [loadingCities, setLoadingCities] = useState(false);

    const [errors, setErrors] = useState({});

    const validateEmail = (value) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    };

    // Jab bhi state badle, uski saari cities API se fetch karo
    useEffect(() => {

        if (state === "") {
            setCityList([]);
            return;
        }

        setLoadingCities(true);
        setCity("");

        fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                country: "India",
                state: state,
            }),
        })
            .then((res) => res.json())
            .then((data) => {

                if (data.error) {
                    setCityList([]);
                    toast.error("Unable to load cities for this state");
                } else {
                    setCityList(data.data || []);
                }

            })
            .catch((error) => {
                console.log(error);
                setCityList([]);
                toast.error("Unable to load cities");
            })
            .finally(() => {
                setLoadingCities(false);
            });

    }, [state]);

    const handleStateChange = (e) => {
        setState(e.target.value);
    };
   const fetchUsers = () => {

    fetch("https://expense-manager-h6zo.onrender.com/users", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    })
        .then((res) => res.json())
        .then((data) => {
            setUsers(Array.isArray(data) ? data : []);
        })
        .catch((error) => {
            console.log(error);
            toast.error("Unable to load users");
        });

};

useEffect(() => {
    fetchUsers();
}, []);

    const validateForm = () => {

        const newErrors = {};

        if (firstName.trim() === "") {
            newErrors.firstName = "First name is required";
        }

        if (lastName.trim() === "") {
            newErrors.lastName = "Last name is required";
        }

        if (email.trim() === "") {
            newErrors.email = "Email is required";
        } else if (!validateEmail(email)) {
            newErrors.email = "Enter a valid email";
        }

        if (dob === "") {
            newErrors.dob = "Date of birth is required";
        } else {

            const dobDate = new Date(dob);
            const today = new Date();

            if (dobDate > today) {
                newErrors.dob = "DOB cannot be in the future";
            }

        }

        if (state === "") {
            newErrors.state = "Please select a state";
        }

        if (city === "") {
            newErrors.city = "Please select a city";
        }

        if (userType === "") {
            newErrors.userType = "Please select a user type";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;

    };

   const handleSubmit = () => {
    if (!validateForm()) {
        return;
    }

    const newUser = {
        firstName,
        lastName,
        email,
        dob,
        state,
        city,
        userType,
    };

    fetch("https://expense-manager-h6zo.onrender.com/add-user", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newUser),
    })
        .then((res) => {
            if (!res.ok) {
                return res.json().then((data) => {
                    throw new Error(data.message || "Unable to add user");
                });
            }
            return res.json();
        })
        .then(() => {
            toast.success("User added successfully");

            setFirstName("");
            setLastName("");
            setEmail("");
            setDob("");
            setState("");
            setCity("");
            setUserType("");
            setErrors({});
setShowAddPopup(false); 
            fetchUsers();
        })
        .catch((error) => {
            console.log(error);
            toast.error(error.message || "Unable to add user");
        });
};
const closeAddPopup = () => {
    setShowAddPopup(false);
    setFirstName("");
    setLastName("");
    setEmail("");
    setDob("");
    setState("");
    setCity("");
    setUserType("");
    setErrors({});
};
const handleDeleteEmployee = (id) => {

    const confirmed = window.confirm("Are you sure you want to delete this user?");

    if (!confirmed) {
        return;
    }

   fetch(`https://expense-manager-h6zo.onrender.com/user/${id}`, {
    method: "DELETE",
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
})
        .then((res) => {
            if (!res.ok) {
                return res.json().then((data) => {
                    throw new Error(data.message || "Unable to delete user");
                });
            }
            return res.json();
        })
        .then(() => {
            toast.success("User deleted successfully");
            fetchUsers();
        })
        .catch((error) => {
            console.log(error);
            toast.error(error.message || "Unable to delete user");
        });

};
useEffect(() => {

    if (editState === "") {
        setEditCityList([]);
        return;
    }

    setEditLoadingCities(true);

    if (!pendingEditCityRef.current) {
        setEditCity("");
    }

    fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            country: "India",
            state: editState,
        }),
    })
        .then((res) => res.json())
        .then((data) => {

            if (data.error) {
                setEditCityList([]);
                toast.error("Unable to load cities for this state");
            } else {
                const cities = data.data || [];
                setEditCityList(cities);

                if (pendingEditCityRef.current) {
                    if (cities.includes(pendingEditCityRef.current)) {
                        setEditCity(pendingEditCityRef.current);
                    }
                    pendingEditCityRef.current = null;
                }
            }

        })
        .catch((error) => {
            console.log(error);
            setEditCityList([]);
            pendingEditCityRef.current = null;
            toast.error("Unable to load cities");
        })
        .finally(() => {
            setEditLoadingCities(false);
        });

}, [editState]);
const handleEditClick = (user) => {

    setEditUserId(user._id);
    setEditFirstName(user.firstName || "");
    setEditLastName(user.lastName || "");
    setEditEmail(user.email || "");

    if (user.dob) {
        setEditDob(new Date(user.dob).toISOString().split("T")[0]);
    } else {
        setEditDob("");
    }

    // City turant set nahi karenge — state change hone par cityList fetch hoga,
    // uske baad pending city apne aap set ho jayegi
    pendingEditCityRef.current = user.city || null;
    setEditState(user.state || "");

    setEditUserType(user.userType === 0 ? "Admin" : "User");

    setEditErrors({});
    setShowEditPopup(true);
};

const closeEditPopup = () => {
    setShowEditPopup(false);
    setEditUserId(null);
    pendingEditCityRef.current = null;
};
const validateEditForm = () => {

    const newErrors = {};

    if (editFirstName.trim() === "") newErrors.firstName = "First name is required";
    if (editLastName.trim() === "") newErrors.lastName = "Last name is required";

    if (editEmail.trim() === "") {
        newErrors.email = "Email is required";
    } else if (!validateEmail(editEmail)) {
        newErrors.email = "Enter a valid email";
    }

    if (editDob === "") {
        newErrors.dob = "Date of birth is required";
    } else if (new Date(editDob) > new Date()) {
        newErrors.dob = "DOB cannot be in the future";
    }

    if (editState === "") newErrors.state = "Please select a state";
    if (editCity === "") newErrors.city = "Please select a city";
    if (editUserType === "") newErrors.userType = "Please select a user type";

    setEditErrors(newErrors);
    return Object.keys(newErrors).length === 0;
};

const handleUpdateSubmit = () => {

    if (!validateEditForm()) {
        return;
    }

    const updatedUser = {
        firstName: editFirstName,
        lastName: editLastName,
        email: editEmail,
        dob: editDob,
        state: editState,
        city: editCity,
        userType: editUserType,
    };

   fetch(`https://expense-manager-h6zo.onrender.com/user/${editUserId}`, {
    method: "PUT",
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(updatedUser),
})
        .then((res) => {
            if (!res.ok) {
                return res.json().then((data) => {
                    throw new Error(data.message || "Unable to update user");
                });
            }
            return res.json();
        })
        .then(() => {
            toast.success("User updated successfully");
            closeEditPopup();
            fetchUsers();
        })
        .catch((error) => {
            console.log(error);
            toast.error(error.message || "Unable to update user");
        });
};
    return (

        <div className="user-management-page">

            <Sidebar />

            <div className="user-management-content">

               
             <div className="table-header-actions">
    <button className="refresh-btn" onClick={fetchUsers}>
        🔄 Refresh
    </button>
    <button className="add-user-btn" onClick={() => setShowAddPopup(true)}>
        + Add User
    </button>
</div>
               
                <div className="users-table-section">

    <h2>All Users ({users.length})</h2>

    <div className="users-table-container">

        <table>

            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>DOB</th>
                    <th>State</th>
                    <th>City</th>
                    <th>Type</th>
                </tr>
            </thead>

            <tbody>

                {users.length > 0 ? (

                    users.map((user) => (

                        <tr key={user._id}>

                            <td>{user.firstName} {user.lastName}</td>

                            <td>{user.email}</td>

                            <td>{new Date(user.dob).toLocaleDateString()}</td>

                            <td>{user.state}</td>

                            <td>{user.city}</td>

                            <td>
                                <span
                                    className={`type-badge ${user.userType === 0 ? "admin" : "user"}`}
                                >
                                    {user.userType === 0 ? "Admin" : "User"}
                                </span>
                            </td>
                           <td>
    <div className="table-actions">
        <button className="action-btn edit-btn" onClick={() => handleEditClick(user)}>
            ✏ Edit
        </button>
        <button className="action-btn delete-btn" onClick={() => handleDeleteEmployee(user._id)}>
            🗑 Delete
        </button>
    </div>
</td>

                        </tr>

                    ))

                ) : (

                    <tr>
                        <td colSpan="6" className="no-data">
                            No Users Added Yet
                        </td>
                    </tr>

                )}

            </tbody>

        </table>

    </div>

</div>
{showAddPopup && (
    <div
        style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
        }}
    >
        <div
            style={{
                background: "#fff",
                padding: "24px",
                borderRadius: "8px",
                width: "500px",
                maxWidth: "90%",
                maxHeight: "90vh",
                overflowY: "auto",
            }}
        >
            <h2>Add User</h2>

            <div className="form-row">
                <div className="form-group">
                    <label>First Name</label>
                    <input
                        type="text"
                        placeholder={errors.firstName ? errors.firstName : "Enter first name"}
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className={errors.firstName ? "input-error" : ""}
                    />
                </div>

                <div className="form-group">
                    <label>Last Name</label>
                    <input
                        type="text"
                        placeholder={errors.lastName ? errors.lastName : "Enter last name"}
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className={errors.lastName ? "input-error" : ""}
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        placeholder={errors.email ? errors.email : "Enter email"}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={errors.email ? "input-error" : ""}
                    />
                </div>

                <div className="form-group">
                    <label>Date of Birth</label>
                    <input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className={errors.dob ? "input-error" : ""}
                    />
                    {errors.dob && <span className="field-error">{errors.dob}</span>}
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>State</label>
                    <select
                        value={state}
                        onChange={handleStateChange}
                        className={errors.state ? "input-error" : ""}
                    >
                        <option value="">Select State</option>
                        {indianStates.map((st) => (
                            <option key={st} value={st}>{st}</option>
                        ))}
                    </select>
                    {errors.state && <span className="field-error">{errors.state}</span>}
                </div>

                <div className="form-group">
                    <label>City</label>
                    <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        disabled={!state || loadingCities}
                        className={errors.city ? "input-error" : ""}
                    >
                        <option value="">
                            {loadingCities
                                ? "Loading cities..."
                                : state
                                ? "Select City"
                                : "Select state first"}
                        </option>
                        {cityList.map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                    {errors.city && <span className="field-error">{errors.city}</span>}
                </div>
            </div>

            <div className="form-group">
                <label>User Type</label>
                <div className="radio-group">
                    <label className="radio-option">
                        <input
                            type="radio"
                            name="userType"
                            value="Admin"
                            checked={userType === "Admin"}
                            onChange={(e) => setUserType(e.target.value)}
                        />
                        Admin
                    </label>

                    <label className="radio-option">
                        <input
                            type="radio"
                            name="userType"
                            value="User"
                            checked={userType === "User"}
                            onChange={(e) => setUserType(e.target.value)}
                        />
                        User
                    </label>
                </div>
                {errors.userType && <span className="field-error">{errors.userType}</span>}
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
                <button className="submit-btn" onClick={handleSubmit}>
                    Add User
                </button>
                <button onClick={closeAddPopup}>
                    Cancel
                </button>
            </div>
        </div>
    </div>
)}

            </div>
            {showEditPopup && (
    <div
        style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
        }}
    >
        <div
            style={{
                background: "#fff",
                padding: "24px",
                borderRadius: "8px",
                width: "500px",
                maxWidth: "90%",
                maxHeight: "90vh",
                overflowY: "auto",
            }}
        >
            <h2>Edit User</h2>

            <div className="form-row">
                <div className="form-group">
                    <label>First Name</label>
                    <input
                        type="text"
                        value={editFirstName}
                        onChange={(e) => setEditFirstName(e.target.value)}
                    />
                    {editErrors.firstName && <span className="field-error">{editErrors.firstName}</span>}
                </div>

                <div className="form-group">
                    <label>Last Name</label>
                    <input
                        type="text"
                        value={editLastName}
                        onChange={(e) => setEditLastName(e.target.value)}
                    />
                    {editErrors.lastName && <span className="field-error">{editErrors.lastName}</span>}
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                    />
                    {editErrors.email && <span className="field-error">{editErrors.email}</span>}
                </div>

                <div className="form-group">
                    <label>Date of Birth</label>
                    <input
                        type="date"
                        value={editDob}
                        onChange={(e) => setEditDob(e.target.value)}
                    />
                    {editErrors.dob && <span className="field-error">{editErrors.dob}</span>}
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>State</label>
                    <select value={editState} onChange={(e) => setEditState(e.target.value)}>
                        <option value="">Select State</option>
                        {indianStates.map((st) => (
                            <option key={st} value={st}>{st}</option>
                        ))}
                    </select>
                    {editErrors.state && <span className="field-error">{editErrors.state}</span>}
                </div>

                <div className="form-group">
                    <label>City</label>
                    <select
                        value={editCity}
                        onChange={(e) => setEditCity(e.target.value)}
                        disabled={!editState || editLoadingCities}
                    >
                        <option value="">
                            {editLoadingCities ? "Loading cities..." : "Select City"}
                        </option>
                        {editCityList.map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                    {editErrors.city && <span className="field-error">{editErrors.city}</span>}
                </div>
            </div>

            <div className="form-group">
                <label>User Type</label>
                <div className="radio-group">
                    <label className="radio-option">
                        <input
                            type="radio"
                            name="editUserType"
                            value="Admin"
                            checked={editUserType === "Admin"}
                            onChange={(e) => setEditUserType(e.target.value)}
                        />
                        Admin
                    </label>

                    <label className="radio-option">
                        <input
                            type="radio"
                            name="editUserType"
                            value="User"
                            checked={editUserType === "User"}
                            onChange={(e) => setEditUserType(e.target.value)}
                        />
                        User
                    </label>
                </div>
                {editErrors.userType && <span className="field-error">{editErrors.userType}</span>}
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
                <button className="submit-btn" onClick={handleUpdateSubmit}>
                    Update User
                </button>
                <button onClick={closeEditPopup}>
                    Cancel
                </button>
            </div>
        </div>
    </div>
)}

        </div>

    );

}

export default UserManagement;