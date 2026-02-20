import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useTranslation } from '@/hooks/useTranslation';

const ContentForm = ({ isOpen, onClose, topicId, contentToEdit, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content_type: 'text',
    url: '',
    content_text: '',
    order_index: 0
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    if (contentToEdit) {
      setFormData({
        title: contentToEdit.title,
        description: contentToEdit.description || '',
        content_type: contentToEdit.content_type || contentToEdit.type || 'text',
        url: contentToEdit.url || '',
        content_text: contentToEdit.content_text || '',
        order_index: contentToEdit.order_index
      });
    } else {
      setFormData({
        title: '',
        description: '',
        content_type: 'text',
        url: '',
        content_text: '',
        order_index: 0
      });
    }
  }, [contentToEdit, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      toast({ title: t('common.error'), description: "Title is required", variant: "destructive" });
      return;
    }

    if ((formData.content_type === 'video' || formData.content_type === 'image') && !formData.url.trim()) {
      toast({ title: t('common.error'), description: "URL is required for Video/Image types", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        topic_id: topicId,
        title: formData.title,
        description: formData.description,
        content_type: formData.content_type,
        url: formData.url,
        content_text: formData.content_text,
        order_index: parseInt(formData.order_index)
      };

      if (contentToEdit) {
        await api.topicContent.update(contentToEdit.id, payload);
      } else {
        await api.topicContent.create(payload);
      }

      toast({
        title: t('common.success'),
        description: `Content ${contentToEdit ? 'updated' : 'added'} successfully`,
        className: "bg-green-600 text-white border-none"
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving content:', error);
      toast({
        title: t('common.error'),
        description: "Failed to save content",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'code-block'],
      ['clean']
    ],
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-800 text-white sm:max-w-[800px] max-h-[90vh] overflow-y-auto" aria-describedby="content-form-desc">
        <DialogHeader>
          <DialogTitle>{contentToEdit ? t('common.edit') : t('common.add')} {t('admin.content.manageContent')}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">{t('admin.content.stepTitle')} *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white"
                placeholder="e.g., Step 1: Initialization"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">{t('admin.content.contentType')}</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                  <SelectItem value="text">Text / Article</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="exercise">Exercise</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t('admin.content.topicDesc')}</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>

          {(formData.type === 'video' || formData.type === 'image') && (
            <div className="space-y-2">
              <Label htmlFor="url">{t('admin.content.mediaUrl')} *</Label>
              <Input
                id="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white"
                placeholder="https://..."
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>{t('admin.content.contentBody')}</Label>
            <div className="bg-white text-black rounded-md overflow-hidden">
              <ReactQuill
                theme="snow"
                value={formData.content_text}
                onChange={(value) => setFormData({ ...formData, content_text: value })}
                modules={quillModules}
                className="h-64 mb-12"
              />
            </div>
          </div>

          <div className="space-y-2 pt-8">
            <Label htmlFor="order">{t('admin.content.order')}</Label>
            <Input
              id="order"
              type="number"
              value={formData.order_index}
              onChange={(e) => setFormData({ ...formData, order_index: e.target.value })}
              className="bg-slate-800 border-slate-700 text-white w-32"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose} className="text-slate-400 hover:text-white hover:bg-slate-800">
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={loading} className="bg-neon-600 hover:bg-neon-700 text-white">
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {contentToEdit ? t('common.save') : t('common.add')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContentForm;