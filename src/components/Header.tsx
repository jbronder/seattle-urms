import AboutPopover from './AboutPopover.tsx';

function Header() {
  return (
    <header className="header-cont">
      <h1>Seattle Unreinforced Masonry Building Inventory</h1>
      <AboutPopover />
    </header>
  );
}

export default Header;