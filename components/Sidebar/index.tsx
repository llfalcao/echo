"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Home from "@material-ui/icons/HomeRounded";
import Favorite from "@material-ui/icons/FavoriteRounded";
import Search from "@material-ui/icons/SearchRounded";
import Forum from "@material-ui/icons/ForumRounded";
import LightMode from "@material-ui/icons/Brightness7";

import logo from "../../assets/images/logo.png";
import { usePathname } from "next/navigation";

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
        <p className="sidebar__logoText">re:tune</p>
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
          title="Switch Theme"
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
