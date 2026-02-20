import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import ContentList from './ContentList';
import ContentForm from './ContentForm';
import { useTranslation } from '@/hooks/useTranslation';
import { Separator } from '@/components/ui/separator';

const TopicContentManager = ({ topic, onBack }) => {
    const [isContentFormOpen, setIsContentFormOpen] = useState(false);
    const [editingContent, setEditingContent] = useState(null);
    const [refreshContent, setRefreshContent] = useState(0);
    const { t } = useTranslation();

    const handleCreateContent = () => {
        setEditingContent(null);
        setIsContentFormOpen(true);
    };

    const handleEditContent = (content) => {
        setEditingContent(content);
        setIsContentFormOpen(true);
    };

    const handleContentSuccess = () => {
        setRefreshContent(prev => prev + 1);
    };

    return (
        <div>
             <div className="flex items-start justify-between mb-6">
               <div>
                  <h3 className="text-xl font-bold text-white">{topic.name}</h3>
                  <p className="text-slate-400 text-sm mt-1">{topic.description}</p>
               </div>
               <Button onClick={handleCreateContent} className="bg-neon-600 hover:bg-neon-700">
                  <Plus className="w-4 h-4 mr-2" /> {t('admin.content.addContent')}
               </Button>
            </div>

            <Separator className="bg-slate-800 mb-6" />

            <div className="space-y-4">
                <ContentList 
                    topicId={topic.id}
                    onEditContent={handleEditContent}
                    refreshTrigger={refreshContent}
                />
            </div>

            <ContentForm
                isOpen={isContentFormOpen}
                onClose={() => setIsContentFormOpen(false)}
                topicId={topic.id}
                contentToEdit={editingContent}
                onSuccess={handleContentSuccess}
            />
        </div>
    );
};

export default TopicContentManager;