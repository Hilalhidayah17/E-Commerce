import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { GlobalContext } from "../../utils/ReactContext";
import { Link } from "react-router";

export default function BasicMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { isAuthenticated, userData } = React.useContext(GlobalContext);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      {!isAuthenticated ? (
        ""
      ) : (
        <>
          <Button
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          >
            ...
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem onClick={handleClose}>
              <Link to={"/profile"}>Profile</Link>
            </MenuItem>
            {userData.role === "admin" && (
              <MenuItem onClick={handleClose}>
                <Link to={"/admin"}>Go to Admin</Link>
              </MenuItem>
            )}
          </Menu>
        </>
      )}
    </div>
  );
}
