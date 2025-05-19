'use client'
import { useState, useEffect } from 'react';
import { Sparkles, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { ModeToggle } from '@/components/mode-toggle';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 w-full transition-all duration-300 z-50 ${
        scrolled 
          ? 'bg-background/80 backdrop-blur-md shadow-lg py-2' 
          : 'bg-background py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo Section with Animation */}
          <div className="flex items-center gap-2 group">
            <div className={`bg-gradient-to-r from-primary to-purple-500 p-2 rounded-lg transform transition-all duration-500 group-hover:rotate-12 group-hover:scale-110 ${scrolled ? 'shadow-md' : 'shadow-lg'}`}>
              <Sparkles className="h-6 w-6 text-white animate-pulse" />
            </div>
            <Link href="/" className={`text-xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent transition-all hover:scale-105 ${scrolled ? '' : 'text-2xl'}`}>
              Cortex
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {[
              { href: '/', label: 'Home' },
              { href: '/create', label: 'Create' },
              { href: '/gallery', label: 'Gallery' },
              { href: '/pricing', label: 'Pricing' }
            ].map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className="relative text-sm font-medium hover:text-primary transition-colors group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Right Side - CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <ModeToggle />
            <Link
              href="/auth/sign-in"
              className="text-sm font-medium px-4 py-2 rounded-md border border-transparent hover:border-primary/30 hover:text-primary transition-all duration-300"
            >
              Sign In
            </Link>
            <Link
              href="/auth/sign-up"
              className={`text-sm font-medium px-4 py-2 rounded-md bg-gradient-to-r from-primary to-purple-500 text-white hover:shadow-lg hover:scale-105 transition-all duration-300 '
              `}
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden flex items-center p-2 rounded-full hover:bg-accent transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-lg shadow-lg transition-all duration-300 ease-in-out overflow-hidden ${
          mobileMenuOpen ? 'max-h-screen py-4' : 'max-h-0'
        }`}
      >
        <div className="container mx-auto px-4 flex flex-col gap-4">
          <nav className="flex flex-col gap-4">
            {[
              { href: '/', label: 'Home' },
              { href: '/create', label: 'Create' },
              { href: '/gallery', label: 'Gallery' },
              { href: '/pricing', label: 'Pricing' }
            ].map((link) => (
              <Link
                key={link.href} 
                href={link.href} 
                className="text-lg font-medium py-2 border-b border-accent/30 hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-4 mt-2">
            <Link
              href="/auth/sign-in"
              className="text-center text-sm font-medium py-3 rounded-md border border-primary/30 hover:bg-accent/50 transition-all duration-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sign In
            </Link>
            <Link
              href="/auth/sign-up"
              className="text-center text-sm font-medium py-3 rounded-md bg-gradient-to-r from-primary to-purple-500 text-white hover:shadow-lg transition-all duration-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}