import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import FormControlLabel from "@mui/material/FormControlLabel";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import * as React from "react";
import { useEffect, useState } from "react";
import * as ApiServices from "../../services/api-services";
import Loading from "../loading/loading";
import "./table-viewer.css";
import SimpleSnackbar from "../snackbar/snackbar";
import * as UrlChecker from "../../helpers/url-checker";
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    paddingTop: 1,
    paddingBottom: 1,
    backgroundColor: "transparent",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const deletModalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  borderRadius: '5px',
  boxShadow: 24,
  p: 4,
};


export default function CustomizedTables({
  load,
  setLoad,
  urlData,
  setUrlData,
  setOriginalUrlData,
}) {
  const [editUrl, setEditUrl] = useState({ state: false, rowId: -1 });
  const [newUrlData, setNewUrlData] = useState({ url: "", favourite: false });
  const [drawerState, setDrawerState] = useState(false);
  const [rowData, setRowData] = useState({});
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [snakeBar, setSnakeBar] = useState({
    state: false,
    message: "",
    type: "info",
  });

  const toggleDrawer =
    (open, row = {}) =>
      (event) => {
        if (
          event.type === "keydown" &&
          (event.key === "Tab" || event.key === "Shift")
        ) {
          return;
        }
        setRowData(row);
        setDrawerState(open);
      };

  const list = () => (
    <Box
      sx={{ width: 1000 }}
      role="presentation"
      onKeyDown={toggleDrawer(false)}
    >
      <h1 style={{ textAlign: "center" }}>Insights</h1>
      <Divider />
      <div className="box-content">
        <div className="content">
          <div className="head-text">Domain Name</div>
          <div><a href={rowData.url} target="_blank" rel="noopener noreferrer">{rowData.url}</a></div>
        </div>
        <Divider />
        <div style={{ display: "flex" }}>
          <div className="content">
            <div className="head-text">WordCount</div>
            <div>{rowData.word_count}</div>
          </div>
          <div>
            <div className="head-text">favourite</div>
            <div>{rowData.favourite ? "True" : "False"}</div>
          </div>
        </div>
        <Divider />
        <div className="content">
          <div className="head-text">Web-Links</div>
          {isValidJson(rowData.web_links).map((link, i) => (
            <div key={i}>
              <a href={link} target="_blank" rel="noopener noreferrer">
                {link}
              </a>
            </div>
          ))}
        </div>
        <Divider />
        <div className="content">
          <div className="head-text">Media-Links</div>
          {isValidJson(rowData.media_links).map((link, i) => (
            <div key={i}>
              <a href={link} target="_blank" rel="noopener noreferrer">
                {link}
              </a>
            </div>
          ))}
        </div>
      </div>
    </Box>
  );

  const isValidJson = (jsonString) => {
    try {
      const jsonObject = JSON.parse(jsonString);
      return jsonObject;
    } catch (error) {
      return [jsonString];
    }
  };

  const parseLinksData = (data) => {
    if (data.length > 50) {
      data = data.substring(1, 50) + "...";
    }
    return data;
  };
  const parseUrl = (data) => {
    if (data.length > 25) {
      data = data.substring(1, 25) + "...";
    }
    return data;
  };

  const handleEdit = (id, rowUrl, rowFavourite, event) => {
    event?.preventDefault();
    setNewUrlData({ url: rowUrl, favourite: rowFavourite });
    setEditUrl({ state: true, rowId: id });
  };

  const handleEditSubmit = (id, rowUrl, rowFavourite, event) => {
    event?.preventDefault();
    setEditUrl({ state: false, rowId: -1 });
    if (newUrlData.url !== rowUrl || newUrlData.favourite !== rowFavourite) {
      if (!newUrlData.url.length || !UrlChecker.isValidUrl(newUrlData.url)) {
        setSnakeBar({ state: true, message: "Enter Valid Url", type: "error" });
        return;
      }
      setLoad(true);
      ApiServices.getWebsiteInfo(newUrlData.url)
        .then(async (websiteInfo) => {
          if (websiteInfo) {
            const urlData = {
              url: newUrlData.url,
              word_count: websiteInfo.word_count,
              favourite: newUrlData.favourite,
              web_links: JSON.stringify(websiteInfo.web_links),
              media_links: JSON.stringify(websiteInfo.media_links),
            };
            ApiServices.editRowInTable(id, urlData).then((res) => {
              setSnakeBar({
                state: true,
                message: "Updated Successfully.",
                type: "success",
              });
              setLoad(false);
              setUrlData(res);
            });
          } else {
            setLoad(false);
            setSnakeBar({
              state: true,
              message: "Failed to fetch website information.",
              type: "error",
            });
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
    } else {
      setLoad(false);
      setSnakeBar({
        state: true,
        message: "Url must be different.",
        type: "info",
      });
    }
  };

  const handleOpenDeleteModal = (state, event) => {
    event?.preventDefault();
    setOpenDeleteModal(state)
  }

  const handleDeleteSubmit = (id, event) => {
    event?.preventDefault();
    setOpenDeleteModal(false)
    setLoad(true);
    ApiServices.deleteRowInTable(id)
      .then((res) => {
        setUrlData(urlData.filter((p) => p.id !== id));
        setLoad(false);
        setSnakeBar({
          state: true,
          message: "Deleted Successfully.",
          type: "success",
        });
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

  useEffect(() => {
    let mount = true;
    setLoad(true);
    ApiServices.fetchTableData().then((res) => {
      setUrlData(res);
      setOriginalUrlData(res);
      setLoad(false);
      return () => (mount = false);
    });
  }, []);

  return (
    <>
      <SimpleSnackbar
        snakeBar={snakeBar}
        setSnakeBar={setSnakeBar}
      ></SimpleSnackbar>
      {load && (
        <div className="loader-container">
          <Loading></Loading>
        </div>
      )}
      <TableContainer component={Paper}>
        <Table stickyHeader stripe="odd" aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell sx={{ width: "1%" }}>#</StyledTableCell>
              <StyledTableCell sx={{ width: "15%" }}>
                Domain Name
              </StyledTableCell>
              <StyledTableCell sx={{ textAlign: "center" }}>
                WordCount
              </StyledTableCell>
              <StyledTableCell sx={{ textAlign: "center", width: "10%" }}>
                Favourite
              </StyledTableCell>
              <StyledTableCell sx={{ width: "25%" }}>Web-Links</StyledTableCell>
              <StyledTableCell sx={{ width: "25%" }}>
                Media-Links
              </StyledTableCell>
              <StyledTableCell sx={{ textAlign: "right" }}>
                Actions
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {urlData.map((row, i) => (
              <StyledTableRow key={row.id}>
                <StyledTableCell>{i + 1}</StyledTableCell>
                <StyledTableCell component="th" scope="row">
                  {editUrl.rowId !== row.id && parseUrl(row.url)}
                  {editUrl.state && editUrl.rowId === row.id && (
                    <TextField
                      margin="normal"
                      required
                      size="sm"
                      fullWidth
                      id="url"
                      label="Enter Valid Url"
                      name="url"
                      autoFocus
                      defaultValue={row.url}
                      onChange={(e) =>
                        setNewUrlData({
                          url: e.target.value,
                          favourite: newUrlData.favourite,
                        })
                      }
                    />
                  )}
                </StyledTableCell>
                <StyledTableCell sx={{ textAlign: "center" }}>
                  {row.word_count}
                </StyledTableCell>
                <StyledTableCell sx={{ textAlign: "center" }}>
                  {editUrl.rowId !== row.id &&
                    (row.favourite ? "True" : "False")}
                  {editUrl.state && editUrl.rowId === row.id && (
                    <FormControlLabel
                      control={
                        <Checkbox
                          value="favourite"
                          color="primary"
                          defaultChecked={row.favourite}
                          onChange={(e) =>
                            setNewUrlData({
                              url: newUrlData.url,
                              favourite: e.target.checked,
                            })
                          }
                        />
                      }
                      label="Favourite"
                    />
                  )}
                </StyledTableCell>
                <StyledTableCell style={{ width: "25%", wordWrap: 'break-word' }}>
                  {parseLinksData(row.web_links)}
                </StyledTableCell>
                <StyledTableCell style={{ width: "25%", wordWrap: 'break-word' }}>
                  {parseLinksData(row.media_links)}
                </StyledTableCell>
                <StyledTableCell sx={{ textAlign: "right" }}>
                  <div className="action-button">
                    <React.Fragment>
                      <Button
                        onClick={toggleDrawer(true, row)}
                        variant="contained"
                        color="success"
                        disabled={load}
                      >
                        Insights
                      </Button>
                      <Drawer
                        anchor={"left"}
                        open={drawerState}
                        onClose={toggleDrawer(false, row)}
                      >
                        {list()}
                      </Drawer>
                    </React.Fragment>
                  </div>
                  {editUrl.state && editUrl.rowId === row.id && (
                    <div className="action-button">
                      <Button
                        onClick={(e) =>
                          handleEditSubmit(row.id, row.url, row.favourite, e)
                        }
                        variant="contained"
                        color="secondary"
                        disabled={load}
                      >
                        Submit
                      </Button>
                    </div>
                  )}
                  {editUrl.rowId !== row.id && (
                    <div className="action-button">
                      <Button
                        onClick={(e) =>
                          handleEdit(row.id, row.url, row.favourite, e)
                        }
                        variant="contained"
                        color="info"
                        disabled={load}
                      >
                        Edit
                      </Button>
                    </div>
                  )}
                  <div className="action-button">
                    <Button
                      onClick={(e) => handleOpenDeleteModal(true, e)}
                      variant="contained"
                      color="error"
                      disabled={load}
                    >
                      Delete
                    </Button>
                    <Modal
                      open={openDeleteModal}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                    >
                      <Box sx={deletModalStyle}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                          Are you sure you want to delete?
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2, wordWrap: 'break-word' }}>
                          {i + 1}.<a href={row.url}>{row.url}</a>
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2, textAlign: 'right' }}>
                          <Button
                            onClick={(e) => handleOpenDeleteModal(false, e)}
                            variant="contained"
                            color="secondary"
                            disabled={load}
                          >
                            Cancel
                          </Button>
                          <Button
                            sx={{ ml: 3 }}
                            onClick={(e) => handleDeleteSubmit(row.id, e)}
                            variant="contained"
                            color="error"
                            disabled={load}
                          >
                            Delete
                          </Button>
                        </Typography>
                      </Box>
                    </Modal>
                  </div>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
