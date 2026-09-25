import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaLinkedinIn, FaWhatsapp, FaYoutube, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#1A1A2E] text-white pt-8 sm:pt-10 md:pt-12 pb-0 overflow-hidden mx-auto w-full max-w-[1440px] rounded-t-[1.5rem] sm:rounded-t-[2rem]">
      {/* Main Footer Content */}
      <div className="container mx-auto px-6 sm:px-8 md:px-12 max-w-7xl">
        
        {/* Top Logo & Copyright */}
        <div className="flex flex-col items-center text-center space-y-2 mb-6">
          <Link
            href="/"
            className="group transition-all duration-500 transform hover:scale-105"
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 relative">
              <Image
                src="/logo/os-logo-white.svg"
                alt="OnlyStartups Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>
          <p className="text-white/60 text-[11px] sm:text-sm font-medium px-2 whitespace-nowrap">
            All rights Reserved OnlyStartups. | Copyright © 2026
          </p>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-[#F26522] mb-6 opacity-80"></div>

        {/* 4 Columns */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-2 gap-y-8 sm:gap-8 text-left mb-0">
          
          {/* Column 1: Links */}
          <div className="flex flex-col space-y-2 sm:space-y-3">
            <h4 className="text-base sm:text-xl font-bold text-white mb-1 sm:mb-2">Links</h4>
            <Link href="/about" className="text-white/60 hover:text-[#F26522] transition-colors text-xs sm:text-sm lg:text-base">About</Link>
            <Link href="#" className="text-white/60 hover:text-[#F26522] transition-colors text-xs sm:text-sm lg:text-base">OS Daily</Link>
            <Link href="#" className="text-white/60 hover:text-[#F26522] transition-colors text-xs sm:text-sm lg:text-base">FixThis</Link>
            <Link href="https://onlystartups-gov.vercel.app/" target="_blank" className="text-white/60 hover:text-[#F26522] transition-colors text-xs sm:text-sm lg:text-base leading-tight">Startuphub Onboarding</Link>
          </div>

          {/* Column 2: Legal */}
          <div className="flex flex-col space-y-2 sm:space-y-3">
            <h4 className="text-base sm:text-xl font-bold text-white mb-1 sm:mb-2">Legal</h4>
            <Link href="/terms" className="text-white/60 hover:text-[#F26522] transition-colors text-xs sm:text-sm lg:text-base">Terms & Conditions</Link>
            <Link href="/cookie" className="text-white/60 hover:text-[#F26522] transition-colors text-xs sm:text-sm lg:text-base">Cookie Policy</Link>
            <Link href="/privacy" className="text-white/60 hover:text-[#F26522] transition-colors text-xs sm:text-sm lg:text-base">Privacy Policy</Link>
          </div>

          {/* Column 3: Contact Us */}
          <div className="flex flex-col space-y-2 sm:space-y-3">
            <h4 className="text-base sm:text-xl font-bold text-white mb-1 sm:mb-2">Contact Us</h4>

            <Link href="#" className="text-white/60 hover:text-[#F26522] transition-colors text-xs sm:text-sm lg:text-base">Partner with Us</Link>
          </div>

          {/* Column 4: Social Links & Community */}
          <div className="flex flex-col space-y-2 sm:space-y-3">
            <h4 className="text-base sm:text-xl font-bold text-white mb-1 sm:mb-2">Social Links</h4>
            <div className="flex items-center gap-4 sm:gap-5 text-white/60 mb-2">
              <Link href="https://youtube.com/@onlystartups-app/" target="_blank" className="hover:text-[#F26522] transition-transform transform hover:scale-110">
                <FaYoutube className="w-4 h-4 sm:w-6 sm:h-6" />
              </Link>
              <Link href="https://www.linkedin.com/company/onlystartupsapp/" target="_blank" className="hover:text-[#F26522] transition-transform transform hover:scale-110">
                <FaLinkedinIn className="w-4 h-4 sm:w-6 sm:h-6" />
              </Link>
              <Link href="https://www.instagram.com/onlystartups.app/" target="_blank" className="hover:text-[#F26522] transition-transform transform hover:scale-110">
                <FaInstagram className="w-4 h-4 sm:w-6 sm:h-6" />
              </Link>
            </div>
            
            <h4 className="text-base sm:text-xl font-bold text-white mt-2 sm:mt-4 mb-1 sm:mb-2">Community</h4>
            <div className="flex flex-col space-y-2 sm:space-y-3">
              <Link 
                href="https://chat.whatsapp.com/Ckr97fxzZ2J8PXJ66Onhst?s=cl&p=a&mlu=4" 
                target="_blank" 
                className="text-white/60 hover:text-[#F26522] transition-colors text-xs sm:text-sm lg:text-base"
              >
                Join WhatsApp Community
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Large Watermark Brand Logo */}
      <div className="relative w-full -mt-2 sm:-mt-6 lg:-mt-10 flex justify-center items-center pointer-events-none overflow-hidden opacity-[0.04]">
        <div className="w-full h-20 sm:h-32 md:h-48 lg:h-64 relative translate-y-[30%]">
          <Image
            src="/logo/os-fulltext-white.png"
            alt="OnlyStartups Watermark"
            fill
            className="object-contain object-bottom"
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
