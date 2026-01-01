import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { ShoppingCart } from "@/components/ShoppingCart";
import { PaymentStatus } from "@/components/PaymentStatus";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ALTERNATE_PRODUCT_IMAGE, SITE_CONFIG, formatPrice } from "@/lib/constants";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  inStock: boolean;
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

const Index = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch products from database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("Fetching products from database...");
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("id");

        if (error) {
          console.error("Error fetching products:", error);
          toast({
            title: "Error",
            description:
              "Failed to load products. Please check your connection.",
            variant: "destructive",
          });
          return;
        }

        console.log("Products fetched:", data);

        if (data) {
          // Transform database products to match our interface
          const transformedProducts: Product[] = data.map((product) => ({
            id: product.id,
            name: product.name,
            price: product.price,
            originalPrice: product.original_price || undefined,
            image: product.image_url || ALTERNATE_PRODUCT_IMAGE,
            category: product.category,
            rating: product.rating,
            inStock: product.in_stock,
          }));

          console.log("Transformed products:", transformedProducts);
          setProducts(transformedProducts);

          // Extract unique categories
          const uniqueCategories = [
            "All",
            ...new Set(data.map((p) => p.category)),
          ];
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        toast({
          title: "Error",
          description: "Failed to load products. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [toast]);

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  const addToCart = (product: Product) => {
    const existingItem = cartItems.find((item) => item.id === product.id);

    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems([
        ...cartItems,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1,
        },
      ]);
    }

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity === 0) {
      setCartItems(cartItems.filter((item) => item.id !== id));
    } else {
      setCartItems(
        cartItems.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    }
  };

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
    toast({
      title: "Item removed",
      description: "Item has been removed from your cart.",
    });
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to your cart before checkout.",
        variant: "destructive",
      });
      return;
    }

    setIsCartOpen(false);
    navigate("/checkout", { state: { cartItems } });
  };

  const handleCheckoutSuccess = () => {
    setCartItems([]);
  };

  const viewProductDetails = (product: Product) => {
    toast({
      title: product.name,
      description: `Price: ${formatPrice(product.price)} - ${
        product.inStock ? "In Stock" : "Out of Stock"
      }`,
    });
  };

  const totalCartItems = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-background">
      <PaymentStatus />
      <Header
        cartItemCount={totalCartItems}
        onCartOpen={() => setIsCartOpen(true)}
      />

      {/* Hero Section */}
      <section className="bg-ecommerce-hero text-white py-16">
        <div className="container text-center">
          <h1 className="text-5xl font-bold mb-4">Premium Store</h1>
          <p className="text-xl mb-8 opacity-90">
            Discover the best products at unbeatable prices!
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="transition-bounce hover:scale-105"
          >
            Shop Now
          </Button>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 border-b">
        <div className="container">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="transition-smooth"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No products found.</p>
              <Button
                onClick={() => window.location.reload()}
                className="mt-4"
                variant="outline"
              >
                Refresh
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                  onViewDetails={viewProductDetails}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <ShoppingCart
        items={cartItems}
        isOpen={isCartOpen}
        onOpenChange={setIsCartOpen}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onCheckout={handleCheckout}
      />

      <Footer />
    </div>
  );
};

export default Index;
