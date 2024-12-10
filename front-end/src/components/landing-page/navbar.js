import React, { useState, useContext } from "react";
import { Drawer } from "./drawer";
import { AiOutlineMenu } from "react-icons/ai";
import Link from "next/link";
import { useRouter } from 'next/router';
import { useAuth } from "@/assets/hooks/use-auth";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { IoChevronDownOutline } from "react-icons/io5"
import { authContext } from "../use-context";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const auth = useAuth();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const { logoutUser } = useContext(authContext);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/home/aboutus' },
    { name: 'Services', path: '/home/services' },
    { name: 'Contact', path: '/home/contact' },
  
  ];

  return (
    <section className="flex items-center justify-between h-[10vh]">
      <div>
        <Link href="/">
          <h1 className="text-white text-xl hover:text-primary transition-colors duration-300 cursor-pointer">
            Tiba
          </h1>
        </Link>
      </div>
      <div className="md:block hidden">
        <ul className="flex items-center gap-4 text-white">
          {navLinks.map((link, index) => (
            <li key={index}>
              <Link 
                href={link.path}
                className={`hover:text-primary transition-colors duration-300 ${
                  router.pathname === link.path ? 'text-primary' : ''
                }`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {auth?.first_name ? (
        <section className="flex items-center gap-2">
          <p className="text-white">{auth.first_name}</p>
          <IoChevronDownOutline
            onClick={handleClick}
            className="text-white text-xl font-bold cursor-pointer hover:text-primary transition-colors duration-300"
          />
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem onClick={handleClose}>
              <Link href="/patient-profile" className="hover:text-primary transition-colors duration-300">
                Profile
              </Link>
            </MenuItem>
            <MenuItem onClick={logoutUser} className="hover:text-primary transition-colors duration-300">
              Logout
            </MenuItem>
          </Menu>
        </section>
      ) : (
        <div className="md:block hidden">
          <Link
            href="/auth/login"
            className="bg-primary px-5 py-3 text-white mx-2 hover:bg-primary/80 transition-colors duration-300 rounded"
          >
            Login
          </Link>
          <Link
            href="/auth/register"
            className="bg-primary px-5 py-3 text-white mx-2 hover:bg-primary/80 transition-colors duration-300 rounded"

          >
            Register
          </Link>
        </div>
      )}

      <div className="md:hidden block py-4">
        <AiOutlineMenu
          className="text-white text-2xl cursor-pointer hover:text-primary transition-colors duration-300"
          onClick={() => setIsOpen(true)}
        />
        <Drawer isOpen={isOpen} setIsOpen={setIsOpen} navLinks={navLinks} />
      </div>
    </section>
  );
};

export default Navbar;