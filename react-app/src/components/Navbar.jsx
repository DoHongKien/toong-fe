import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { Tent, ChevronDown, Menu, X } from 'lucide-react'
import { navMenuData, simpleNavLinks } from '../data/navData'

const buildInitialPreviews = () => {
  const previews = {}
  navMenuData.forEach((menu) => {
    previews[menu.key] = {
      image: menu.defaultImage,
      imageFallback: menu.defaultImageFallback,
      accentTitle: menu.accentTitle,
      mainTitle: menu.mainTitle,
      description: menu.description,
    }
  })
  return previews
}

const Navbar = ({ alwaysScrolled = false }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(alwaysScrolled)
  const [activeMobileDropdown, setActiveMobileDropdown] = useState(null)
  const [megaPreviews, setMegaPreviews] = useState(buildInitialPreviews)
  const [portalMounted, setPortalMounted] = useState(false)

  useEffect(() => {
    setPortalMounted(true)
  }, [])

  useEffect(() => {
    if (alwaysScrolled) return
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [alwaysScrolled])

  // Khoá scroll body khi mobile menu mở
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isMobileMenuOpen])

  const handleMobileMenuToggle = () => setIsMobileMenuOpen((prev) => !prev)

  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false)
    setActiveMobileDropdown(null)
  }

  const handleMobileDropdownToggle = (index) => {
    setActiveMobileDropdown((prev) => (prev === index ? null : index))
  }

  const handleDropdownKeyDown = (e, index) => {
    if (e.key !== 'Enter') return
    handleMobileDropdownToggle(index)
  }

  const handleMegaLinkHover = (menuKey, item) => {
    setMegaPreviews((prev) => ({
      ...prev,
      [menuKey]: {
        ...prev[menuKey],
        image: item.image,
        imageFallback: item.image,
        accentTitle: item.title,
        mainTitle: item.title,
        description: item.desc,
      },
    }))
  }

  const handleNavLinkClick = (e, href) => {
    if (href === '#') {
      e.preventDefault()
      return
    }
    handleMobileLinkClick()
  }

  // Nội dung nav dùng chung cho cả desktop (inline) và mobile (portal)
  const renderNavItems = (isMobile) =>
    navMenuData.map((menu, index) => {
      const preview = megaPreviews[menu.key]
      const isMobileActive = isMobile && activeMobileDropdown === index

      return (
        <div key={menu.key} className={`nav-item has-dropdown${isMobileActive ? ' active' : ''}`}>
          {menu.href === '#' ? (
            <a
              href="#"
              className="nav-link"
              onClick={(e) => {
                e.preventDefault()
                if (isMobile) handleMobileDropdownToggle(index)
              }}
              onKeyDown={(e) => isMobile && handleDropdownKeyDown(e, index)}
              tabIndex={0}
              aria-haspopup="true"
              aria-expanded={isMobileActive}
            >
              {menu.label} <ChevronDown className="dropdown-icon" />
            </a>
          ) : (
            <Link
              to={menu.href}
              className="nav-link"
              onClick={(e) => {
                if (isMobile) {
                  if (!isMobileActive) e.preventDefault()
                  handleMobileDropdownToggle(index)
                }
              }}
              onKeyDown={(e) => isMobile && handleDropdownKeyDown(e, index)}
              tabIndex={0}
              aria-haspopup="true"
              aria-expanded={isMobileActive}
            >
              {menu.label} <ChevronDown className="dropdown-icon" />
            </Link>
          )}

          <div className="mega-menu" role="region" aria-label={`${menu.label} menu`}>
            <div className="mega-container">
              <div className="mega-column mega-links">
                <h4 className="mega-links-title">{menu.label}</h4>
                <ul>
                  {menu.links.map((link) => (
                    <li key={link.title}>
                      <Link
                        to={link.href}
                        className="mega-item-link"
                        onMouseEnter={() => !isMobile && handleMegaLinkHover(menu.key, link)}
                        onClick={isMobile ? handleMobileLinkClick : undefined}
                        tabIndex={0}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mega-column mega-image">
                <img
                  src={preview.image}
                  alt={menu.imageAlt}
                  className="mega-img"
                  onError={(e) => {
                    e.currentTarget.src = preview.imageFallback
                    e.currentTarget.style.filter = 'grayscale(1) contrast(1.5)'
                  }}
                />
              </div>

              <div className="mega-column mega-description">
                <h2 className="mega-desc-accent">{preview.accentTitle}</h2>
                <h3 className="mega-desc-main">{preview.mainTitle}</h3>
                <p>{preview.description}</p>
              </div>
            </div>
          </div>
        </div>
      )
    })

  // Mobile nav overlay — render qua Portal ra document.body
  // tránh bị ảnh hưởng bởi stacking context của header (z-index:1000)
  const mobileNavOverlay = portalMounted
    ? createPortal(
        <nav
          className={`nav-mobile-overlay${isMobileMenuOpen ? ' active' : ''}`}
          aria-hidden={!isMobileMenuOpen}
        >
          {renderNavItems(true)}

          {simpleNavLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="nav-link"
              onClick={(e) => handleNavLinkClick(e, link.href)}
              tabIndex={isMobileMenuOpen ? 0 : -1}
            >
              {link.label}
            </Link>
          ))}

          <div className="mobile-lang-wrapper">
            <button className="btn-lang" aria-label="Chuyển ngôn ngữ sang tiếng Anh">
              English
            </button>
          </div>
        </nav>,
        document.body
      )
    : null

  return (
    <>
      <header className={`header${isScrolled ? ' scrolled' : ''}`} id="header">
        <div className="container nav-wrapper">
          <div className="logo-wrap">
            <Link
              to="/"
              className="logo"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}
              aria-label="Tổ Kiến Adventure - Trang chủ"
            >
              <Tent style={{ color: 'var(--color-accent)', width: 32, height: 32 }} />
              <span
                className="logo-text"
                style={{ display: 'flex', flexDirection: 'column', lineHeight: 1, color: 'var(--color-white)' }}
              >
                <strong style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: 1 }}>Tổ Kiến</strong>
                <span style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: 3, color: 'var(--color-accent)' }}>
                  ADVENTURE
                </span>
              </span>
            </Link>
          </div>

          {/* Desktop nav — inline trong header, ẩn trên mobile qua CSS */}
          <nav className="nav-links" id="nav-links">
            {renderNavItems(false)}
            {simpleNavLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="nav-link"
                onClick={(e) => handleNavLinkClick(e, link.href)}
                tabIndex={0}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="nav-right">
            <a href="tel:0933227878" className="nav-phone" aria-label="Gọi điện: 0933 22 78 78">
              0933 22 78 78
            </a>
            <button className="btn-lang" aria-label="Chuyển ngôn ngữ sang tiếng Anh">
              English
            </button>
          </div>

          <button
            className="menu-toggle"
            aria-label="Toggle menu"
            id="mobile-menu-btn"
            onClick={handleMobileMenuToggle}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {/* Mobile nav overlay qua Portal — nằm ngoài header DOM */}
      {mobileNavOverlay}
    </>
  )
}

export default Navbar
