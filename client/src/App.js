import Home from "./pages/Home";
import { ChatContextProvider } from "./context/chatContext";
import { useEffect, useState } from "react";
import Loading from "./components/Loader";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login";

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setInterval(() => {
      setLoading(false);
    }, 2000);
  }, []);
  const router = createBrowserRouter([
    {
      path: "/",
      element: loading ? <Loading /> : <Home />,
    },
    { path: "/login", element: <Login /> },
  ]);
  return (
    <ChatContextProvider>
      <RouterProvider router={router} />
    </ChatContextProvider>
  );
};

export default App;
