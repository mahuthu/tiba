import React, { useState, useContext } from "react";
import { Drawer } from "../landing-page/drawer";
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
    <nav className="px-4 sm:px-6 lg:px-8 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <h1 className="text-white text-xl hover:text-primary transition-colors duration-300 cursor-pointer">
                Tiba
              </h1>
            </Link>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center justify-center flex-1 px-8">
            <ul className="flex items-center gap-8 text-white">
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

          {/* Auth Buttons/User Menu - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {auth?.first_name ? (
              <div className="flex items-center gap-2">
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
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
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
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/auth/login"
                  className="bg-primary px-5 py-2 text-white rounded hover:bg-primary/80 transition-colors duration-300"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-primary px-5 py-2 text-white rounded hover:bg-primary/80 transition-colors duration-300"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <AiOutlineMenu
              className="text-white text-2xl cursor-pointer hover:text-primary transition-colors duration-300"
              onClick={() => setIsOpen(true)}
            />
            <Drawer isOpen={isOpen} setIsOpen={setIsOpen} navLinks={navLinks} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;