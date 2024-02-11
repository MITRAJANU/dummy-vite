import { Divider, IconButton, List, Toolbar } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import MuiDrawer from "@mui/material/Drawer";
import { mainListItems } from "../listItems";
// Separate AppDrawer component
export const AppDrawer = ({ open, toggleDrawer }) => (
  <MuiDrawer
    variant="permanent"
    open={open}
    sx={{
      "& .MuiDrawer-paper": {
        position: "relative",
        whiteSpace: "nowrap",
        width: "240px",
        transition: (theme) =>
          theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        boxSizing: "border-box",
        ...(open && {
          overflowX: "hidden",
          transition: (theme) =>
            theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          width: "240px",
        }),
      },
    }}
  >
    <Toolbar
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        px: [1],
      }}
    >
      <IconButton onClick={toggleDrawer}>
        <ChevronLeftIcon />
      </IconButton>
    </Toolbar>
    <Divider />
    <List component="nav">{mainListItems}</List>
  </MuiDrawer>
);
