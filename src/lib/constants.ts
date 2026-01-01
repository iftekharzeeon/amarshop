// Site configuration constants
export const SITE_CONFIG = {
  // E-commerce site branding
  SITE_NAME: "e-Shop",
  ORGANIZATION_NAME: "Prefeex Ltd.",
  SITE_TAGLINE: "Your Trusted Online Store",
  ORGANIZATION_LOGO: "/prefeex.png",

  // Developer branding
  DEVELOPER_NAME: "Pridesys IT Ltd",
  DEVELOPER_LOGO: "/Pridesys-It-Ltd.svg",
  DEVELOPER_FAVICON: "/pridesys_favicon.jpeg",
  DEVELOPER_WEBSITE: "https://pridesys.com",

  // Payment gateway
  PAYMENT_GATEWAY: "SSLCommerz",
  PAYMENT_LOGO:
    "https://securepay.sslcommerz.com/public/image/SSLCommerz-Pay-With-logo-All-Size-05.png",
  PAYMENT_LOGO_LARGE:
    "https://securepay.sslcommerz.com/public/image/SSLCommerz-Pay-With-logo-All-Size-03.png",

  // Contact info
  SUPPORT_EMAIL: "support@pridesys.com",
  SUPPORT_PHONE: "+880 1700-000000",

  // Currency settings
  CURRENCY: "BDT",
  CURRENCY_SYMBOL: "৳",
} as const;

// Currency formatting utility
export const formatPrice = (price: number): string => {
  return `${SITE_CONFIG.CURRENCY_SYMBOL}${price.toLocaleString("en-BD")}`;
};

export type SiteConfig = typeof SITE_CONFIG;

export const ALTERNATE_PRODUCT_IMAGE =
  "https://ik.imagekit.io/dns5janxf/image.png?updatedAt=1752464563650";
