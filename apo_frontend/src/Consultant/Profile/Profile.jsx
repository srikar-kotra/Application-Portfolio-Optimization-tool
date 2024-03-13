import React, { useState } from 'react';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import './Profile.css'; // Import custom CSS file

const ProfileButton = () => {
    const [showOptions, setShowOptions] = useState(false);

    const handleToggleOptions = () => {
        setShowOptions(!showOptions);
    };

    const handleLogout = () => {
        // Implement your logout logic here
        console.log('Logging out...');
    };

    const handleViewProfile = () => {
        // Implement your view profile details logic here
        console.log('Viewing profile...');
    };

    return (
        <div className="profile-button-container">
            <button className="profile-button" onClick={handleToggleOptions}>
                <FaUserCircle className="profile-icon" />
            </button>
            {showOptions && (
                <div className="profile-options">
                    <button className="dropdown-item" onClick={handleViewProfile}>
                        View Profile Details
                    </button>
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item" onClick={handleLogout}>
                        Log Out <FaSignOutAlt className="logout-icon" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfileButton;
