import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

const SubjectForm = ({ isOpen, onClose, subject = null, onSuccess }) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    area: 'linguagens'
  });

  useEffect(() => {
    if (subject) {
      setFormData({
        name: subject.name,
        description: subject.description || '',
        area: subject.area || 'linguagens'
      });
    } else {
      setFormData({
        name: '',
        description: '',
        area: 'linguagens'
      });
    }
  }, [subject, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (subject) {
        await api.subjects.update(subject.id, formData);
      } else {
        await api.subjects.create(formData);
      }

      toast({
        title: t('common.success'),
        description: t('admin.subjects.title') + " " + (subject ? t('common.edit') : t('common.add')) + " com sucesso.",
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
      <DialogContent className="bg-slate-900 border-slate-800 text-white" aria-describedby="subject-form-desc">
        <DialogHeader>
          <DialogTitle>{subject ? t('admin.subjects.editSubject') : t('admin.subjects.addSubject')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>{t('admin.subjects.form.name')}</Label>
            <Input
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="bg-slate-800 border-slate-700 text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>{t('admin.subjects.form.area')}</Label>
            <Select
              value={formData.area}
              onValueChange={val => setFormData({ ...formData, area: val })}
            >
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-white">
                <SelectItem value="linguagens">{t('areas.linguagens')}</SelectItem>
                <SelectItem value="matematica">{t('areas.matematica')}</SelectItem>
                <SelectItem value="natureza">{t('areas.natureza')}</SelectItem>
                <SelectItem value="humanas">{t('areas.humanas')}</SelectItem>
              </SelectContent>
            </Select>
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

export default SubjectForm;