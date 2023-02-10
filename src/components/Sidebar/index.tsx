import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar__logo">
        <div className="sidebar__logoImage">{/* <Logo /> */}</div>
        <p className="sidebar__logoText">re:tune</p>
      </div>

      <nav className="menu">
        <ul>
          <li className="menu__item">
            <Link href="/" className="menu__link">
              Home
            </Link>
          </li>
          <li className="menu__item">
            <Link href="/search" className="menu__link">
              Search
            </Link>
          </li>
          <li className="menu__item">
            <Link href="/favorites" className="menu__link">
              Favorites
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
