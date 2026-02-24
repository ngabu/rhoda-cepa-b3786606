import { useState } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  LayoutDashboard,
  Building2,
  FileText,
  Shield,
  ChevronDown,
  ChevronRight,
  FileCheck,
  BarChart3,
  Bot,
  Bell,
  User,
  Cog,
  LogOut,
} from "lucide-react"
import pngEmblem from "@/assets/png-emblem.png"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useDirectorateNotifications } from "@/hooks/useDirectorateNotifications"
import { useAuth } from "@/contexts/AuthContext"
import { Badge } from "@/components/ui/badge"

interface NavigationItem {
  title: string
  value: string
  icon: React.ComponentType<{ className?: string }>
  subItems?: NavigationItem[]
}

const navigationItems: NavigationItem[] = [
  { title: "Dashboard", value: "dashboard", icon: LayoutDashboard },
  {
    title: "Listings",
    value: "listings",
    icon: FileText,
    subItems: [
      { title: "Entities", value: "listings-entities", icon: Building2 },
      { title: "Intents", value: "listings-intents", icon: FileText },
      { title: "Permits", value: "listings-permits", icon: Shield },
    ],
  },
  { title: "Approvals and Signatures", value: "approvals-signatures", icon: FileCheck },
  { title: "Reports and Analytics", value: "analytics-reporting", icon: BarChart3 },
  { title: "AI Analytics", value: "ai-analytics", icon: Bot },
]

const endMenuItems: NavigationItem[] = [
  { title: "Notifications", value: "notifications", icon: Bell },
]

const accountItems: NavigationItem[] = [
  { title: "Profile", value: "profile", icon: User },
  { title: "Settings", value: "settings", icon: Cog },
]

interface ManagingDirectorSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function ManagingDirectorSidebar({ activeTab, onTabChange }: ManagingDirectorSidebarProps) {
  const { state, isMobile, setOpenMobile } = useSidebar()
  const { profile, signOut } = useAuth()
  const { unreadCount } = useDirectorateNotifications(profile?.user_id)
  const [openSubMenus, setOpenSubMenus] = useState<string[]>(["listings"])

  const handleTabChange = (tab: string) => {
    onTabChange(tab)
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const toggleSubMenu = (value: string) => {
    setOpenSubMenus((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    )
  }

  const isCollapsed = state === "collapsed"

  const getNavCls = (isActive: boolean) =>
    isActive 
      ? "bg-white/20 text-white font-medium shadow-glow backdrop-blur-sm" 
      : "text-white/80 hover:bg-white/10 hover:text-white transition-all duration-200"

  return (
    <Sidebar
      className="border-r border-white/30 bg-primary/95 backdrop-blur-2xl shadow-xl"
      collapsible="icon"
    >
      <SidebarContent className="p-0 bg-gradient-to-b from-primary/90 to-primary/80 backdrop-blur-2xl">
        {/* Branding */}
        <div className={`pb-8 bg-primary-glow/90 backdrop-blur-xl mb-4 shadow-glow ${isCollapsed ? 'p-2 rounded-br-[2rem]' : 'p-6 rounded-br-[4rem]'}`}>
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
            <div className={`bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-glow-accent p-1 ${isCollapsed ? 'w-8 h-8' : 'w-10 h-10'}`}>
              <img src={pngEmblem} alt="PNG Emblem" className="w-full h-full object-contain" />
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="font-bold text-white text-lg">PNG CEPA E-permit</h2>
                <p className="text-xs text-white/70">Managing Director</p>
              </div>
            )}
          </div>
        </div>

        <div className={isCollapsed ? 'px-2' : 'px-4'}>
          <SidebarGroup>
            {!isCollapsed && <SidebarGroupLabel className="text-white/60 text-xs uppercase tracking-wider mb-2">Executive Operations</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationItems.map((item) =>
                  item.subItems ? (
                    <Collapsible
                      key={item.value}
                      open={openSubMenus.includes(item.value)}
                      onOpenChange={() => toggleSubMenu(item.value)}
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton className={`w-full ${getNavCls(activeTab.startsWith(item.value))}`}>
                            <item.icon className="w-5 h-5 shrink-0" />
                            {!isCollapsed && (
                              <>
                                <span className="ml-3 flex-1 text-left">{item.title}</span>
                                {openSubMenus.includes(item.value) ? (
                                  <ChevronDown className="w-4 h-4" />
                                ) : (
                                  <ChevronRight className="w-4 h-4" />
                                )}
                              </>
                            )}
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="ml-4 mt-1 space-y-1">
                            {item.subItems.map((subItem) => (
                              <SidebarMenuButton
                                key={subItem.value}
                                onClick={() => handleTabChange(subItem.value)}
                                className={`w-full ${getNavCls(activeTab === subItem.value)}`}
                              >
                                <subItem.icon className="w-4 h-4 shrink-0" />
                                {!isCollapsed && <span className="ml-3 flex-1 text-left">{subItem.title}</span>}
                              </SidebarMenuButton>
                            ))}
                          </div>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  ) : (
                    <SidebarMenuItem key={item.value}>
                      <SidebarMenuButton asChild>
                        <button
                          onClick={() => handleTabChange(item.value)}
                          className={`w-full ${getNavCls(activeTab === item.value)}`}
                        >
                          <item.icon className="w-5 h-5 shrink-0" />
                          {!isCollapsed && <span className="ml-3 flex-1 text-left">{item.title}</span>}
                        </button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup className="mt-6">
            {!isCollapsed && <SidebarGroupLabel className="text-white/60 text-xs uppercase tracking-wider mb-2">Notifications</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {endMenuItems.map((item) => (
                  <SidebarMenuItem key={item.value}>
                    <SidebarMenuButton asChild>
                      <button
                        onClick={() => handleTabChange(item.value)}
                        className={`w-full ${getNavCls(activeTab === item.value)} relative`}
                      >
                        <item.icon className="w-5 h-5 shrink-0" />
                        {!isCollapsed && <span className="ml-3 flex-1 text-left">{item.title}</span>}
                        {unreadCount > 0 && (
                          <Badge 
                            variant="destructive" 
                            className={`${isCollapsed ? 'absolute -top-1 -right-1' : ''} h-5 min-w-[1.25rem] rounded-full p-0 flex items-center justify-center text-xs`}
                          >
                            {unreadCount > 99 ? '99+' : unreadCount}
                          </Badge>
                        )}
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup className="mt-6">
            {!isCollapsed && <SidebarGroupLabel className="text-white/60 text-xs uppercase tracking-wider mb-2">Account</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {accountItems.map((item) => (
                  <SidebarMenuItem key={item.value}>
                    <SidebarMenuButton asChild>
                      <button
                        onClick={() => handleTabChange(item.value)}
                        className={`w-full ${getNavCls(activeTab === item.value)}`}
                      >
                        <item.icon className="w-5 h-5 shrink-0" />
                        {!isCollapsed && <span className="ml-3 flex-1 text-left">{item.title}</span>}
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-white/80 hover:bg-red-500/20 hover:text-white transition-all duration-200 backdrop-blur-sm"
                    >
                      <LogOut className="w-5 h-5 shrink-0" />
                      {!isCollapsed && <span className="ml-3 flex-1 text-left">Sign Out</span>}
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}
