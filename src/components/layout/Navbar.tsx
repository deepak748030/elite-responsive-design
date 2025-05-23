import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User, Menu, X, LogIn, UserPlus } from 'lucide-react';
import Button from '@/components/common/Button';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState('user');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setMobileMenuOpen(false), [location]);

  useEffect(() => {
    const authData = localStorage.getItem('auth');
    if (authData) {
      const user = JSON.parse(authData)?.user;
      if (user?.role) setUserRole(user.role);
    }
  }, []);

  const handleUserClick = async () => {
    try {
      const authData = localStorage.getItem('auth');
      if (authData) {
        const user = JSON.parse(authData)?.user;
        user ? navigate('/profile') : navigate('/auth/login');
      } else {
        navigate('/auth/login');
      }
    } catch (error) {
      console.error('Error retrieving data from localStorage:', error);
      navigate('/auth/login');
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Service', path: '/services' },
    { name: 'Contact Us', path: '/contact' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/logo.png" alt="Logo" className="h-10" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  'text-base font-medium transition-colors hover:text-brand-blue relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:scale-x-0 after:bg-brand-blue after:transition-transform hover:after:scale-x-100',
                  location.pathname === link.path
                    ? 'text-brand-blue after:scale-x-100'
                    : 'text-gray-700'
                )}
              >
                {link.name}
              </Link>
            ))}
            {userRole === 'admin' && (
              <Link to="/admin" className="text-base font-medium text-gray-700 transition-colors hover:text-brand-blue">
                Dashboard
              </Link>
            )}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {/* <Button variant="primary">Hire Now &rarr;</Button> */}
            <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-all" onClick={handleUserClick} aria-label="User">
              <User className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}>
            {mobileMenuOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg p-4 animate-slide-down">
          <nav className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  'text-base font-medium p-2 rounded',
                  location.pathname === link.path ? 'bg-brand-blue/10 text-brand-blue' : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                {link.name}
              </Link>
            ))}
            {userRole === 'admin' && (
              <Link to="/admin" className="text-base font-medium text-gray-700 hover:text-brand-blue ps-2">Dashboard</Link>
            )}
            {/* <Button variant="primary" fullWidth>Hire Now</Button> */}
            <div className="grid grid-cols-2 gap-2">
              <button onClick={handleUserClick} className="p-2 rounded bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200">
                <User className="w-5 h-5 mr-2" /> Profile
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;