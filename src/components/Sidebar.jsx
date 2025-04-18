import React, { useState } from "react";
import {
  RiAdminLine,
  RiStore2Line,
  RiInformationLine,
  RiUserSettingsLine,
  RiLogoutBoxRLine,
  RiMenuFoldLine,
  RiMenuUnfoldLine,
  RiArrowDownSLine,
  RiUser3Line,
  RiShieldLine,
  RiFileTextLine,
  RiShoppingBag3Line,
  RiShoppingCart2Line,
  RiCustomerService2Line,
  RiBuilding2Line,
  RiBriefcaseLine,
  RiMailLine,
} from "react-icons/ri";

const dropdownItems = [
  {
    icon: "📚",
    label: "📚 My Books",
    links: [
      { icon: RiUser3Line, label: "User Management", href: "#" },
      { icon: RiShieldLine, label: "Roles & Permissions", href: "#" },
      { icon: RiFileTextLine, label: "System Logs", href: "#" },
    ],
  },
  {
    icon: "🎥",
    label: "🎥 My Videos",
    links: [
      { icon: RiShoppingBag3Line, label: "Product Listings", href: "#" },
      { icon: RiShoppingCart2Line, label: "Order Management", href: "#" },
      { icon: RiCustomerService2Line, label: "Vendor Support", href: "#" },
    ],
  },
  {
    icon: "📂",
    label: "📂 Other Resources",
    links: [
      { icon: RiBuilding2Line, label: "Company Info", href: "#" },
      { icon: RiBriefcaseLine, label: "Careers", href: "#" },
      { icon: RiMailLine, label: "Contact Us", href: "#" },
    ],
  },
];

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);

  return (
    <div
      className={`fixed left-0 top-0 h-screen bg-[#f8f9fa] transition-all duration-300 ease-in-out z-40
        ${isCollapsed ? "w-16" : "w-64"} border-r border-gray-200 flex flex-col`}
    >
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-gray-200 bg-white">
        {!isCollapsed && (
          <span className="text-[#1e3a8a] font-bold text-xl">MyStudy</span>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-[#1e3a8a] transition-colors"
        >
          {isCollapsed ? (
            <RiMenuUnfoldLine size={20} />
          ) : (
            <RiMenuFoldLine size={20} />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-3 space-y-2 flex-1 bg-[#f8f9fa]">
        {dropdownItems.map((dropdown, index) => (
          <div
            key={index}
            className="relative"
            onMouseEnter={() => isCollapsed && setHoveredItem({ index })}
            onMouseLeave={() => isCollapsed && setHoveredItem(null)}
          >
            <button
              onClick={() =>
                !isCollapsed &&
                setOpenDropdown(openDropdown === index ? null : index)
              }
              className={`flex items-center w-full px-3 py-2.5 rounded-lg transition-colors
                ${
                  openDropdown === index
                    ? "bg-[#1e3a8a] text-white"
                    : "text-gray-700 hover:bg-white hover:text-[#1e3a8a]"
                }`}
            >
              {isCollapsed && (
                <span className="min-w-[20px]">{dropdown.icon}</span>
              )}

              {!isCollapsed && (
                <>
                  <span className="ml-3 text-sm font-medium">
                    {dropdown.label}
                  </span>
                  <RiArrowDownSLine
                    size={18}
                    className={`ml-auto transform transition-transform duration-200 ${
                      openDropdown === index ? "rotate-180" : ""
                    }`}
                  />
                </>
              )}
            </button>

            {/* Dropdown items for expanded state */}
            {!isCollapsed && openDropdown === index && (
              <div className="mt-1 ml-3 space-y-1">
                {dropdown.links.map((link, subIndex) => (
                  <a
                    key={subIndex}
                    href={link.href}
                    className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-white hover:text-[#1e3a8a] rounded-lg transition-colors"
                  >
                    <link.icon size={16} />
                    <span className="ml-2">{link.label}</span>
                  </a>
                ))}
              </div>
            )}

            {/* Popup menu for collapsed state */}
            {isCollapsed && hoveredItem?.index === index && (
              <div className="absolute left-full top-0 ml-2 bg-white rounded-lg border border-gray-200 shadow-lg py-2 min-w-[200px]">
                <div className="px-4 py-2 text-sm font-medium text-[#1e3a8a] border-b border-gray-200">
                  {dropdown.label}
                </div>
                {dropdown.links.map((link, subIndex) => (
                  <a
                    key={subIndex}
                    href={link.href}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#1e3a8a] transition-colors"
                    onMouseEnter={() => setHoveredItem({ index, subIndex })}
                  >
                    <link.icon size={16} />
                    <span className="ml-2">{link.label}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Profile Section */}
      <div
        className={`border-t border-gray-200 p-4 bg-white ${
          isCollapsed ? "text-center" : ""
        }`}
      >
        {isCollapsed ? (
          <button className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-[#1e3a8a] transition-colors w-full">
            <RiUserSettingsLine size={20} className="mx-auto" />
          </button>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-[#1e3a8a] flex items-center justify-center">
                <RiUserSettingsLine size={18} className="text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900">John Doe</h3>
                <p className="text-xs text-gray-600">Administrator</p>
              </div>
            </div>
            <button className="flex items-center space-x-2 w-full px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-[#1e3a8a] transition-colors">
              <RiLogoutBoxRLine size={18} />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;