import { Link, usePage } from '@inertiajs/react';
import {
    BookHeart,
    Brain,
    FileText,
    LayoutGrid,
    MessageCircleHeart,
    ShieldCheck,
    Sparkles,
    MessageCircle,
    BookOpen,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

type PageProps = {
    auth: {
        user?: {
            role?: string;
        };
    };
};

export function AppSidebar() {
    const { auth } = usePage<PageProps>().props;
    const isAdmin = auth.user?.role === 'admin';

    const mainNavItems: NavItem[] = [
        {
            title: 'Mi Progreso',
            href: dashboard(),
            icon: FileText,
        },
        {
            title: 'Chat con IA',
            href: '/chat',
            icon: MessageCircle,
        },
        {
            title: 'Cuestionarios',
            href: '/assessments',
            icon: Brain,
        },
        {
            title: 'Recursos',
            href: '/resources',
            icon: BookOpen,
        },
        {
            title: 'Diario emocional',
            href: '/journal',
            icon: BookHeart,
        },
        {
            title: 'Feedback',
            href: '/feedback',
            icon: MessageCircleHeart,
        },
        {
            title: 'Encuestas',
            href: '/surveys',
            icon: Sparkles,
        },
        ...(isAdmin
            ? [
                  {
                      title: 'Admin',
                      href: '/admin/dashboard',
                      icon: ShieldCheck,
                  },
              ]
            : []),
    ];

    const footerNavItems: NavItem[] = [
        {
            title: 'Soporte',
            href: '/feedback',
            icon: MessageCircleHeart,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
