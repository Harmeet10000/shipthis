import { type ReactNode } from 'react'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Navbar } from '@/components/layout/Navbar'
import { AppSidebar } from '@/components/layout/AppSidebar'
import { MagicFooter } from '@/components/layout/MagicFooter'

interface MainLayoutProps {
    children: ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
    return (
        <SidebarProvider>
            <div className="min-h-screen bg-background text-foreground">
                <AppSidebar />
                <SidebarInset>
                    <div className="md:ml-64 transition-[margin]">
                        <Navbar />

                        <div className="container mx-auto px-4 py-8">
                            <div className="motion-safe:animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
                                {children}
                            </div>
                        </div>

                        <MagicFooter />
                    </div>
                </SidebarInset>
            </div>
        </SidebarProvider>
    )
}

export default MainLayout
