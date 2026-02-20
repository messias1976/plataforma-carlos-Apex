import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Search, Menu, X, Globe, User, LogOut, ShieldAlert, Bot, Crown, LayoutDashboard, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from '@/contexts/MockAuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { useAdmin } from '@/contexts/AdminContext';
import { useSubscription } from '@/hooks/useSubscription';
import { useNavigate } from 'react-router-dom';
import AITeacher from './AITeacher';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const { user, logout } = useAuth();
  const { t, language, changeLanguage } = useTranslation();
  const { isAdmin } = useAdmin();
  const { planType } = useSubscription();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('selectedPlan');
    logout();
  };

  const handleLanguageChange = (lang) => {
      changeLanguage(lang);
  };

  const planColors = {
    free: 'bg-slate-700',
    standard: 'bg-blue-600',
    premium: 'bg-orange-500'
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-xl supports-[backdrop-filter]:bg-slate-950/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-neon-500 to-blue-500"></div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              APEX
            </span>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {/* Admin Links */}
            {isAdmin && (
              <div className="flex items-center gap-2 mr-4 border-r border-slate-700 pr-4">
                 <Button variant="ghost" size="sm" onClick={() => navigate('/admin')} className="text-purple-400 hover:text-purple-300">
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Admin
                 </Button>
                 <Button variant="ghost" size="sm" onClick={() => navigate('/admin/content-editor')} className="text-slate-400 hover:text-white">
                    <Edit className="w-4 h-4 mr-2" />
                    Editor
                 </Button>
              </div>
            )}

            {/* Plan Badge */}
            <Badge className={`${planColors[planType] || 'bg-slate-700'} text-white border-none flex items-center gap-1 px-3 py-1 capitalize`}>
                {planType === 'premium' && <Crown className="w-3 h-3 text-yellow-300 fill-current" />}
                {planType || 'Free'}
            </Badge>

            {/* Removed Agente Button from here as requested */}

            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 px-2 h-9 transition-all duration-200">
                  <Globe className="w-4 h-4 text-slate-400" />
                  <span className="text-sm uppercase font-bold text-slate-300">{language}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-white animate-in fade-in slide-in-from-top-2">
                <DropdownMenuLabel className="text-xs text-slate-500">{t('dashboard.header.language')}</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-800" />
                <DropdownMenuItem onClick={() => handleLanguageChange('pt')} className="cursor-pointer focus:bg-slate-800 flex justify-between">
                   Português (BR) {language === 'pt' && <span className="text-neon-500">✓</span>}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLanguageChange('en')} className="cursor-pointer focus:bg-slate-800 flex justify-between">
                   English (US) {language === 'en' && <span className="text-neon-500">✓</span>}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full ml-2">
                  <Avatar className="h-9 w-9 border border-slate-700">
                    <AvatarImage src={user?.avatar_url} alt={user?.email} />
                    <AvatarFallback className="bg-neon-500/20 text-neon-500">
                      {user?.email?.[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-slate-900 border-slate-800 text-white" align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.full_name || t('dashboard.header.student')}</p>
                    <p className="text-xs leading-none text-slate-400">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-800" />
                <DropdownMenuItem className="cursor-pointer focus:bg-slate-800">
                  <User className="mr-2 h-4 w-4" />
                  <span>{t('dashboard.header.profile')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer focus:bg-slate-800 text-red-400 focus:text-red-400" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t('dashboard.header.logout')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Explicit Logout Button (Desktop) */}
            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-slate-400 hover:text-red-400 hover:bg-red-950/20">
                <LogOut className="w-5 h-5" />
            </Button>
          </div>

          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
        
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-slate-800 bg-slate-950"
            >
              <div className="p-4 space-y-4">
                 <div className="flex items-center justify-between mb-4">
                     <span className="text-sm text-slate-400">Plan:</span>
                     <Badge className={`${planColors[planType]} capitalize`}>{planType}</Badge>
                 </div>
                
                {isAdmin && (
                  <div className="space-y-2 pb-2 border-b border-slate-800 mb-2">
                     <Button className="w-full justify-start text-purple-400" variant="ghost" onClick={() => navigate('/admin')}>
                        <LayoutDashboard className="w-4 h-4 mr-2" /> {t('dashboard.header.adminDashboard')}
                     </Button>
                     <Button className="w-full justify-start text-purple-400" variant="ghost" onClick={() => navigate('/admin/content-editor')}>
                        <Edit className="w-4 h-4 mr-2" /> {t('dashboard.header.contentEditor')}
                     </Button>
                  </div>
                )}

                 <Button 
                  className="w-full justify-start text-slate-300" 
                  variant="ghost" 
                  onClick={() => changeLanguage(language === 'en' ? 'pt' : 'en')}
                >
                  <Globe className="w-4 h-4 mr-2" /> {language === 'en' ? 'Português' : 'English'}
                </Button>
                <Button className="w-full justify-start text-red-400" variant="ghost" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" /> {t('dashboard.header.logout')}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <AITeacher isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
    </>
  );
};

export default Header;