import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

const TopicForm = ({ isOpen, onClose, topic = null, subjectId, onSuccess }) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    order_index: 0
  });

  useEffect(() => {
    if (topic) {
      setFormData({
        title: topic.title,
        description: topic.description || '',
        order_index: topic.order_index || 0
      });
    } else {
      setFormData({
        title: '',
        description: '',
        order_index: 0
      });
    }
  }, [topic, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subjectId && !topic) return;

    setLoading(true);

    try {
      if (topic) {
        await api.topics.update(topic.id, formData);
      } else {
        await api.topics.create({ ...formData, subject_id: subjectId });
      }

      toast({
        title: t('common.success'),
        description: t('admin.subjects.addTopic') + " realizado com sucesso.",
        className: "bg-green-600 text-white"
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: t('common.error'),
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-800 text-white" aria-describedby="topic-form-desc">
        <DialogHeader>
          <DialogTitle>{topic ? t('admin.subjects.editTopic') : t('admin.subjects.addTopic')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>{t('admin.subjects.form.name')}</Label>
            <Input
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="bg-slate-800 border-slate-700 text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>{t('admin.subjects.form.order')}</Label>
            <Input
              type="number"
              value={formData.order_index}
              onChange={e => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label>{t('admin.subjects.form.description')}</Label>
            <Textarea
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose} className="text-slate-400">
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={loading} className="bg-neon-600 hover:bg-neon-700 text-white">
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {t('common.save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TopicForm;