import { Home, Info, Bot, CreditCard, Receipt, KeySquare, Database, UserCog, Mail } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

const links = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/about', label: 'About', icon: Info },
  { to: '/gemini', label: 'Gemini', icon: Bot },
  { to: '/payments', label: 'Payments', icon: CreditCard },
  { to: '/subscriptions', label: 'Subscriptions', icon: Receipt },
  { to: '/permissions', label: 'Permissions', icon: KeySquare },
  { to: '/s3-storage', label: 'S3 Storage', icon: Database },
  { to: '/manage-account', label: 'Manage Account', icon: UserCog },
  { to: '/contact', label: 'Contact', icon: Mail },
]

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {links.map(({ to, label, icon: Icon }) => (
                <SidebarMenuItem key={to} className="transition-colors hover:bg-accent">
                  <SidebarMenuButton asChild>
                    <Link to={to} className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      <span>{label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
