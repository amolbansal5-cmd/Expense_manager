import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import "../css/Profile.css";
import { toast } from "react-toastify";

function Profile() {

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);

    const [loadingProfile, setLoadingProfile] = useState(false);
    const [loadingPassword, setLoadingPassword] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const fetchProfile = () => {

        fetch("http://localhost:5000/profile", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setName(data.name);
                setEmail(data.email);
            })
            .catch((error) => {
                console.log(error);
                toast.error("Unable to load profile");
            });

    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const getInitials = (fullName) => {
        if (!fullName) return "?";
        const parts = fullName.trim().split(" ");
        return parts.length > 1
            ? (parts[0][0] + parts[1][0]).toUpperCase()
            : parts[0].slice(0, 2).toUpperCase();
    };

    const handleUpdateProfile = async () => {

        if (name === "" || email === "") {
            toast.error("Please fill all fields");
            return;
        }

        setLoadingProfile(true);

        try {

            const response = await fetch("http://localhost:5000/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ name, email }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            console.log(error);
            toast.error("Unable to connect to server");
        } finally {
            setLoadingProfile(false);
        }

    };

    const handleChangePassword = async () => {

        if (currentPassword === "" || newPassword === "") {
            toast.error("Please fill both password fields");
            return;
        }

        setLoadingPassword(true);

        try {

            const response = await fetch("http://localhost:5000/change-password", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message);
                setCurrentPassword("");
                setNewPassword("");
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            console.log(error);
            toast.error("Unable to connect to server");
        } finally {
            setLoadingPassword(false);
        }

    };

    return (

        <div className="profile-page">

            <Sidebar />

            <div className="profile-content">

                <div className="profile-header">
                    <div className="avatar-circle">{getInitials(name)}</div>
                    <div>
                        <h1>{name || "Your Profile"}</h1>
                        <p className="profile-subtext">{email}</p>
                    </div>
                </div>

                <div className="profile-grid">

                    <section className="profile-card">

                        <div className="card-heading">
                            <span className="card-icon">👤</span>
                            <div>
                                <h2>Account Details</h2>
                                <p>Update your name and email address</p>
                            </div>
                        </div>

                        <label>Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                        />

                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                        />

                        <button
                            className="primary-btn"
                            onClick={handleUpdateProfile}
                            disabled={loadingProfile}
                        >
                            {loadingProfile ? "Saving..." : "Save Changes"}
                        </button>

                    </section>

                    <section className="profile-card">

                        <div className="card-heading">
                            <span className="card-icon">🔒</span>
                            <div>
                                <h2>Security</h2>
                                <p>Change your account password</p>
                            </div>
                        </div>

                        <label>Current Password</label>
                        <div className="password-field">
                            <input
                                type={showCurrent ? "text" : "password"}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="Enter current password"
                            />
                            <span
                                className="toggle-visibility"
                                onClick={() => setShowCurrent(!showCurrent)}
                            >
                                {showCurrent ? "🙈" : "👁"}
                            </span>
                        </div>

                        <label>New Password</label>
                        <div className="password-field">
                            <input
                                type={showNew ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter new password"
                            />
                            <span
                                className="toggle-visibility"
                                onClick={() => setShowNew(!showNew)}
                            >
                                {showNew ? "🙈" : "👁"}
                            </span>
                        </div>

                        <button
                            className="primary-btn secondary"
                            onClick={handleChangePassword}
                            disabled={loadingPassword}
                        >
                            {loadingPassword ? "Updating..." : "Change Password"}
                        </button>

                    </section>

                </div>

            </div>

        </div>

    );

}

export default Profile;