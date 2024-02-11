import { Box, IconButton, Toolbar, Typography } from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import MenuIcon from "@mui/icons-material/Menu";
// eslint-disable-next-line react/prop-types
export const AppAppBar = ({ open, toggleDrawer }) => (
  <MuiAppBar
    position="absolute"
    open={open}
    sx={{
      zIndex: (theme) => theme.zIndex.drawer + 1,
      transition: (theme) =>
        theme.transitions.create(["width", "margin"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
      ...(open && {
        marginLeft: "240px",
        width: `calc(100% - 240px)`,
      }),
    }}
  >
    <Toolbar
      sx={{
        pr: "24px", // keep right padding when drawer closed
      }}
    >
      <IconButton
        edge="start"
        color="inherit"
        aria-label="open drawer"
        onClick={toggleDrawer}
        sx={{
          marginRight: "36px",
          ...(open && { display: "none" }),
        }}
      >
        <MenuIcon />
      </IconButton>
      {/* Add your app title here */}
      <Box sx={{ flexGrow: 1 }}>
        <Typography component="h1" variant="h6" color="inherit" noWrap>
          Home
        </Typography>
      </Box>
    </Toolbar>
  </MuiAppBar>
);
