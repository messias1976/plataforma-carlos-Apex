import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Edit2, Trash2, FileText, Video, Image as ImageIcon, Dumbbell } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
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

const ContentList = ({ topicId, onEditContent, refreshTrigger }) => {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    if (topicId) {
      fetchContents();
    }
  }, [topicId, refreshTrigger]);

  const fetchContents = async () => {
    try {
      setLoading(true);
      const data = await api.topicContent.getAll(topicId);
      setContents(data || []);
    } catch (error) {
      console.error('Error fetching contents:', error);
      toast({
        title: t('common.error'),
        description: "Failed to load content items.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await api.topicContent.delete(deleteId);

      toast({
        title: t('common.success'),
        description: "Content deleted successfully.",
        className: "bg-green-600 text-white border-none"
      });
      fetchContents();
    } catch (error) {
      console.error('Error deleting content:', error);
      toast({
        title: t('common.error'),
        description: "Failed to delete content.",
        variant: "destructive"
      });
    } finally {
      setDeleteId(null);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'video': return <Video className="w-5 h-5 text-blue-400" />;
      case 'image': return <ImageIcon className="w-5 h-5 text-purple-400" />;
      case 'exercise': return <Dumbbell className="w-5 h-5 text-green-400" />;
      default: return <FileText className="w-5 h-5 text-slate-400" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map(i => (
          <div key={i} className="h-16 bg-slate-800/50 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (contents.length === 0) {
    return (
      <div className="text-center py-8 border border-dashed border-slate-800 rounded-lg">
        <p className="text-slate-500 text-sm">{t('admin.content.noContent')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {contents.map((content) => (
        <Card key={content.id} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
          <CardContent className="p-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 shrink-0">
                {getTypeIcon(content.type)}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-500">#{content.order_index}</span>
                  <h4 className="font-medium text-white truncate">{content.title}</h4>
                </div>
                <p className="text-xs text-slate-400 truncate">{content.description || 'No description'}</p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-950/30"
                onClick={() => onEditContent(content)}
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-950/30"
                onClick={() => setDeleteId(content.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="bg-slate-900 border-slate-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>{t('admin.content.deleteContentTitle')}</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              {t('admin.content.deleteContentDesc')}
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

export default ContentList;