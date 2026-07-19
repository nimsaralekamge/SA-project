import {
  LayoutDashboard,
  UserCircle2,
  Users,
  Briefcase,
  BarChart3,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  icon: LucideIcon;
  label: string;
  active?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: UserCircle2, label: "Profile", active: true },
  { icon: Users, label: "Candidates" },
  { icon: Briefcase, label: "Applications" },
  { icon: BarChart3, label: "AI Analytics" },
  { icon: Settings, label: "Settings" },
];
