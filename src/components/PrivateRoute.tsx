import { useAuth } from "@/lib/auth-provider";
import { Navigate, Outlet } from "react-router";
// import { useAuth } from "src/lib/auth-provider";

const PrivateRoute = () => {
  const user = useAuth();

  if (user?.accessToken) {
    const difference =
      (user.tokenSavedTime
        ? user.tokenSavedTime!.getTime()
        : new Date().getTime()) - new Date().getTime(); // This will give difference in milliseconds
    const resultInMinutes = Math.round(difference / 60000);
    if (resultInMinutes > 60 * 24) {
      alert("Your session has expired. Please sign in again.");
      return <Navigate to="/sign-in" />;
    }
  } else {
    return <Navigate to="/sign-in" />;
  }
  return <Outlet />;
};

export default PrivateRoute;
