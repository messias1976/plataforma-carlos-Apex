import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const FloatingReclameAqui = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
            <motion.a
                href="https://www.reclameaqui.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-6 right-6 z-50 group"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <div className="bg-gradient-to-tr from-green-600 to-green-400 rounded-full p-3 shadow-lg hover:shadow-green-500/50 transition-all border-2 border-white">
                    <MessageCircle className="w-8 h-8 text-white" />
                </div>
            </motion.a>
        </TooltipTrigger>
        <TooltipContent side="left" className="bg-slate-900 text-white border-slate-800">
            <p>Reclame Aqui</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default FloatingReclameAqui;