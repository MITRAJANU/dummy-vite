import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import { AppAppBar } from "./components/AppAppBar";
import { AppDrawer } from "./components/AppDrawer";
import { MainContent } from "./components/MainContent";
import Chat from "./Chat";

// Separate AppAppBar component

const Home = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [authenticated, setAuthenticated] = useState(null);

  const isAuthenticated = async () => {
    try {
      const response = await axios.get("http://localhost:8787/api/auth", {
        withCredentials: true,
      });
      console.log(response.data);
      return response.data.authenticated;
    } catch (error) {
      console.error("Error checking authentication:", error);
      return false;
    }
  };

  useEffect(() => {
    const checkAuthentication = async () => {
      const isAuthenticatedResult = await isAuthenticated();
      setAuthenticated(isAuthenticatedResult);

      if (!isAuthenticatedResult) {
        Swal.fire({
          icon: "error",
          title: "Unauthorized Access",
          text: "You are not logged in. Redirecting to login page.",
          confirmButtonText: "OK",
        }).then(() => {
          navigate("/");
        });
      }
    };

    checkAuthentication();
  }, [navigate]);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const defaultTheme = createTheme();

  return authenticated != null && authenticated ? (
    // <ThemeProvider theme={defaultTheme}>
    //   <Box sx={{ display: "flex" }}>
    //     <CssBaseline />
    //     <AppAppBar open={open} toggleDrawer={toggleDrawer} />
    //     <AppDrawer open={open} toggleDrawer={toggleDrawer} />
    //     {/* <MainContent /> */}
    //   </Box>
    <Chat />
  ) : // </ThemeProvider>
  null;
};

export default Home;
