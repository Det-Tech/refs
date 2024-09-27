import { IMenu } from "./interfaces"
import {
  // WindowIcon,
  // DocumentChartBarIcon,
  CircleStackIcon,
  WifiIcon,
} from "@heroicons/react/24/outline"

export const menus: IMenu[] = [
  // {
  //   icon: WindowIcon,
  //   title: "Dashboard",
  //   link: "/",
  // },
  // {
  //   icon: DocumentChartBarIcon,
  //   title: "Properties",
  //   link: "/properties",
  // },
  {
    icon: CircleStackIcon,
    title: "Datas",
    link: "/datas",
  },
  {
    icon: WifiIcon,
    title: "Access",
    link: "/access",
  },
]
