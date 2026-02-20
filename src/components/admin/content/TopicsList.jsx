import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Edit2, Trash2, Layers, Loader2, Plus, ArrowRight } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/hooks/useTranslation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const TopicsList = ({ subjectId, onEditTopic, onManageContent, refreshTrigger }) => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    if (subjectId) {
      fetchTopics();
    }
  }, [subjectId, refreshTrigger]);

  const fetchTopics = async () => {
    try {
      setLoading(true);
      const data = await api.topics.getAll(subjectId);
      setTopics(data || []);
    } catch (error) {
      console.error('Error fetching topics:', error);
      toast({
        title: t('common.error'),
        description: "Failed to load topics.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await api.topics.delete(deleteId);

      toast({
        title: t('common.success'),
        description: "Topic deleted successfully.",
        className: "bg-green-600 text-white border-none"
      });
      fetchTopics();
    } catch (error) {
      console.error('Error deleting topic:', error);
      toast({
        title: t('common.error'),
        description: "Failed to delete topic.",
        variant: "destructive"
      });
    } finally {
      setDeleteId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-20 bg-slate-800/50 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (topics.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-900/50 rounded-lg border border-slate-800 border-dashed">
        <Layers className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-slate-400">{t('admin.content.noTopics')}</h3>
        <p className="text-sm text-slate-500 mb-4">{t('admin.content.createFirstTopic')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {topics.map((topic) => (
        <Card
          key={topic.id}
          className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors group cursor-pointer"
          onClick={() => onManageContent(topic)}
        >
          <CardContent className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 font-bold border border-slate-700">
                {topic.order_index}
              </div>
              <div>
                <h3 className="font-semibold text-white text-lg group-hover:text-neon-400 transition-colors">{topic.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className={`text-xs ${topic.status === 'active' ? 'bg-emerald-950 text-emerald-500 border-emerald-900' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>
                    {topic.status === 'active' ? t('admin.content.active') : t('admin.content.inactive')}
                  </Badge>
                  <span className="text-slate-500 text-xs truncate max-w-[200px]">{topic.description}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-400 hover:text-white hover:bg-slate-800"
                onClick={() => onEditTopic(topic)}
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-400 hover:text-red-300 hover:bg-red-950/30"
                onClick={() => setDeleteId(topic.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <div className="w-px h-6 bg-slate-800 mx-1"></div>
              <Button
                variant="ghost"
                size="icon"
                className="text-neon-500 hover:text-neon-400 hover:bg-neon-500/10"
                onClick={() => onManageContent(topic)}
              >
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="bg-slate-900 border-slate-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>{t('admin.content.deleteTopicTitle')}</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              {t('admin.content.deleteTopicDesc')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-800 text-white border-slate-700 hover:bg-slate-700">{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 text-white hover:bg-red-700">{t('common.delete')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TopicsList;