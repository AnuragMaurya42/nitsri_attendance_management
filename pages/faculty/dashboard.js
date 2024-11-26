import React,{useState,useEffect} from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { useRouter } from "next/router";
import "react-toastify/dist/ReactToastify.css";

const subjects = [
  {
    name: "DBMS",
    teacher: "Promod Yadav",
    attendance: 85,
    link: "/student/dbms",
  },
  {
    name: "Mathematics",
    teacher: "Dr. Sharma",
    attendance: 90,
    link: "/student/mathematics",
  },
  {
    name: "Science",
    teacher: "Dr. Kumar",
    attendance: 75,
    link: "/student/science",
  },
];

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null); // Added state for user
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    if (localStorage.getItem("facultyToken")) {
      let token = localStorage.getItem("facultyToken");
      const helper = async () => {
        try {
          const res = await fetch("/api/facultyapis/getfaculty", {
            method: "POST",
            body: JSON.stringify({ token }), // Wrapped token in an object
            headers: {
              "Content-Type": "application/json",
            },
          });
          const data = await res.json();
          if (!data.Success) {
            localStorage.removeItem("facultyToken");
            toast.error(data.ErrorMessage, {
              position: "top-center",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
              transition: Bounce,
            });
            setTimeout(() => {
              router.push("/login/faculty");
            }, 2000);
          } else {
            setUser(data.user);
          }
        } catch (error) {
          console.error(error);
        }
      };
      helper();
    } else {
      router.push("/login/faculty");
    }
    setLoading(false);
  }, [router]);


  return (
    <div className="dark min-h-screen bg-gray-900 text-gray-100">
     <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />
      {loading ? (
        <div className="relative h-custom flex justify-center items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      ) : (
        <div>
      <div className="bg-gray-800 shadow-md rounded-lg p-6 max-w-md w-full mb-6 mx-auto">
        <h1
          className="text-5xl font-bold text-green-500 mb-5"
          style={{
            fontFamily: "Courier New, Courier, monospace",
            color: "rbg(34 197 50)",
          }}
        >
          Faculty
        </h1>
        <h2 className="text-2xl font-bold mb-4">{user?.name}</h2>
        <p className="text-gray-400 mb-4">Department: {user?.department}</p>
      </div>

      {subjects.map((subject, index) => (
        <div
          key={index}
          className="w-4/5 bg-gray-800 border border-gray-700 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700 mb-6 mx-auto"
        >
          <div className="flex justify-end px-4 pt-4"></div>
          <div className="flex flex-col items-center pb-10">
            <h5 className="mb-1 text-xl font-medium text-gray-100">
              {subject.name}
            </h5>
            <span className="text-sm text-gray-400">{subject.teacher}</span>

            <a href={`/faculty/takeAttendence/${subject.name}`} >
              <button className="mt-4 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300">
                Take Attendence
              </button>
            </a>
            <a href={`/faculty/showSummary/${subject.name}`} >
            <button
              onClick={() => (window.location.href = subject.link)}
              className="mt-4 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Show Summary
            </button>
            </a>
          </div>
        </div>
      ))}
      </div>
      )}
    </div>
  );
}
