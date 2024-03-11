"use client";

import LightMode from "@mui/icons-material/Brightness7";
import Favorite from "@mui/icons-material/FavoriteRounded";
import Forum from "@mui/icons-material/ForumRounded";
import Home from "@mui/icons-material/HomeRounded";
import Search from "@mui/icons-material/SearchRounded";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { usePathname } from "next/navigation";
import logo from "../../assets/images/logo.png";

export default function Sidebar() {
  const [theme, setTheme] = useState("dark");
  const pathname = usePathname();

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

  const getMenuItemClassName = (path: string) => {
    return path === pathname ? "menu__item menu__item--active" : "menu__item";
  };

  return (
    <div className="sidebar">
      <Link href="/" className="sidebar__logo">
        <div className="sidebar__logoImage">
          <Image src={logo} alt="" width={25} />
        </div>
        <p className="sidebar__logoText">echo</p>
      </Link>

      <nav className="menu">
        <ul>
          <li className={getMenuItemClassName("/")}>
            <Link href="/" className="menu__link">
              <Home />
              Home
            </Link>
          </li>
          <li className={getMenuItemClassName("/search")}>
            <Link href="/search" className="menu__link">
              <Search />
              Search
            </Link>
          </li>
          <li className={getMenuItemClassName("/favorites")}>
            <Link href="/favorites" className="menu__link">
              <Favorite />
              Favorites
            </Link>
          </li>
          <li className={getMenuItemClassName("/discussions")}>
            <Link href="/discussions" className="menu__link">
              <Forum />
              Discussions
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
          title={`Current theme: ${theme}`}
        >
          <div className="themeToggle__circle">
            {theme === "dark" ? (
              <svg
                focusable="false"
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="themeToggle__icon themeToggle__icon--dark"
              >
                <use href="/sprites.svg#DarkMode" />
              </svg>
            ) : (
              <LightMode className="themeToggle__icon themeToggle__icon--light" />
            )}
          </div>
        </button>
      </div>
    </div>
  );
}
