import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Menu, MoveRight, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export function ModernHeader() {
  const logo = '/lovable-uploads/8721330a-f235-4c3b-9c21-85436a192135.png';

  const navigationItems = [
    {
      title: "Home",
      href: "/",
      description: "",
    },
    {
      title: "Forums",
      description: "Verken onze verschillende forum categorieën en join de discussie",
      items: [
        {
          title: "Alle Categorieën",
          href: "/forums",
        },
        {
          title: "Top Verkopers",
          href: "/forums/top-verkopers-gescreend",
        },
        {
          title: "Algemeen Forum",
          href: "/forums/algemeen-forum",
        },
        {
          title: "Wiet Aangeboden",
          href: "/forums/wiet-online-kopen",
        },
      ],
    },
    {
      title: "Community",
      description: "Ontdek onze community features en leaderboards",
      items: [
        {
          title: "Leden",
          href: "/members",
        },
        {
          title: "Leaderboard",
          href: "/leaderboard",
        },
        {
          title: "Gamification",
          href: "/gamification",
        },
        {
          title: "Berichten",
          href: "/messages",
        },
      ],
    },
  ];

  const [isOpen, setOpen] = useState(false);

  return (
    <header className="w-full z-40 fixed top-0 left-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/50">
      <div className="container relative mx-auto min-h-20 flex gap-4 flex-row lg:grid lg:grid-cols-3 items-center px-4">
        {/* Desktop Navigation - Left */}
        <div className="justify-start items-center gap-4 lg:flex hidden flex-row">
          <NavigationMenu className="flex justify-start items-start">
            <NavigationMenuList className="flex justify-start gap-4 flex-row">
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.title}>
                  {item.href ? (
                    <NavigationMenuLink asChild>
                      <Link to={item.href}>
                        <Button variant="ghost" className="modern-header-nav-item">
                          {item.title}
                        </Button>
                      </Link>
                    </NavigationMenuLink>
                  ) : (
                    <>
                      <NavigationMenuTrigger className="font-medium text-sm modern-header-nav-item">
                        {item.title}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent className="!w-[450px] p-4">
                        <div className="flex flex-col lg:grid grid-cols-2 gap-4">
                          <div className="flex flex-col h-full justify-between">
                            <div className="flex flex-col">
                              <p className="text-base font-semibold">{item.title}</p>
                              <p className="text-muted-foreground text-sm">
                                {item.description}
                              </p>
                            </div>
                            <Button 
                              size="sm" 
                              className="mt-10 modern-header-cta"
                              asChild
                            >
                              <Link to="/register">
                                Word Lid Vandaag
                              </Link>
                            </Button>
                          </div>
                          <div className="flex flex-col text-sm h-full justify-end">
                            {item.items?.map((subItem) => (
                              <Link
                                to={subItem.href}
                                key={subItem.title}
                                className="flex flex-row justify-between items-center hover:bg-muted py-2 px-4 rounded transition-colors"
                              >
                                <span>{subItem.title}</span>
                                <MoveRight className="w-4 h-4 text-muted-foreground" />
                              </Link>
                            ))}
                          </div>
                        </div>
                      </NavigationMenuContent>
                    </>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Logo - Center */}
        <div className="flex lg:justify-center">
          <Link to="/" className="flex items-center">
            <img 
              src={logo} 
              alt="Wiet Forum België" 
              className="h-12 w-auto transition-opacity hover:opacity-80"
            />
          </Link>
        </div>

        {/* CTA Buttons - Right */}
        <div className="flex justify-end w-full gap-4">
          <Button 
            variant="ghost" 
            className="hidden md:inline modern-header-nav-item"
            asChild
          >
            <Link to="/forums">
              Verken Forums
            </Link>
          </Button>
          <div className="border-r hidden md:inline"></div>
          <Button 
            variant="outline"
            asChild
          >
            <Link to="/login">
              Inloggen
            </Link>
          </Button>
          <Button 
            className="modern-header-cta"
            asChild
          >
            <Link to="/register">
              Registreren
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex w-12 shrink lg:hidden items-end justify-end">
          <Button variant="ghost" onClick={() => setOpen(!isOpen)}>
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
          {isOpen && (
            <div className="absolute top-20 border-t flex flex-col w-full right-0 bg-background shadow-lg py-4 container gap-8">
              {navigationItems.map((item) => (
                <div key={item.title}>
                  <div className="flex flex-col gap-2">
                    {item.href ? (
                      <Link
                        to={item.href}
                        className="flex justify-between items-center"
                        onClick={() => setOpen(false)}
                      >
                        <span className="text-lg">{item.title}</span>
                        <MoveRight className="w-4 h-4 stroke-1 text-muted-foreground" />
                      </Link>
                    ) : (
                      <p className="text-lg font-semibold">{item.title}</p>
                    )}
                    {item.items &&
                      item.items.map((subItem) => (
                        <Link
                          key={subItem.title}
                          to={subItem.href}
                          className="flex justify-between items-center pl-4"
                          onClick={() => setOpen(false)}
                        >
                          <span className="text-muted-foreground">
                            {subItem.title}
                          </span>
                          <MoveRight className="w-4 h-4 stroke-1" />
                        </Link>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
