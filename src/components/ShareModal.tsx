import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onShare: (email: string, permission: string) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ open, onOpenChange, onShare }) => {
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState('visualizar');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      onShare(email, permission);
      setEmail('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Compartilhar Projeto</DialogTitle>
          <DialogDescription>
            Convide outras pessoas para visualizar ou colaborar
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="shareEmail">Email da Pessoa</Label>
              <Input
                id="shareEmail"
                type="email"
                placeholder="email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sharePermission">Permissão</Label>
              <Select value={permission} onValueChange={setPermission}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="visualizar">Apenas Visualizar</SelectItem>
                  <SelectItem value="colaborar">Visualizar e Adicionar Fotos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Compartilhar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};