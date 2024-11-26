import React, { useState } from 'react';
import { useRouter } from 'next/router';

const initialAllottedTeachers = [
    { id: 1, name: 'Prof. John Doe' },
    { id: 2, name: 'Prof. Jane Smith' },
    { id: 3, name: 'Prof. Emily Brown' },
];

export default function AllottedTeachers() {
    const router = useRouter();
    const { subject } = router.query;

    const [allottedTeachers, setAllottedTeachers] = useState(initialAllottedTeachers);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [teacherToDelete, setTeacherToDelete] = useState(null);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleDelete = (teacherId) => {
        setAllottedTeachers(allottedTeachers.filter(teacher => teacher.id !== teacherId));
        setShowModal(false);
    };

    const openModal = (teacher) => {
        setTeacherToDelete(teacher);
        setShowModal(true);
    };

    const filteredTeachers = allottedTeachers.filter((teacher) =>
        teacher.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
            <h1 className="text-4xl font-bold mb-2 text-center">Subject: {subject}</h1>
            <h2 className="text-2xl font-semibold mb-6 text-center">Allotted Teachers</h2>

            <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-6">
                <label className="block text-sm font-medium mb-2">Search Teacher:</label>
                <input
                    type="text"
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg"
                    placeholder="Search by name"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                <label className="block text-sm font-medium mb-2">Allotted Teachers:</label>
                {filteredTeachers.map((teacher) => (
                    <div key={teacher.id} className="flex justify-between items-center mb-2">
                        <span className="text-lg">{teacher.name}</span>
                        <button
                            onClick={() => openModal(teacher)}
                            className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700"
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4">Confirm Delete</h2>
                        <p>Are you sure you want to delete <strong>{teacherToDelete.name}</strong> permanently?</p>
                        <div className="flex justify-end space-x-4 mt-4">
                            <button
                                onClick={() => setShowModal(false)}
                                className="bg-gray-600 px-4 py-2 rounded-lg hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(teacherToDelete.id)}
                                className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
