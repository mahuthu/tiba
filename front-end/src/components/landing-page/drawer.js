import { AiOutlineClose } from "react-icons/ai";
import { AiFillHome } from 'react-icons/ai';
import { FcAbout } from 'react-icons/fc';
import { MdMiscellaneousServices, MdContactSupport } from 'react-icons/md';
import { FaBlogger } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/router';

export const Drawer = ({ isOpen, setIsOpen }) => {
  const router = useRouter();

  const menu = [
    {
      name: 'Home',
      icon: <AiFillHome className="text-xl text-white" />,
      path: '/'
    },
    {
      name: 'About',
      icon: <FcAbout className="text-xl text-white" />,
      path: '/home/aboutus'
    },
    {
      name: 'Services',
      icon: <MdMiscellaneousServices className="text-xl text-white" />,
      path: '/home/services'
    },
    {
      name: 'Contact',
      icon: <MdContactSupport className="text-xl text-white" />,
      path: '/home/contact'
    },
    // {
    //   name: 'Blog',
    //   icon: <FaBlogger className="text-xl text-white" />,
    //   path: 'home/blog'
    // },
  ];

  return (
    <>
      <main
        className={
          "fixed overflow-hidden bg-black bg-opacity-50 inset-0 transform ease-in-out z-50" +
          (isOpen
            ? " transition-opacity opacity-100 duration-500 translate-x-0 z-50"
            : " transition-all delay-500 opacity-0 translate-x-full z-50")
        }
      >
        <section
          className={
            "right-0 md:w-3/12 w-3/4 absolute bg-primary opacity-100 px-8 py-4 h-screen shadow-xl delay-400 duration-500 ease-in-out transition-all transform" +
            (isOpen ? " translate-x-0 z-50" : " translate-x-full")
          }
        >
          <article className="text-white space-y-8">
            <div className="flex items-center justify-start px-2">
              <div>
                <AiOutlineClose
                  onClick={() => setIsOpen(false)}
                  className="text-white text-2xl float-right cursor-pointer hover:text-gray-300 transition-colors duration-300"
                />
              </div>
            </div>
            <div>
              <ul className="space-y-4 my-4">
                {menu.map((item, index) => (
                  <li key={index}>
                    <Link href={item.path}>
                      <span 
                        className={`flex text-sm items-center justify-between py-2 px-2 cursor-pointer hover:bg-white/10 rounded transition-colors duration-300 ${
                          router.pathname === item.path ? 'bg-white/20' : ''
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-6">{item.icon}</span>
                          <span>{item.name}</span>
                        </div>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              
              {/* Add Login/Register buttons */}
              {/* <div className="mt-8 space-y-4">
                <Link href="/auth/login">
                  <span 
                    className="block text-center bg-white text-primary px-5 py-3 rounded hover:bg-gray-100 transition-colors duration-300"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </span>
                </Link>
                <Link href="/auth/register">
                  <span 
                    className="block text-center border border-white px-5 py-3 rounded hover:bg-white/10 transition-colors duration-300"
                    onClick={() => setIsOpen(false)}
                  >
                    Register
                  </span>
                </Link>
              </div> */}
            </div>
          </article>
        </section>
        <section
          className="w-1/2 h-full cursor-pointer"
          onClick={() => {
            setIsOpen(false);
          }}
        ></section>
      </main>
    </>
  );
};
