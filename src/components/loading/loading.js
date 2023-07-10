import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";

export default function Loading() {
  return (
    <div
      style={{ display: "flex", textAlign: "center", alignItems: "center" }}
    >
      <CircularProgress color="secondary" />
    </div>
  );
}
