import { ShoppingCart, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SITE_CONFIG } from "@/lib/constants";

interface HeaderProps {
  cartItemCount: number;
  onCartOpen: () => void;
}

export const Header = ({ cartItemCount, onCartOpen }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src={SITE_CONFIG.ORGANIZATION_LOGO}
            alt={SITE_CONFIG.ORGANIZATION_NAME}
            className="h-10 w-auto self-start mt-1"
          />
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold bg-ecommerce-hero bg-clip-text text-transparent leading-tight">
              {SITE_CONFIG.SITE_NAME}
            </h1>
            <p className="text-xs text-gray-500 -mt-1">
              A concern of {SITE_CONFIG.ORGANIZATION_NAME}
            </p>
          </div>
        </div>

        <div className="flex-1 max-w-sm mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-10 transition-smooth focus:shadow-ecommerce"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onCartOpen}
            className="relative transition-smooth hover:shadow-ecommerce"
          >
            <ShoppingCart className="h-4 w-4" />
            {cartItemCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {cartItemCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};
