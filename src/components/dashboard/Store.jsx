import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/MockAuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { ShoppingBag, Check, Shield, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const ITEMS = [
  { id: 'default', name: 'Default Teacher', price: 0, image: 'https://api.dicebear.com/7.x/bottts/svg?seed=Teacher', type: 'skin' },
  { id: 'neon_bot', name: 'Neon Bot', price: 500, image: 'https://api.dicebear.com/7.x/bottts/svg?seed=Neon', type: 'skin' },
  { id: 'cyber_sensei', name: 'Cyber Sensei', price: 1200, image: 'https://api.dicebear.com/7.x/bottts/svg?seed=Cyber', type: 'skin' },
  { id: 'golden_guru', name: 'Golden Guru', price: 5000, image: 'https://api.dicebear.com/7.x/bottts/svg?seed=Gold', type: 'skin' },
  { id: 'retro_prof', name: 'Retro Prof', price: 2500, image: 'https://api.dicebear.com/7.x/bottts/svg?seed=Retro', type: 'skin' },
];

const Store = () => {
  const { user, purchaseItem, equipItem } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();

  const handlePurchase = (item) => {
    const result = purchaseItem(item.id, item.price);
    if (result.success) {
      toast({
        title: t('store.success'),
        description: `You bought ${item.name}`,
        className: "bg-emerald-500 text-white border-none"
      });
    } else {
      toast({
        title: t('store.insufficient'),
        variant: "destructive"
      });
    }
  };

  const handleEquip = (item) => {
    equipItem(item.id);
    toast({
      title: "Equipped!",
      description: `${item.name} is now your active skin.`,
    });
  };

  return (
    <div className="bg-slate-900/50 border border-emerald-500/20 rounded-2xl p-6 min-h-[500px]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-emerald-400" /> {t('store.title')}
          </h2>
          <p className="text-slate-400">{t('store.subtitle')}</p>
        </div>
        <div className="bg-slate-800 px-4 py-2 rounded-full border border-emerald-500/30">
          <span className="text-yellow-400 font-bold">{user?.coins || 0} Coins</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {ITEMS.map((item) => {
          const isOwned = user?.inventory?.includes(item.id);
          const isEquipped = user?.equippedSkin === item.id;

          return (
            <motion.div
              key={item.id}
              whileHover={{ y: -5 }}
              className={`bg-slate-800/40 rounded-xl overflow-hidden border ${isEquipped ? 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'border-slate-700'}`}
            >
              <div className="p-6 bg-slate-800/50 flex justify-center relative">
                <img src={item.image} alt={item.name} className="w-24 h-24 drop-shadow-lg" />
                {isEquipped && <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full">{t('store.equipped')}</div>}
              </div>

              <div className="p-4">
                <h3 className="font-bold text-white mb-1">{item.name}</h3>
                <p className="text-xs text-slate-400 mb-4 uppercase tracking-wider">{t('store.skins')}</p>

                {isOwned ? (
                  <Button
                    onClick={() => handleEquip(item)}
                    variant={isEquipped ? "outline" : "default"}
                    className={`w-full ${isEquipped ? 'border-emerald-500 text-emerald-500 bg-transparent' : 'bg-slate-700 hover:bg-slate-600'}`}
                    disabled={isEquipped}
                  >
                    {isEquipped ? <Check className="w-4 h-4 mr-2" /> : t('store.equip')}
                  </Button>
                ) : (
                  <Button
                    onClick={() => handlePurchase(item)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                  >
                    {t('store.buy')} • {item.price}
                  </Button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Store;