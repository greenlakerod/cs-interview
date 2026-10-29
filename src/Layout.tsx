import React from "react";
import { NavLink } from "react-router-dom";
import { 
  Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, 
  Collapse, Divider, Box, IconButton, Toolbar, Tooltip 
} from "@mui/material";
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  Settings as SettingsIcon,
  ExpandLess,
  ExpandMore,
  FiberManualRecord,
  Hub as HubIcon,
  Home as HomeIcon,
} from "@mui/icons-material";
import { Outlet } from "react-router-dom";
import { DataStructuresRoutes } from "./routes/config";

interface MenuGroups {
  [group: string]: boolean;
}

// Dynamic width constants based on collapse state
const expandedWidth = 240;
const collapsedWidth = 65;

const Layout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  
  // Track open/closed state for each individual nested menu group
  const [openSubMenus, setOpenSubMenus] = React.useState<MenuGroups>({
    ds: false,
    // settings: false,
  });

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  
  const handleCollapseToggle = () => {
    setIsCollapsed(!isCollapsed);
    // Auto-close open dropdowns when collapsing the menu to keep UI clean
    if (!isCollapsed) {
      setOpenSubMenus({ 
        ds: false, 
        // settings: false,
      });
    }
  };

  const toggleSubMenu = (menuKey: string) => {
    // Prevent expanding menus if the drawer is currently completely collapsed
    if (isCollapsed) {
      setIsCollapsed(false); // Auto-expand when a user clicks a group icon
    }
    setOpenSubMenus((prev: any) => ({ ...prev, [menuKey]: !prev[menuKey] }));
  };

  const activeLinkStyles = {
    "&.active": {
      backgroundColor: "action.selected",
      color: "primary.main",
      fontWeight: "bold",
      "& .MuiListItemIcon-root": { color: "primary.main" },
    },
  };

  const navigationSchema = [
    { type: "item", label: "Home", icon: <HomeIcon />, to: "/" },
    {
      type: "group",
      label: "Data Structures",
      key: "ds",
      icon: <HubIcon />,
      // children: [
      //   { label: "All Products", to: "/ds/list" },
      //   { label: "Categories", to: "/ds/categories" },
      // ],
      children: DataStructuresRoutes
        .filter(route => route.path !== "/ds")
        .sort((a, b) => a.menuLabel?.localeCompare(b.menuLabel || "") || 0)
        .map(route => ({
        label: route.menuLabel as string,
        to: route.path as string,
      })),
    },
    // {
    //   type: "group",
    //   label: "Settings",
    //   key: "settings",
    //   icon: <SettingsIcon />,
    //   children: [
    //     { label: "Profile", to: "/settings/profile" },
    //     { label: "Security", to: "/settings/security" },
    //   ],
    // },
  ];

  const drawerContent = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Collapse Action Header */}
      <Toolbar sx={{ display: "flex", justifyContent: isCollapsed ? "center" : "flex-end", px: 1 }}>
        <IconButton onClick={handleCollapseToggle} sx={{ display: { xs: "none", sm: "inline-flex" } }}>
          {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Toolbar>
      <Divider />
      
      <List component="nav" sx={{ flexGrow: 1 }}>
        {navigationSchema.map((node) => {
          if (node.type === "item") {
            return (
              <ListItem key={node.label} disablePadding>
                <Tooltip title={isCollapsed ? node.label : ""} placement="right">
                  <ListItemButton 
                    component={NavLink as any} 
                    to={node.to} 
                    onClick={() => setMobileOpen(false)} 
                    sx={activeLinkStyles}
                  >
                    <ListItemIcon sx={{ minWidth: 0, mr: isCollapsed ? "auto" : 3, justifyContent: "center" }}>
                      {node.icon}
                    </ListItemIcon>
                    <ListItemText primary={node.label} sx={{ opacity: isCollapsed ? 0 : 1, display: isCollapsed ? "none" : "block" }} />
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            );
          }

          if (node.type === "group") {
            const isGroupOpen = openSubMenus[node.key as any];
            return (
              <ListItem key={node.label} disablePadding sx={{ display: "block" }}>
                <Tooltip title={isCollapsed ? node.label : ""} placement="right">
                  <ListItemButton onClick={() => toggleSubMenu(node.key as any)}>
                    <ListItemIcon sx={{ minWidth: 0, mr: isCollapsed ? "auto" : 3, justifyContent: "center" }}>
                      {node.icon}
                    </ListItemIcon>
                    <ListItemText primary={node.label} sx={{ opacity: isCollapsed ? 0 : 1, display: isCollapsed ? "none" : "block" }} />
                    {!isCollapsed && (isGroupOpen ? <ExpandLess /> : <ExpandMore />)}
                  </ListItemButton>
                </Tooltip>
                
                {/* Nested child rows automatically hide when collapsed */}
                <Collapse in={isGroupOpen && !isCollapsed} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {node.children?.map((child) => (
                      <ListItemButton 
                        key={child.label}
                        component={NavLink} 
                        to={child.to} 
                        onClick={() => setMobileOpen(false)} 
                        sx={{ pl: 4, ...activeLinkStyles }}
                      >
                        <ListItemIcon sx={{ minWidth: 0, mr: 3, justifyContent: "center" }}>
                          <FiberManualRecord sx={{ fontSize: 8 }} />
                        </ListItemIcon>
                        <ListItemText primary={child.label} />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </ListItem>
            );
          }
          return null;
        })}
      </List>
    </Box>
  );

  // Compute active dynamic drawer width configuration
  const currentWidth = isCollapsed ? collapsedWidth : expandedWidth;

  return (
    <Box sx={{ display: "flex" }}>
      {/* Mobile-only toggle hamburger icon */}
      <IconButton
        color="inherit"
        edge="start"
        onClick={handleDrawerToggle}
        sx={{ mr: 2, display: { sm: "none" }, position: "absolute", top: 16, left: 16, zIndex: 1101 }}
      >
        <MenuIcon />
      </IconButton>

      {/* Navigation Layout Side Panels */}
      <Box component="nav" sx={{ width: { sm: currentWidth }, flexShrink: { sm: 0 }, transition: "width 0.2s ease-in-out" }}>
        {/* Mobile View Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: expandedWidth },
          }}
        >
          {drawerContent}
        </Drawer>
        
        {/* Desktop View Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": { 
              boxSizing: "border-box", 
              width: currentWidth,
              transition: "width 0.2s ease-in-out",
              overflowX: "hidden"
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Primary Page Canvas Main App Viewport */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          width: { sm: `calc(100% - ${currentWidth}px)` },
          transition: "width 0.2s ease-in-out"
        }}
      >
        <Toolbar sx={{ display: { xs: "block", sm: "none" } }} />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
