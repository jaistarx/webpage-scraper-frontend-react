import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import FormControlLabel from "@mui/material/FormControlLabel";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as ApiServices from "../../services/api-services";
import * as UrlChecker from "../../helpers/url-checker";
import Loading from "../loading/loading";
import SimpleSnackbar from "../snackbar/snackbar";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Note : Please enable "}
      <Link color="inherit" href="https://cors-anywhere.herokuapp.com/corsdemo" target="_blank">
        CORS PROXY
      </Link>
      {" if there is an error in fetching site's data."}
      <span>{" (Request temporary access to the demo server)"}</span>
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function Home({ load, setLoad }) {
  const navigate = useNavigate();
  const [snakeBar, setSnakeBar] = useState({
    state: false,
    message: "",
    type: "info",
  });
  const [url, setUrl] = useState("");
  const [favourite, setFavourite] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!url.length || !UrlChecker.isValidUrl(url)) {
      setSnakeBar({ state: true, message: "Enter Valid Url", type: "error" });
      return;
    }
    setLoad(true);
    ApiServices.getWebsiteInfo(url)
      .then(async (websiteInfo) => {
        if (websiteInfo) {
          const urlData = {
            url: url,
            word_count: websiteInfo.word_count,
            favourite: favourite,
            web_links: JSON.stringify(websiteInfo.web_links),
            media_links: JSON.stringify(websiteInfo.media_links),
          };
          ApiServices.addDataToTable(urlData).then((res) => {
            navigate("/table-viewer");
            setLoad(false);
          });
        } else {
          setSnakeBar({
            state: true,
            message: "Failed to fetch website information.",
            type: "error",
          });
          setLoad(false);
        }
      })
      .catch((error) => {
        setLoad(false);
        setSnakeBar({
          state: true,
          message: error.message,
          type: "error",
        });
      });
  };

  return (
    <>
      <SimpleSnackbar
        snakeBar={snakeBar}
        setSnakeBar={setSnakeBar}
      ></SimpleSnackbar>
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="lg">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 20,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography component="h1" variant="h5">
              Enter valid URL
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ mt: 1, width: "100%" }}
            >
              <TextField
                margin="normal"
                fullWidth
                id="url"
                label="url"
                name="url"
                autoComplete="url"
                autoFocus
                onChange={(e) => setUrl(e.target.value)}
              />
              <div
                style={{
                  textAlign: "center",
                  marginTop: "20px",
                  marginBottom: "20px",
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      value="favourite"
                      color="primary"
                      onChange={(e) => setFavourite(e.target.checked)}
                    />
                  }
                  label="Mark as Favourite"
                />
              </div>
              <div style={{ textAlign: "center" }}>
                <Button
                  type="submit"
                  variant="contained"
                  style={{ height: "50px", width: "150px" }}
                >
                  {load && (
                    <div>
                      <Loading></Loading>
                    </div>
                  )}
                  {!load && <>Submit</>}
                </Button>
              </div>
            </Box>
          </Box>
          <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
      </ThemeProvider>
    </>
  );
}
