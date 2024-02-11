import { List } from "@mui/material";
import { mainListItems } from "./listItems";

const Profile = () => {
  return (
    <>
      <List component="nav">
        {mainListItems}
        {/* <Divider sx={{ my: 1 }} />
            {secondaryListItems} */}
      </List>
      <span>Profile</span>
    </>
  );
};

export default Profile;
