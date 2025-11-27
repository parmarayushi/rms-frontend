import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../features/auth/authSlice";

const Layout = ({ children }) => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      {/* Top bar - Sticky */}
      <header className="sticky top-0 z-50 bg-slate-900 text-white shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center font-bold">
              R
            </div>
            <span className="font-semibold text-lg tracking-wide">
              Restaurant Management System
            </span>
          </div>
          {user && (
            <div className="flex items-center gap-3 text-sm">
              <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700">
                {user.name}{" "}
                <span className="text-amber-400">({user.role})</span>
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 rounded-full border border-red-400 text-red-300 hover:bg-red-500/10 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="flex-1">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
