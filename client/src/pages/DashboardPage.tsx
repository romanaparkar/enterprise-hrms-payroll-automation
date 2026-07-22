import { useAuth } from "../hooks/useAuth";

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800">
        Welcome, {user?.name}
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        You are signed in as <span className="font-medium">{user?.role}</span>.
      </p>
    </div>
  );
};

export default DashboardPage;
