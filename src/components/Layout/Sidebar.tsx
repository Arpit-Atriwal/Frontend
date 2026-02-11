// src/components/Layout/Sidebar.tsx

import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { motion } from "framer-motion";
import HomeIcon from "@mui/icons-material/Home";
import ScienceIcon from "@mui/icons-material/Science";
import ControlCameraIcon from "@mui/icons-material/ControlCamera";
import CodeIcon from "@mui/icons-material/Code";
import StorageIcon from "@mui/icons-material/Storage";
import TimelineIcon from "@mui/icons-material/Timeline";

type NavigationPage = "dashboard" | "simulator";

const MuiBox = Box as any;

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: NavigationPage) => void;
}

const Sidebar = ({ currentPage, onPageChange }: SidebarProps) => {
  const menuItems: Array<{
    icon: JSX.Element;
    label: string;
    page: string;
    enabled: boolean;
    badge?: string;
  }> = [
    {
      icon: <HomeIcon />,
      label: "Dashboard",
      page: "dashboard",
      enabled: true,
    },
    {
      icon: <ScienceIcon />,
      label: "Simulator",
      page: "simulator",
      enabled: true,
      badge: "NEW",
    },
    {
      icon: <ControlCameraIcon />,
      label: "Manual Control",
      page: "manual",
      enabled: false,
    },
    {
      icon: <CodeIcon />,
      label: "Programs",
      page: "programs",
      enabled: false,
    },
    {
      icon: <TimelineIcon />,
      label: "Teach Mode",
      page: "teach",
      enabled: false,
    },
    {
      icon: <StorageIcon />,
      label: "Logs",
      page: "logs",
      enabled: false,
    },
  ];

  return (
    <MuiBox
      sx={{
        width: 250,
        height: "100%",
        background:
          "linear-gradient(180deg, rgba(21, 27, 38, 0.9) 0%, rgba(10, 14, 20, 0.9) 100%)",
        backdropFilter: "blur(10px)",
        borderRight: "1px solid rgba(0, 217, 255, 0.2)",
        pt: 2,
      }}
    >
      <List>
        {menuItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <ListItemButton
              selected={currentPage === item.page}
              onClick={() => {
                if (item.page === "dashboard" || item.page === "simulator") {
                  onPageChange(item.page);
                }
              }}
              disabled={!item.enabled}
              sx={{
                mx: 1,
                mb: 1,
                borderRadius: "4px",
                border: "1px solid transparent",
                position: "relative",
                "&.Mui-selected": {
                  bgcolor: "rgba(0, 217, 255, 0.1)",
                  borderColor: "rgba(0, 217, 255, 0.3)",
                  "&:hover": {
                    bgcolor: "rgba(0, 217, 255, 0.15)",
                  },
                },
                "&:hover": {
                  bgcolor: item.enabled
                    ? "rgba(0, 217, 255, 0.05)"
                    : "transparent",
                  borderColor: item.enabled
                    ? "rgba(0, 217, 255, 0.2)"
                    : "transparent",
                },
                "&.Mui-disabled": {
                  opacity: 0.4,
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color:
                    currentPage === item.page
                      ? "#00D9FF"
                      : item.enabled
                        ? "#9AA0A6"
                        : "#555",
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: "0.875rem",
                  fontWeight: currentPage === item.page ? 600 : 400,
                  color:
                    currentPage === item.page
                      ? "#E8EAED"
                      : item.enabled
                        ? "#9AA0A6"
                        : "#555",
                }}
              />
              {item.badge && (
                <MuiBox
                  sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    bgcolor: "#00FF94",
                    color: "#0A0E14",
                    px: 0.75,
                    py: 0.25,
                    borderRadius: "4px",
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    fontFamily: '"JetBrains Mono", monospace',
                    letterSpacing: "0.05em",
                    animation: "pulse 2s ease-in-out infinite",
                    "@keyframes pulse": {
                      "0%, 100%": { opacity: 1 },
                      "50%": { opacity: 0.7 },
                    },
                  }}
                >
                  {item.badge}
                </MuiBox>
              )}
            </ListItemButton>
          </motion.div>
        ))}
      </List>

      {/* Info Section */}
      <MuiBox
        sx={{
          position: "absolute",
          bottom: 16,
          left: 16,
          right: 16,
          p: 2,
          borderRadius: "4px",
          border: "1px solid rgba(0, 217, 255, 0.1)",
          background: "rgba(0, 217, 255, 0.05)",
        }}
      >
        <MuiBox
          sx={{
            fontSize: "0.7rem",
            fontFamily: '"JetBrains Mono", monospace',
            color: "#9AA0A6",
            mb: 0.5,
          }}
        >
          💡 TIP
        </MuiBox>
        <MuiBox
          sx={{
            fontSize: "0.65rem",
            fontFamily: '"JetBrains Mono", monospace',
            color: "#E8EAED",
            lineHeight: 1.4,
          }}
        >
          Use <strong style={{ color: "#00D9FF" }}>Simulator</strong> to test
          without hardware!
        </MuiBox>
      </MuiBox>
    </MuiBox>
  );
};

export default Sidebar;
