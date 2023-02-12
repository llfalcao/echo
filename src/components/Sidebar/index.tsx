import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Favorite, Home, Search } from "@material-ui/icons";
import { DarkMode } from "../Icons/Icons";
import { Brightness7 as LightMode } from "@material-ui/icons";

import logo from "../../assets/images/logo.png";

export default function Sidebar() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
    setTheme(savedTheme);
  }, []);

  const changeTheme = () => {
    setTheme((current) => {
      const newTheme = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
      return newTheme;
    });
  };

  return (
    <div className="sidebar">
      <div className="sidebar__logo">
        <div className="sidebar__logoImage">
          <Image src={logo} alt="" width={25} />
        </div>
        <p className="sidebar__logoText">re:tune</p>
      </div>

      <nav className="menu">
        <ul>
          <li className="menu__item">
            <Link href="/" className="menu__link">
              <Home />
              Home
            </Link>
          </li>
          <li className="menu__item">
            <Link href="/search" className="menu__link">
              <Search />
              Search
            </Link>
          </li>
          <li className="menu__item">
            <Link href="/favorites" className="menu__link">
              <Favorite />
              Favorites
            </Link>
          </li>
        </ul>
      </nav>

      <div className="themeToggle">
        <p className="themeToggle__title">
          {theme === "dark" ? "Dark Mode" : "Light Mode"}
        </p>
        <button
          onClick={changeTheme}
          className="themeToggle__switch"
          title="Switch Theme"
        >
          <div className="themeToggle__circle">
            {theme === "dark" ? (
              <DarkMode className="themeToggle__icon themeToggle__icon--dark" />
            ) : (
              <LightMode className="themeToggle__icon themeToggle__icon--light" />
            )}
          </div>
        </button>
      </div>
    </div>
  );
}
