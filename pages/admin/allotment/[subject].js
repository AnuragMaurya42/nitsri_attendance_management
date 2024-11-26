import React, { useState } from 'react';
import { useRouter } from 'next/router';

const teachers = [
    { id: 1, name: 'Prof. John Doe' },
    { id: 2, name: 'Prof. Jane Smith' },
    { id: 14, name: 'Prof. Karen Hall' },
    { id: 15, name: 'Prof. Matthew Harris' },
    { id: 16, name: 'Prof. Jennifer Lewis' },
    { id: 17, name: 'Prof. Steven Walker' },
    { id: 18, name: 'Prof. Sarah King' },
    { id: 19, name: 'Prof. Patrick Wright' },
    { id: 20, name: 'Prof. Michelle Scott' },
    { id: 21, name: 'Prof. Thomas Robinson' },
    { id: 22, name: 'Prof. Patricia Martinez' },
    { id: 23, name: 'Prof. George Allen' },
    { id: 24, name: 'Prof. Barbara Young' },
    { id: 25, name: 'Prof. Paul Hernandez' },
    { id: 26, name: 'Prof. Carol Wright' },
    { id: 27, name: 'Prof. Christopher Lopez' },
    { id: 28, name: 'Prof. Sharon Hill' },
    { id: 29, name: 'Prof. Anthony Scott' },
    { id: 30, name: 'Prof. Linda Harris' },
];

export default function Allotment() {
    const router = useRouter();
    const { subject } = router.query; // Get the dynamic subject from the URL

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTeachers, setSelectedTeachers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [popupType, setPopupType] = useState(''); // 'success' or 'error'

    const handleTeacherChange = (teacherId) => {
        setSelectedTeachers((prevSelectedTeachers) => {
            if (prevSelectedTeachers.includes(teacherId)) {
                return prevSelectedTeachers.filter((id) => id !== teacherId);
            } else {
                return [...prevSelectedTeachers, teacherId];
            }
        });
    };

    const handleSaveAllotment = () => {
        if (selectedTeachers.length === 0) {
            setPopupType('error');
            setPopupMessage('Please select at least one teacher.');
            setTimeout(() => setPopupMessage(''), 3000);
            return;
        }
        setShowModal(true);
    };

    const handleConfirmAllotment = () => {
        console.log(`Assigned teachers for ${subject}:`, selectedTeachers);
        setShowModal(false);
        setPopupType('success');
        setPopupMessage('Allotment successfully saved!');
        setTimeout(() => setPopupMessage(''), 3000); // Hide the popup after 3 seconds
    };

    const handleViewAllotments = () => {
        router.push(`/admin/allottedTeacher/${subject}`); // Navigate to the page showing all allotted teachers
    };

    const filteredTeachers = teachers.filter((teacher) =>
        teacher.name.toLowerCase().includes(searchTerm.toLowerCase())
    );




    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-6 relative">
            {/* Popup - Move to the top */}
            {popupMessage && (
                <div
                    className={`fixed top-0 left-0 w-full text-center py-2 shadow-md z-50 ${
                        popupType === 'success' ? 'bg-green-600' : 'bg-red-600'
                    } text-white`}
                >
                    {popupMessage}
                </div>
            )}
            
            <div className="sticky top-0 bg-gray-900 w-full max-w-md z-10">
                <h1 className="text-4xl font-bold mb-6 text-center">Teacher Allotment for {subject}</h1>
                <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-6">
                    <label className="block text-sm font-medium mb-2">Search Faculty:</label>
                    <input
                        type="text"
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg"
                        placeholder="Search by name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
    
            <button
                onClick={handleViewAllotments}
                className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 w-full max-w-md mb-6 mt-2"
            >
                View Allotted Teachers
            </button>
    
            <div className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md mb-6">
                <label className="block text-sm font-medium mb-2">Select Teachers:</label>
                {filteredTeachers.map((teacher) => (
                    <div key={teacher.id} className="flex items-center mb-2">
                        <input
                            type="checkbox"
                            id={`teacher-${teacher.id}`}
                            className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                            checked={selectedTeachers.includes(teacher.id)}
                            onChange={() => handleTeacherChange(teacher.id)}
                        />
                        <label htmlFor={`teacher-${teacher.id}`} className="ml-2 text-lg">
                            {teacher.name}
                        </label>
                    </div>
                ))}
            </div>
    
            <button
                onClick={handleSaveAllotment}
                className="bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300 fixed bottom-0 w-full max-w-md mb-6"
            >
                Save Allotment
            </button>
    
            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4">Confirm Allotment</h2>
                        <ul className="mb-4">
                            {selectedTeachers.map((teacherId) => {
                                const teacher = teachers.find((t) => t.id === teacherId);
                                return <li key={teacherId} className="mb-2">{teacher.name}</li>;
                            })}
                        </ul>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setShowModal(false)}
                                className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmAllotment}
                                className="bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}    