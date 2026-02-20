import React, { useState } from 'react';
import ModuleSelector from './content/ModuleSelector';
import ModuleContentManager from './content/ModuleContentManager';
import { Button } from '@/components/ui/button';
import { Plus, ChevronRight, Home } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from '@/hooks/useTranslation';

const ContentManagement = () => {
  const [selectedModule, setSelectedModule] = useState(null);

  const [isContentFormOpen, setIsContentFormOpen] = useState(false);
  const [editingContent, setEditingContent] = useState(null);

  const [refreshContent, setRefreshContent] = useState(0);

  const { t } = useTranslation();

  // Handlers for Content
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

  // Handlers for Content
  const handleManageContent = (topic) => {
    setSelectedTopic(topic);
  };

  const handleBackToTopics = () => {
    setSelectedTopic(null);
  };

  const handleBackToSubjects = () => {
    setSelectedSubjectId(null);
    setSelectedTopic(null);
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header Area */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">{t('admin.content.title')}</h2>
            <p className="text-slate-400">{t('admin.content.subtitle')}</p>
          </div>
          {selectedSubjectId && !selectedTopic && (
            <Button onClick={handleCreateTopic} className="bg-neon-600 hover:bg-neon-700">
              <Plus className="w-4 h-4 mr-2" /> {t('admin.content.newTopic')}
            </Button>
          )}
        </div>

        {/* Breadcrumb Navigation */}
        <div className="flex items-center text-sm text-slate-400 bg-slate-900/50 p-3 rounded-lg border border-slate-800">
          <button onClick={handleBackToSubjects} className="hover:text-white flex items-center transition-colors">
            <Home className="w-4 h-4 mr-1" /> {t('admin.content.subjects')}
          </button>
          {selectedSubjectId && (
            <>
              <ChevronRight className="w-4 h-4 mx-2 text-slate-600" />
              <button
                onClick={handleBackToTopics}
                className={`hover:text-white transition-colors ${!selectedTopic ? 'text-neon-400 font-medium' : ''}`}
              >
                {selectedSubjectName || '...'}
              </button>
            </>
          )}
          {selectedTopic && (
            <>
              <ChevronRight className="w-4 h-4 mx-2 text-slate-600" />
              <span className="text-neon-400 font-medium">{selectedTopic.name}</span>
            </>
          )}
        </div>
      </div>

      {!selectedSubjectId && (
        <div className="bg-slate-950/50 p-6 rounded-xl border border-slate-800">
          <h3 className="text-lg font-semibold text-white mb-4">{t('admin.content.selectSubject')}</h3>
          <SubjectSelector
            selectedSubjectId={selectedSubjectId}
            onSelectSubject={setSelectedSubjectId}
          />
        </div>
      )}

      {selectedSubjectId && !selectedTopic && (
        <div className="bg-slate-950/50 p-6 rounded-xl border border-slate-800 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">{t('admin.content.topics')}</h3>
          </div>

          <TopicsList
            subjectId={selectedSubjectId}
            onEditTopic={handleEditTopic}
            onManageContent={handleManageContent}
            refreshTrigger={refreshTopics}
          />
        </div>
      )}

      {selectedTopic && (
        <div className="bg-slate-950/50 p-6 rounded-xl border border-slate-800 animate-in fade-in slide-in-from-bottom-4">
          <TopicContentManager
            topic={selectedTopic}
            onBack={handleBackToTopics}
          />
        </div>
      )}

      {/* Modals */}
      <TopicForm
        isOpen={isTopicFormOpen}
        onClose={() => setIsTopicFormOpen(false)}
        subjectId={selectedSubjectId}
        topicToEdit={editingTopic}
        onSuccess={handleTopicSuccess}
      />
    </div>
  );
};

export default ContentManagement;