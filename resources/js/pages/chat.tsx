import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { Send, ArrowLeft, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

type PageProps = {
    auth: {
        user: {
            name: string;
        };
    };
};

export default function Chat() {
    const { auth } = usePage<PageProps>().props;
    const [messages, setMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string; time: string }>>([
        {
            sender: 'bot',
            text: `Hola, ${auth.user?.name || 'Usuario'}. Soy tu asistente de salud mental de la Universidad de Córdoba. ¿En qué puedo ayudarte hoy? Puedes hablarme sobre cómo te sientes, tus preocupaciones, o cualquier tema relacionado con tu bienestar académico y emocional.`,
            time: 'Ahora'
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const userMsg = inputText.trim();
        setMessages((prev) => [...prev, { sender: 'user', text: userMsg, time: 'Ahora' }]);
        setInputText('');
        setIsTyping(true);

        try {
            const csrfToken = decodeURIComponent(
                document.cookie
                    .split('; ')
                    .find((row) => row.startsWith('XSRF-TOKEN='))
                    ?.split('=')[1] || ''
            );

            const response = await fetch('/chat/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ message: userMsg }),
            });

            const data = await response.json();
            const botReply = data.reply || 'Disculpa, no obtuve una respuesta válida. ¿Podrías volver a intentar?';

            setMessages((prev) => [...prev, { sender: 'bot', text: botReply, time: 'Ahora' }]);
        } catch (error) {
            setMessages((prev) => [...prev, { 
                sender: 'bot', 
                text: 'Disculpa, en este momento tengo dificultades de conexión. ¿Podemos volver a intentar en unos segundos?', 
                time: 'Ahora' 
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <>
            <Head title="Chat con IA" />
            <div className="rounded-[2rem] border border-border bg-card shadow-sm overflow-hidden h-[80vh] flex flex-col animate-in fade-in zoom-in-95 duration-300 text-foreground">
                
                {/* Header */}
                <div className="px-6 py-4 bg-muted/40 border-b border-border flex items-center justify-between">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 text-primary hover:text-primary/80 text-sm font-semibold transition"
                    >
                        <ArrowLeft size={16} /> Volver
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                            <Bot size={22} className="text-primary" />
                        </div>
                        <div className="text-left">
                            <h2 className="text-base font-bold leading-tight">Chat con IA</h2>
                            <p className="text-xs text-muted-foreground font-medium">Asistente de Salud Mental</p>
                        </div>
                    </div>
                    <div className="w-16" /> {/* Balance spacer */}
                </div>

                {/* Chat area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-background/30">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex gap-3 max-w-[85%] ${
                                msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
                            }`}
                        >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 select-none ${
                                msg.sender === 'user' ? 'bg-primary text-primary-foreground animate-in zoom-in duration-200' : 'bg-muted border border-border/80 text-foreground'
                            }`}>
                                {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                            </div>
                            <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                                msg.sender === 'user'
                                    ? 'bg-primary text-primary-foreground rounded-tr-none'
                                    : 'bg-muted/80 border border-border text-foreground rounded-tl-none'
                            }`}>
                                <p>{msg.text}</p>
                                <span className="block mt-2 text-[10px] opacity-60 text-right">{msg.time}</span>
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex gap-3 max-w-[80%]">
                            <div className="w-8 h-8 rounded-lg bg-muted border border-border/80 flex items-center justify-center text-sm">
                                <Bot size={16} />
                            </div>
                            <div className="p-4 rounded-2xl bg-muted/80 border border-border text-muted-foreground rounded-tl-none text-sm flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                {/* Message input */}
                <form onSubmit={handleSendMessage} className="p-4 bg-muted/20 border-t border-border flex gap-3">
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Escribe tu mensaje..."
                        className="flex-1 px-4 py-3 bg-background border border-input rounded-xl focus:border-primary focus:ring-primary text-foreground text-sm outline-none transition"
                    />
                    <Button
                        type="submit"
                        className="bg-primary hover:bg-primary/95 text-primary-foreground h-11 w-11 rounded-xl flex items-center justify-center shrink-0 transition"
                    >
                        <Send size={16} />
                    </Button>
                </form>
            </div>
        </>
    );
}

Chat.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Chat con IA',
            href: '/chat',
        },
    ],
};
