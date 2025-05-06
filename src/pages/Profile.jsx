import React from 'react';

const Profile = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-xl">
        <h1 className="text-3xl font-bold text-teal-700 mb-8 text-center">User Profile</h1>
        <div className="text-center text-gray-600">
          <p className="text-lg mb-4">This is a placeholder for the User Profile page.</p>
          <p>Future enhancements could include:</p>
          <ul className="list-disc list-inside text-left mx-auto max-w-md mt-4 space-y-1">
            <li>Displaying user name, email, and other details.</li>
            <li>Option to update profile information.</li>
            <li>Option to change password.</li>
            <li>Displaying user activity or statistics.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Profile;
