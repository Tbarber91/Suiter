'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { MessageSquare, ShieldCheck, Send, CheckCheck, X } from 'lucide-react';
import { useAuth } from './AuthProvider';
import { ChatMessage } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

interface MessagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenChat: (recipientName: string, recipientHandle: string, listingTitle?: string) => void;
}

export function MessagesModal({ isOpen, onClose, onOpenChat }: MessagesModalProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (!isOpen || !user) return;

    const q = query(
      collection(db, 'messages'),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loaded: ChatMessage[] = [];
      snapshot.forEach((docSnap) => {
        const d = docSnap.data();
        loaded.push({
          id: docSnap.id,
          senderId: d.senderId,
          senderName: d.senderName,
          senderAvatar: d.senderAvatar,
          recipientId: d.recipientId,
          listingId: d.listingId,
          listingTitle: d.listingTitle,
          text: d.text,
          timestamp: d.timestamp?.toDate ? d.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently'
        });
      });
      setMessages(loaded);
    }, (err) => {
      console.log("Messages load error:", err);
    });

    return () => unsubscribe();
  }, [isOpen, user]);

  const conversationsMap = new Map<string, ChatMessage[]>();
  messages.forEach(msg => {
    const partner = msg.senderId === user?.id ? msg.recipientId : msg.senderId;
    if (!conversationsMap.has(partner)) {
      conversationsMap.set(partner, []);
    }
    conversationsMap.get(partner)!.push(msg);
  });

  const conversationPartners = Array.from(conversationsMap.entries());

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] rounded-[2.5rem] p-0 border-0 overflow-hidden shadow-2xl bg-white">
        <div className="p-6 bg-zinc-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold tracking-tight">Messages Inbox</h2>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Active conversations & inquiries</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full text-white hover:bg-white/10">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <ScrollArea className="h-[400px] p-6 bg-zinc-50/50">
          <div className="space-y-4">
            {conversationPartners.length === 0 ? (
              <div className="text-center py-16">
                <MessageSquare className="w-12 h-12 text-zinc-300 mx-auto mb-3 animate-pulse" />
                <p className="text-sm font-bold text-zinc-700">No conversations yet</p>
                <p className="text-xs text-zinc-400 mt-1">Initiate a message from any listing or service page to start chatting.</p>
              </div>
            ) : (
              conversationPartners.map(([partnerId, msgs]) => {
                const lastMsg = msgs[0];
                const displayName = lastMsg.senderId === user?.id ? lastMsg.recipientId : lastMsg.senderName;
                return (
                  <div
                    key={partnerId}
                    onClick={() => {
                      onClose();
                      onOpenChat(displayName, partnerId, lastMsg.listingTitle);
                    }}
                    className="p-4 bg-white rounded-2xl border border-zinc-200/80 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 border-2 border-indigo-100 shadow-sm">
                        <AvatarImage src={lastMsg.senderAvatar} />
                        <AvatarFallback className="bg-indigo-600 text-white font-bold">{displayName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-zinc-900 group-hover:text-indigo-600 transition-colors">{displayName}</span>
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                        </div>
                        {lastMsg.listingTitle && (
                          <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded w-fit my-0.5">
                            Re: {lastMsg.listingTitle}
                          </span>
                        )}
                        <p className="text-xs text-zinc-500 line-clamp-1 mt-0.5 font-medium">{lastMsg.text}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[10px] font-bold text-zinc-400">{lastMsg.timestamp}</span>
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
