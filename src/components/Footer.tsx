import { SITE_CONFIG } from "@/lib/constants";
import { Heart, ExternalLink } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src={SITE_CONFIG.ORGANIZATION_LOGO}
                alt={SITE_CONFIG.ORGANIZATION_NAME}
                className="h-10 w-auto"
              />
              <div>
                <h3 className="text-xl font-bold">{SITE_CONFIG.SITE_NAME}</h3>
                <p className="text-gray-400 text-sm">
                  A concern of {SITE_CONFIG.ORGANIZATION_NAME}
                </p>
              </div>
            </div>
            <p className="text-gray-300 mb-4">{SITE_CONFIG.SITE_TAGLINE}</p>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Get in Touch</h4>
            <div className="space-y-2 text-gray-300">
              <p>
                <span className="text-gray-400">Email:</span>{" "}
                <a
                  href={`mailto:${SITE_CONFIG.SUPPORT_EMAIL}`}
                  className="hover:text-white transition-colors"
                >
                  {SITE_CONFIG.SUPPORT_EMAIL}
                </a>
              </p>
              <p>
                <span className="text-gray-400">Phone:</span>{" "}
                <a
                  href={`tel:${SITE_CONFIG.SUPPORT_PHONE}`}
                  className="hover:text-white transition-colors"
                >
                  {SITE_CONFIG.SUPPORT_PHONE}
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Payment & Security */}
        <div className="mt-4">
          <h4 className="font-semibold mb-4">Secure Payment</h4>
          <div className="mb-4">
            <img
              src={SITE_CONFIG.PAYMENT_LOGO_LARGE}
              alt="SSLCommerz Payment Gateway"
              className="mb-2"
            />
            <p className="text-gray-400 text-sm">
              Secure 256-bit SSL encrypted payment processing
            </p>
          </div>
        </div>

        {/* Developer Attribution */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <img
                src={SITE_CONFIG.DEVELOPER_LOGO}
                alt={SITE_CONFIG.DEVELOPER_NAME}
                className="h-10 w-auto bg-white p-1"
              />
              <div>
                <p className="text-white font-medium">
                  Developed by {SITE_CONFIG.DEVELOPER_NAME}
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-6 pt-6 border-t border-gray-700">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} {SITE_CONFIG.SITE_NAME} - A concern
              of {SITE_CONFIG.ORGANIZATION_NAME}. All rights reserved. Powered
              by {SITE_CONFIG.DEVELOPER_NAME}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
