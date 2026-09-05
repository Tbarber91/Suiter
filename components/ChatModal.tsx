'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Send, MessageSquare, ShieldCheck, CheckCheck } from 'lucide-react';
import { useAuth } from './AuthProvider';
import { Location, ChatMessage } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing?: Location | null;
  recipientName?: string;
  recipientHandle?: string;
}

export function ChatModal({ isOpen, onClose, listing, recipientName, recipientHandle }: ChatModalProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);

  const targetName = recipientName || listing?.ownerName || 'Marketplace Seller';
  const targetHandle = recipientHandle || listing?.ownerHandle || '@seller';

  useEffect(() => {
    if (!isOpen || !user) return;

    // Load initial mock / saved messages
    const mockInitialMsgs: ChatMessage[] = [
      {
        id: 'm1',
        senderId: 'system',
        senderName: targetName,
        senderAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${targetName}`,
        recipientId: user.id,
        listingTitle: listing?.title,
        text: `Hello! Thanks for reaching out regarding "${listing?.title || 'our service'}". How can I assist you today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];

    setMessages(mockInitialMsgs);

    // Subscribe to Firestore chat if connected
    const q = query(
      collection(db, 'messages'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loaded: ChatMessage[] = [];
      snapshot.forEach((docSnap) => {
        const d = docSnap.data();
        if (
          (d.senderId === user.id && d.recipientId === targetHandle) ||
          (d.senderId === targetHandle && d.recipientId === user.id) ||
          (listing && d.listingId === listing.id)
        ) {
          loaded.push({
            id: docSnap.id,
            senderId: d.senderId,
            senderName: d.senderName,
            senderAvatar: d.senderAvatar,
            recipientId: d.recipientId,
            listingId: d.listingId,
            listingTitle: d.listingTitle,
            text: d.text,
            timestamp: d.timestamp?.toDate ? d.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          });
        }
      });
      if (loaded.length > 0) {
        setMessages([...mockInitialMsgs, ...loaded]);
      }
    }, (err) => {
      console.log("Firestore chat listen fallback to local state", err);
    });

    return () => unsubscribe();
  }, [isOpen, user, listing, targetName, targetHandle]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !user) return;

    const newMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      senderId: user.id,
      senderName: user.name,
      senderAvatar: user.avatarUrl,
      recipientId: targetHandle,
      listingId: listing?.id,
      listingTitle: listing?.title,
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);
    const currentInput = inputText;
    setInputText('');
    setIsSending(true);

    try {
      await addDoc(collection(db, 'messages'), {
        senderId: user.id,
        senderName: user.name,
        senderAvatar: user.avatarUrl || '',
        recipientId: targetHandle,
        listingId: listing?.id || '',
        listingTitle: listing?.title || '',
        text: currentInput.trim(),
        timestamp: serverTimestamp()
      });
    } catch (err) {
      console.log("Message saved locally:", err);
    } finally {
      setIsSending(false);
    }

    // Auto reply simulation for interactive feel
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: 'reply-' + Date.now(),
          senderId: targetHandle,
          senderName: targetName,
          senderAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${targetName}`,
          recipientId: user.id,
          text: `Thank you for your message! Our team has received your enquiry about "${listing?.title || 'the listing'}" and will reply shortly.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] rounded-[2.5rem] p-0 border-0 overflow-hidden shadow-2xl bg-white">
        {/* Header */}
        <div className="p-6 bg-zinc-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-indigo-500 shadow-md">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${targetName}`} />
              <AvatarFallback className="bg-indigo-600 text-white font-bold">{targetName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm tracking-tight text-white">{targetName}</span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <span className="text-[10px] text-zinc-400 font-medium">{targetHandle} • Instant Messaging</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
             <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Active</span>
          </div>
        </div>

        {/* Listing preview header banner */}
        {listing && (
          <div className="px-6 py-3 bg-indigo-50 border-b border-indigo-100 flex items-center justify-between">
            <div className="flex items-center gap-3 truncate">
              <img src={listing.image} alt={listing.title} className="w-10 h-10 rounded-xl object-cover shrink-0 border border-indigo-200" />
              <div className="truncate">
                <p className="text-xs font-bold text-indigo-950 truncate">{listing.title}</p>
                <p className="text-[10px] text-indigo-600 font-bold">{listing.price}</p>
              </div>
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-indigo-500 bg-white px-2 py-1 rounded-lg border border-indigo-100 shrink-0">Inquiry</span>
          </div>
        )}

        {/* Chat message thread */}
        <ScrollArea className="h-[340px] p-6 bg-zinc-50/50">
          <div className="space-y-4">
            {messages.map((msg) => {
              const isMe = msg.senderId === user?.id;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1 animate-in fade-in duration-300`}
                >
                  <div className="flex items-center gap-1.5 px-1">
                    <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">{msg.senderName}</span>
                    <span className="text-[8px] text-zinc-300">{msg.timestamp}</span>
                  </div>
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl text-xs font-medium leading-relaxed shadow-sm ${
                      isMe
                        ? 'bg-zinc-900 text-white rounded-tr-none'
                        : 'bg-white text-zinc-800 border border-zinc-200/80 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                  {isMe && (
                    <span className="text-[8px] text-zinc-400 flex items-center gap-0.5 px-1">
                      <CheckCheck className="w-2.5 h-2.5 text-indigo-500" /> Delivered
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>

        {/* Input area */}
        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-zinc-100 flex items-center gap-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-xl h-11 bg-zinc-50 border-zinc-200 text-xs font-medium focus-visible:ring-1 focus-visible:ring-zinc-400"
          />
          <Button
            type="submit"
            disabled={!inputText.trim()}
            className="rounded-xl h-11 px-5 bg-zinc-900 text-white hover:bg-zinc-800 transition-all font-bold text-xs shrink-0 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 mr-1.5" />
            Send
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
