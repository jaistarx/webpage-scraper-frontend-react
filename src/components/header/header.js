import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
export default function ButtonAppBar({ setUrlData, originalUrlData }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [homeButton, setHomeButton] = useState(false);
  const handleSearch = (keyword) => {
    const results = [];
    const searchLower = keyword.toLowerCase();
    originalUrlData.forEach((element) => {
      const elementLower = element?.url?.toLowerCase();
      if (elementLower.includes(searchLower)) {
        results.push(element);
      }
    });
    setUrlData(results);
  };

  useEffect(() => {
    if (location.pathname === "/") {
      setHomeButton(false);
    } else {
      setHomeButton(true);
    }
  }, [location.pathname]);

  return (
    <Box sx={{ flexGrow: 1, marginBottom: "70px" }}>
      <AppBar position="fixed" sx={{ backgroundColor: "#b2dfdb" }}>
        <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" component="div" color="primary">
            <span
              style={{ color: "#1769aa", fontSize: "30px", fontWeight: "bold" }}
            >
              Webpage Scraper
            </span>
          </Typography>
          <Typography
            variant="h6"
            component="div"
            color="primary"
            sx={{ width: "50%" }}
          >{homeButton && (
            <TextField
              id="outlined-basic"
              label="Search"
              variant="filled"
              fullWidth
              onChange={(e) => handleSearch(e.target.value)}
            />
          )}
          </Typography>
          <Typography variant="h6" component="div" color="secondary">
            {homeButton && (
              <Button
                sx={{ mx: 1 }}
                variant="contained"
                onClick={() => navigate("/")}
              >
                Home
              </Button>
            )}
            <Button
              sx={{ mx: 1 }}
              variant="contained"
              onClick={() => navigate("/table-viewer")}
            >
              List
            </Button>
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
