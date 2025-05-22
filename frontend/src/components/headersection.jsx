import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import React from "react";

export const HeaderSection = () => {
  // Navigation menu items data
  const navItems = [
    { label: "Главная", active: true },
    { label: "Каталог", active: false },
    { label: "Трансляции", active: false },
  ];

  return (
    <header className="flex h-16 items-center justify-between px-6 bg-[#1a1a1a] w-full">
      {/* Logo section */}
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-white rounded-sm flex items-center justify-center">
          <img className="w-10 h-10" alt="Logo" src="" />
        </div>
        <span className="font-bold text-white text-lg font-['Montserrat-Bold',Helvetica]">
          WOMP
        </span>
      </div>

      {/* Navigation menu */}
      <NavigationMenu className="mx-auto">
        <NavigationMenuList className="flex gap-8">
          {navItems.map((item, index) => (
            <NavigationMenuItem key={index}>
              <NavigationMenuLink
                className={`text-sm font-medium font-['Inter-Medium',Helvetica] ${
                  item.active ? "text-white" : "text-[#aaaaaa]"
                } hover:text-white transition-colors`}
              >
                {item.label}
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>

      {/* User avatar */}
      <Avatar className="w-10 h-10 bg-[#2a2a2a] rounded-[20px]">
        <AvatarFallback className="font-semibold text-white text-base font-['Inter-SemiBold',Helvetica]">
          Н
        </AvatarFallback>
      </Avatar>
    </header>
  );
};

export default HeaderSection;
