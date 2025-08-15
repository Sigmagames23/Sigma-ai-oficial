import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Plus, 
  Menu, 
  Sun, 
  Moon, 
  Settings, 
  User, 
  MessageSquare, 
  Image, 
  Trash2,
  Globe,
  Share2,
  Download,
  Upload,
  Search,
  FileText,
  X,
  LogOut,
  Brain,
  Zap,
  Shield,
  Sparkles,
  ChevronDown,
  AlertTriangle,
  Mail,
  RotateCcw,
  UserX,
  Paperclip,
  Camera,
  File,
  CheckCircle,
  UserPlus,
  Heart,
  Star,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  isStreaming?: boolean;
  type?: 'text' | 'image' | 'file';
  fileData?: {
    name: string;
    type: string;
    content: string;
  };
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  lastUpdated: Date;
}

interface UserProfile {
  username: string;
  email: string;
  age: string;
  preferences: {
    language: string;
    theme: 'light' | 'dark';
    model: string;
  };
  registrationDate: Date;
}

const LANGUAGES = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ca', name: 'Català', flag: '🏴󠁥󠁳󠁣󠁴󠁿' },
  { code: 'eu', name: 'Euskera', flag: '🏴󠁥󠁳󠁰󠁶󠁿' },
  { code: 'gl', name: 'Galego', flag: '🏴󠁥󠁳󠁧󠁡󠁿' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
  { code: 'no', name: 'Norsk', flag: '🇳🇴' },
  { code: 'da', name: 'Dansk', flag: '🇩🇰' },
  { code: 'fi', name: 'Suomi', flag: '🇫🇮' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'cs', name: 'Čeština', flag: '🇨🇿' },
  { code: 'hu', name: 'Magyar', flag: '🇭🇺' },
  { code: 'ro', name: 'Română', flag: '🇷🇴' },
  { code: 'bg', name: 'Български', flag: '🇧🇬' },
  { code: 'hr', name: 'Hrvatski', flag: '🇭🇷' },
  { code: 'sr', name: 'Српски', flag: '🇷🇸' },
  { code: 'sk', name: 'Slovenčina', flag: '🇸🇰' },
  { code: 'sl', name: 'Slovenščina', flag: '🇸🇮' },
  { code: 'et', name: 'Eesti', flag: '🇪🇪' },
  { code: 'lv', name: 'Latviešu', flag: '🇱🇻' },
  { code: 'lt', name: 'Lietuvių', flag: '🇱🇹' },
  { code: 'mt', name: 'Malti', flag: '🇲🇹' },
  { code: 'cy', name: 'Cymraeg', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿' },
  { code: 'ga', name: 'Gaeilge', flag: '🇮🇪' },
  { code: 'is', name: 'Íslenska', flag: '🇮🇸' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'he', name: 'עברית', flag: '🇮🇱' },
  { code: 'fa', name: 'فارسی', flag: '🇮🇷' },
  { code: 'ur', name: 'اردو', flag: '🇵🇰' },
  { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
  { code: 'ta', name: 'தமிழ்', flag: '🇱🇰' },
  { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ml', name: 'മലയാളം', flag: '🇮🇳' },
  { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
  { code: 'th', name: 'ไทย', flag: '🇹🇭' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'ms', name: 'Bahasa Melayu', flag: '🇲🇾' },
  { code: 'tl', name: 'Filipino', flag: '🇵🇭' },
  { code: 'sw', name: 'Kiswahili', flag: '🇰🇪' },
  { code: 'am', name: 'አማርኛ', flag: '🇪🇹' },
  { code: 'yo', name: 'Yorùbá', flag: '🇳🇬' },
  { code: 'ig', name: 'Igbo', flag: '🇳🇬' },
  { code: 'ha', name: 'Hausa', flag: '🇳🇬' },
  { code: 'zu', name: 'isiZulu', flag: '🇿🇦' },
  { code: 'af', name: 'Afrikaans', flag: '🇿🇦' },
  { code: 'xh', name: 'isiXhosa', flag: '🇿🇦' }
];

const AI_MODELS = [
  { value: 'gpt-5-2025-08-07', name: 'GPT-5 (2025-08-07)', description: 'El modelo más avanzado' },
  { value: 'gpt-5', name: 'GPT-5', description: 'Última versión estable' },
  { value: 'gpt-5-mini-2025-08-07', name: 'GPT-5 Mini (2025-08-07)', description: 'Rápido y eficiente' },
  { value: 'gpt-5-mini', name: 'GPT-5 Mini', description: 'Versión optimizada' },
  { value: 'gpt-5-nano-2025-08-07', name: 'GPT-5 Nano (2025-08-07)', description: 'Ultra rápido' },
  { value: 'gpt-5-nano', name: 'GPT-5 Nano', description: 'Respuestas instantáneas' },
  { value: 'gpt-4o', name: 'GPT-4o', description: 'Multimodal avanzado' },
  { value: 'gpt-4o-mini', name: 'GPT-4o Mini', description: 'Eficiente y rápido' },
  { value: 'o1', name: 'O1', description: 'Razonamiento profundo' },
  { value: 'o1-mini', name: 'O1 Mini', description: 'Razonamiento rápido' },
  { value: 'o1-pro', name: 'O1 Pro', description: 'Máximo rendimiento' },
  { value: 'o3', name: 'O3', description: 'Nueva generación' },
  { value: 'o3-mini', name: 'O3 Mini', description: 'Optimizado' },
  { value: 'claude-opus-4-1', name: 'Claude Opus 4.1', description: 'Análisis profundo' },
  { value: 'claude-sonnet-4', name: 'Claude Sonnet 4', description: 'Equilibrado' },
  { value: 'claude-3-5-sonnet-latest', name: 'Claude 3.5 Sonnet', description: 'Versión estable' }
];

const TRANSLATIONS = {
  es: {
    welcome: 'Bienvenido a Sigma AI',
    subtitle: 'La plataforma de inteligencia artificial más avanzada del mundo',
    description: 'Experimenta conversaciones naturales, análisis de imágenes y búsquedas inteligentes con los modelos de IA más potentes disponibles.',
    getStarted: 'Comenzar con Sigma AI',
    signIn: 'Iniciar Sesión',
    register: 'Registrarse',
    newChat: 'Nuevo Chat',
    settings: 'Configuración',
    profile: 'Perfil',
    signOut: 'Cerrar Sesión',
    typeMessage: 'Escribe tu mensaje...',
    send: 'Enviar',
    uploadFile: 'Subir archivo',
    searchInternet: 'Buscar en internet',
    generateImage: 'Generar imagen',
    processing: 'Procesando...',
    error: 'Error',
    success: 'Éxito',
    thanks: '¡Gracias por registrarte en Sigma AI!',
    welcomeBack: '¡Bienvenido de vuelta!',
    copyright: '© 2025 Sigma AI. Todos los derechos reservados.',
    contact: 'Contacto: sigmacompanyoficial@gmail.com'
  },
  en: {
    welcome: 'Welcome to Sigma AI',
    subtitle: 'The world\'s most advanced artificial intelligence platform',
    description: 'Experience natural conversations, image analysis, and intelligent searches with the most powerful AI models available.',
    getStarted: 'Get Started with Sigma AI',
    signIn: 'Sign In',
    register: 'Register',
    newChat: 'New Chat',
    settings: 'Settings',
    profile: 'Profile',
    signOut: 'Sign Out',
    typeMessage: 'Type your message...',
    send: 'Send',
    uploadFile: 'Upload file',
    searchInternet: 'Search internet',
    generateImage: 'Generate image',
    processing: 'Processing...',
    error: 'Error',
    success: 'Success',
    thanks: 'Thank you for registering with Sigma AI!',
    welcomeBack: 'Welcome back!',
    copyright: '© 2025 Sigma AI. All rights reserved.',
    contact: 'Contact: sigmacompanyoficial@gmail.com'
  }
};

function App() {
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'auth' | 'register' | 'profile' | 'chat' | 'thanks'>('welcome');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [currentLanguage, setCurrentLanguage] = useState('es');
  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const [showInternetSearch, setShowInternetSearch] = useState(false);
  const [internetQuery, setInternetQuery] = useState('');
  const [internetResults, setInternetResults] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [secretText, setSecretText] = useState('');
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = TRANSLATIONS[currentLanguage as keyof typeof TRANSLATIONS] || TRANSLATIONS.es;
  const currentChat = chats.find(chat => chat.id === currentChatId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentChat?.messages]);

  useEffect(() => {
    checkAuthStatus();
    const handleResize = () => {
      setSidebarOpen(window.innerWidth > 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const checkAuthStatus = async () => {
    try {
      if ((window as any).puter?.auth?.isSignedIn()) {
        setIsAuthenticated(true);
        await loadUserData();
        setCurrentScreen('chat');
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    }
  };

  const loadUserData = async () => {
    try {
      const profileData = await (window as any).puter.kv.get('sigma_user_profile_v2');
      if (profileData) {
        const profile = JSON.parse(profileData);
        setUserProfile(profile);
        setTheme(profile.preferences?.theme || 'light');
        setCurrentLanguage(profile.preferences?.language || 'es');
      }

      const chatsData = await (window as any).puter.kv.get('sigma_user_chats_v2');
      if (chatsData) {
        const parsedChats = JSON.parse(chatsData).map((chat: any) => ({
          ...chat,
          createdAt: new Date(chat.createdAt),
          lastUpdated: new Date(chat.lastUpdated),
          messages: chat.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }));
        setChats(parsedChats);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const saveUserData = async () => {
    try {
      if (userProfile) {
        await (window as any).puter.kv.set('sigma_user_profile_v2', JSON.stringify(userProfile));
      }
      if (chats.length > 0) {
        await (window as any).puter.kv.set('sigma_user_chats_v2', JSON.stringify(chats));
      }
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const handleSignIn = async () => {
    try {
      await (window as any).puter.auth.signIn();
      setIsAuthenticated(true);
      await loadUserData();
      if (!userProfile) {
        setCurrentScreen('profile');
      } else {
        setCurrentScreen('chat');
      }
    } catch (error) {
      console.error('Sign in failed:', error);
    }
  };

  const handleRegister = async () => {
    try {
      await (window as any).puter.auth.signIn();
      setIsAuthenticated(true);
      setCurrentScreen('thanks');
      setTimeout(() => {
        setCurrentScreen('profile');
      }, 3000);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await saveUserData();
      (window as any).puter.auth.signOut();
      setIsAuthenticated(false);
      setCurrentScreen('welcome');
      setChats([]);
      setCurrentChatId(null);
      setUserProfile(null);
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: t.newChat,
      messages: [],
      createdAt: new Date(),
      lastUpdated: new Date()
    };
    const updatedChats = [newChat, ...chats];
    setChats(updatedChats);
    setCurrentChatId(newChat.id);
    saveUserData();
  };

  const deleteChat = async (chatId: string) => {
    const updatedChats = chats.filter(chat => chat.id !== chatId);
    setChats(updatedChats);
    if (currentChatId === chatId) {
      setCurrentChatId(updatedChats.length > 0 ? updatedChats[0].id : null);
    }
    await saveUserData();
  };

  const clearAllChats = async () => {
    setChats([]);
    setCurrentChatId(null);
    await (window as any).puter.kv.del('sigma_user_chats_v2');
    setShowDeleteConfirm(false);
  };

  const exportUserData = () => {
    const data = {
      profile: userProfile,
      chats: chats,
      exportDate: new Date().toISOString(),
      version: '2.0'
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sigma-ai-data-v2.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetSettings = () => {
    const defaultProfile: UserProfile = {
      username: userProfile?.username || '',
      email: userProfile?.email || '',
      age: userProfile?.age || '',
      preferences: {
        language: 'es',
        theme: 'light',
        model: 'gpt-5'
      },
      registrationDate: userProfile?.registrationDate || new Date()
    };
    setUserProfile(defaultProfile);
    setTheme('light');
    setCurrentLanguage('es');
    saveUserData();
  };

  const deleteAccount = async () => {
    try {
      await (window as any).puter.kv.del('sigma_user_profile_v2');
      await (window as any).puter.kv.del('sigma_user_chats_v2');
      (window as any).puter.auth.signOut();
      setIsAuthenticated(false);
      setCurrentScreen('welcome');
      setChats([]);
      setCurrentChatId(null);
      setUserProfile(null);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  // Función para extraer texto de PDF
  const extractPDF = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          // Simulamos extracción de PDF (en producción usarías PDF.js)
          resolve(`[Contenido del PDF: ${file.name}]\nTexto extraído del documento PDF...`);
        } catch (error) {
          resolve(`[Error al procesar PDF: ${file.name}]`);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  };

  // Función para extraer texto de imagen usando OCR simulado
  const extractImage = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        // Simulamos OCR (en producción usarías Tesseract.js)
        resolve(`[Análisis de imagen: ${file.name}]\nTexto detectado en la imagen...`);
      };
      reader.readAsDataURL(file);
    });
  };

  const processFiles = async (files: FileList) => {
    setIsProcessingFile(true);
    let extractedText = '';
    
    for (const file of Array.from(files)) {
      let text = '';
      if (file.type === 'application/pdf') {
        text = await extractPDF(file);
      } else if (file.type.startsWith('image/')) {
        text = await extractImage(file);
      } else if (file.type === 'text/plain') {
        text = await file.text();
      } else {
        text = `[Archivo no compatible: ${file.name}]\n`;
      }
      extractedText += text + '\n';
    }
    
    setSecretText(extractedText);
    setIsProcessingFile(false);
    return extractedText;
  };

  const handleFileUpload = async (files: FileList) => {
    if (!currentChatId) createNewChat();
    
    const extractedText = await processFiles(files);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: `[Archivos subidos: ${Array.from(files).map(f => f.name).join(', ')}]`,
      isUser: true,
      timestamp: new Date(),
      type: 'file',
      fileData: {
        name: Array.from(files).map(f => f.name).join(', '),
        type: 'multiple',
        content: extractedText
      }
    };

    const updatedChats = chats.map(chat => 
      chat.id === (currentChatId || chats[0]?.id) 
        ? { ...chat, messages: [...chat.messages, userMessage], lastUpdated: new Date() }
        : chat
    );
    setChats(updatedChats);
    await saveUserData();
  };

  const searchInternet = async (query: string) => {
    try {
      // Búsqueda gratuita usando DuckDuckGo Instant Answer API
      const response = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`);
      const data = await response.json();
      
      const results = [];
      if (data.Abstract) {
        results.push({
          title: data.Heading || 'Resultado principal',
          snippet: data.Abstract,
          url: data.AbstractURL
        });
      }
      
      // También buscar en Wikipedia
      const wikiResponse = await fetch(`https://es.wikipedia.org/w/api.php?action=query&list=search&format=json&origin=*&srsearch=${encodeURIComponent(query)}&srlimit=3`);
      const wikiData = await wikiResponse.json();
      
      if (wikiData.query?.search) {
        wikiData.query.search.forEach((result: any) => {
          results.push({
            title: result.title,
            snippet: result.snippet.replace(/<[^>]*>/g, ''),
            url: `https://es.wikipedia.org/?curid=${result.pageid}`
          });
        });
      }
      
      setInternetResults(results);
      return results;
    } catch (error) {
      console.error('Error searching internet:', error);
      return [];
    }
  };

  const generateImage = async (prompt: string) => {
    try {
      const imageElement = await (window as any).puter.ai.txt2img(prompt);
      return imageElement.src;
    } catch (error) {
      console.error('Error generating image:', error);
      return null;
    }
  };

  const detectImageGeneration = (text: string): boolean => {
    const imageKeywords = ['genera', 'crea', 'dibuja', 'imagen', 'foto', 'picture', 'draw', 'create', 'generate', 'make'];
    return imageKeywords.some(keyword => text.toLowerCase().includes(keyword));
  };

  const renderMarkdown = (text: string) => {
    let html = text;
    
    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-gray-900 dark:text-white mb-3">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">$1</h1>');
    
    // Bold and Italic
    html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em class="font-bold italic">$1</em></strong>');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
    
    // Strikethrough
    html = html.replace(/~~(.*?)~~/g, '<del class="line-through text-red-500">$1</del>');
    
    // Code blocks
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-gray-800 text-green-400 p-4 rounded-lg overflow-x-auto font-mono text-sm my-2"><code>$2</code></pre>');
    
    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded font-mono text-sm">$1</code>');
    
    // Lists
    html = html.replace(/^\* (.*$)/gim, '<li class="ml-4">• $1</li>');
    html = html.replace(/^\d+\. (.*$)/gim, '<li class="ml-4">$1</li>');
    
    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">$1</a>');
    
    // Line breaks
    html = html.replace(/\n/g, '<br>');
    
    return html;
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    let targetChatId = currentChatId;
    let updatedChats = [...chats];

    if (!targetChatId) {
      const newChat: Chat = {
        id: Date.now().toString(),
        title: message.slice(0, 30) + (message.length > 30 ? '...' : ''),
        messages: [],
        createdAt: new Date(),
        lastUpdated: new Date()
      };
      updatedChats = [newChat, ...chats];
      targetChatId = newChat.id;
      setCurrentChatId(targetChatId);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      isUser: true,
      timestamp: new Date()
    };

    updatedChats = updatedChats.map(chat => 
      chat.id === targetChatId 
        ? { ...chat, messages: [...chat.messages, userMessage], lastUpdated: new Date() }
        : chat
    );

    setChats(updatedChats);
    const currentMessage = message;
    setMessage('');
    setIsLoading(true);

    // Detectar si es una solicitud de generación de imagen
    if (detectImageGeneration(currentMessage)) {
      try {
        const imageUrl = await generateImage(currentMessage);
        if (imageUrl) {
          const imageMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: `Imagen generada: ${currentMessage}`,
            isUser: false,
            timestamp: new Date(),
            type: 'image',
            fileData: {
              name: 'generated-image.png',
              type: 'image',
              content: imageUrl
            }
          };

          updatedChats = updatedChats.map(chat => 
            chat.id === targetChatId
              ? { ...chat, messages: [...chat.messages, imageMessage], lastUpdated: new Date() }
              : chat
          );
          setChats(updatedChats);
          await saveUserData();
          setIsLoading(false);
          return;
        }
      } catch (error) {
        console.error('Error generating image:', error);
      }
    }

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: '',
      isUser: false,
      timestamp: new Date(),
      isStreaming: true
    };

    updatedChats = updatedChats.map(chat => 
      chat.id === targetChatId
        ? { ...chat, messages: [...chat.messages, aiMessage], lastUpdated: new Date() }
        : chat
    );
    setChats(updatedChats);

    try {
      const selectedModel = userProfile?.preferences?.model || 'gpt-5';
      let prompt = currentMessage;
      
      // Si hay texto secreto de archivos, incluirlo en el prompt
      if (secretText) {
        prompt = `Utiliza el siguiente contexto de archivos para responder la pregunta.\n\nContexto:\n${secretText}\n\nPregunta: ${currentMessage}`;
      }

      const response = await (window as any).puter.ai.chat(
        prompt,
        { stream: true, model: selectedModel }
      );

      let fullResponse = '';
      for await (const part of response) {
        if (part?.text) {
          fullResponse += part.text;
          updatedChats = updatedChats.map(chat => 
            chat.id === targetChatId
              ? {
                  ...chat,
                  messages: chat.messages.map(msg => 
                    msg.id === aiMessage.id 
                      ? { ...msg, content: fullResponse }
                      : msg
                  ),
                  lastUpdated: new Date()
                }
              : chat
          );
          setChats([...updatedChats]);
        }
      }

      updatedChats = updatedChats.map(chat => 
        chat.id === targetChatId
          ? {
              ...chat,
              messages: chat.messages.map(msg => 
                msg.id === aiMessage.id 
                  ? { ...msg, isStreaming: false }
                  : msg
              ),
              lastUpdated: new Date()
            }
          : chat
      );
      setChats(updatedChats);
      await saveUserData();
    } catch (error) {
      console.error('Error sending message:', error);
      updatedChats = updatedChats.map(chat => 
        chat.id === targetChatId
          ? {
              ...chat,
              messages: chat.messages.map(msg => 
                msg.id === aiMessage.id 
                  ? { ...msg, content: `${t.error}: No se pudo enviar el mensaje. Verifica tu conexión.`, isStreaming: false }
                  : msg
              ),
              lastUpdated: new Date()
            }
          : chat
      );
      setChats(updatedChats);
    } finally {
      setIsLoading(false);
    }
  };

  const ProfileForm = () => {
    const [formData, setFormData] = useState({
      username: userProfile?.username || '',
      email: userProfile?.email || '',
      age: userProfile?.age || '',
      language: userProfile?.preferences?.language || currentLanguage,
      model: userProfile?.preferences?.model || 'gpt-5'
    });

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      const profile: UserProfile = {
        username: formData.username,
        email: formData.email,
        age: formData.age,
        preferences: {
          language: formData.language,
          theme,
          model: formData.model
        },
        registrationDate: userProfile?.registrationDate || new Date()
      };
      setUserProfile(profile);
      setCurrentLanguage(formData.language);
      await saveUserData();
      setShowProfile(false);
      setCurrentScreen('chat');
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
            {t.profile}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Nombre de usuario"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
            <input
              type="number"
              placeholder="Edad"
              value={formData.age}
              onChange={(e) => setFormData({...formData, age: e.target.value})}
              className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
            <select
              value={formData.language}
              onChange={(e) => setFormData({...formData, language: e.target.value})}
              className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
            <select
              value={formData.model}
              onChange={(e) => setFormData({...formData, model: e.target.value})}
              className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {AI_MODELS.map(model => (
                <option key={model.value} value={model.value}>
                  {model.name} - {model.description}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Guardar
              </button>
              <button
                type="button"
                onClick={() => setShowProfile(false)}
                className="flex-1 bg-gray-500 text-white p-3 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Welcome Screen
  if (currentScreen === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-pulse">
              <Brain className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Sigma AI
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              {t.description}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">IA Avanzada</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Acceso a GPT-5, Claude Opus 4, y más de 15 modelos de IA de última generación con streaming en tiempo real.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Seguridad Total</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Autenticación segura con Puter.js, almacenamiento encriptado y protección completa de tus datos.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Funciones Premium</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Análisis de archivos, generación de imágenes, búsqueda por internet y soporte para 50+ idiomas.
              </p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setCurrentScreen('register')}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg text-lg font-semibold flex items-center justify-center gap-2"
              >
                <UserPlus className="w-5 h-5" />
                {t.register}
              </button>
              <button
                onClick={() => setCurrentScreen('auth')}
                className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all transform hover:scale-105 shadow-lg text-lg font-semibold"
              >
                {t.signIn}
              </button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Gratis • Sin límites • Sin configuración
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Smartphone className="w-4 h-4" />
              <span>Móvil</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Tablet className="w-4 h-4" />
              <span>Tablet</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Monitor className="w-4 h-4" />
              <span>Desktop</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Globe className="w-4 h-4" />
              <span>50+ Idiomas</span>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              {t.copyright}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Desarrollado con ❤️ usando Puter.js • {t.contact}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
              sigmaai.ct.ws
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Thanks Screen
  if (currentScreen === 'thanks') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md mx-auto text-center">
          <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {t.thanks}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Tu cuenta ha sido creada exitosamente. Ahora puedes disfrutar de todas las funcionalidades de Sigma AI.
          </p>
          <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
            <Heart className="w-5 h-5 animate-pulse" />
            <span className="font-semibold">¡Bienvenido a la familia Sigma AI!</span>
            <Star className="w-5 h-5 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // Auth Screen
  if (currentScreen === 'auth') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t.signIn}</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Accede a Sigma AI con tu cuenta de Puter
            </p>
          </div>

          <button
            onClick={handleSignIn}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg font-semibold"
          >
            {t.signIn} con Puter
          </button>

          <div className="mt-6 text-center">
            <button
              onClick={() => setCurrentScreen('welcome')}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              ← Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Register Screen
  if (currentScreen === 'register') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t.register}</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Únete a la revolución de la IA
            </p>
          </div>

          <button
            onClick={handleRegister}
            className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg font-semibold"
          >
            {t.register} con Puter
          </button>

          <div className="mt-6 text-center">
            <button
              onClick={() => setCurrentScreen('welcome')}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              ← Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Profile Setup Screen
  if (currentScreen === 'profile') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <ProfileForm />
      </div>
    );
  }

  // Main Chat Interface
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col ${window.innerWidth <= 768 && sidebarOpen ? 'absolute z-50 h-full' : ''}`}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-2 ${!sidebarOpen && 'justify-center'}`}>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              {sidebarOpen && (
                <h1 className="font-bold text-xl text-gray-900 dark:text-white">
                  Sigma AI
                </h1>
              )}
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <button
            onClick={createNewChat}
            className={`w-full flex items-center gap-3 p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all mb-4 ${!sidebarOpen && 'justify-center'}`}
          >
            <Plus className="w-5 h-5" />
            {sidebarOpen && <span>{t.newChat}</span>}
          </button>

          <div className="space-y-2">
            {chats.map(chat => (
              <div
                key={chat.id}
                className={`group flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors ${
                  currentChatId === chat.id 
                    ? 'bg-blue-100 dark:bg-blue-900' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                } ${!sidebarOpen && 'justify-center'}`}
                onClick={() => setCurrentChatId(chat.id)}
              >
                <MessageSquare className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                {sidebarOpen && (
                  <>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm text-gray-700 dark:text-gray-300 truncate block">
                        {chat.title}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {chat.lastUpdated.toLocaleDateString()}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteChat(chat.id);
                      }}
                      className="p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3 text-red-500" />
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className={`w-full flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors ${!sidebarOpen && 'justify-center'}`}
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            {sidebarOpen && <span className="text-gray-700 dark:text-gray-300">Tema</span>}
          </button>
          
          <button
            onClick={() => setShowProfile(true)}
            className={`w-full flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors ${!sidebarOpen && 'justify-center'}`}
          >
            <User className="w-5 h-5" />
            {sidebarOpen && <span className="text-gray-700 dark:text-gray-300">{t.profile}</span>}
          </button>

          <button
            onClick={() => setShowSettings(true)}
            className={`w-full flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors ${!sidebarOpen && 'justify-center'}`}
          >
            <Settings className="w-5 h-5" />
            {sidebarOpen && <span className="text-gray-700 dark:text-gray-300">{t.settings}</span>}
          </button>

          <button
            onClick={handleSignOut}
            className={`w-full flex items-center gap-3 p-3 hover:bg-red-100 dark:hover:bg-red-900 text-red-600 rounded-lg transition-colors ${!sidebarOpen && 'justify-center'}`}
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span>{t.signOut}</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {!currentChat ? (
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="text-center max-w-2xl">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                ¡Hola, {userProfile?.username}!
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                {t.welcomeBack} Inicia una nueva conversación para comenzar a explorar las capacidades ilimitadas de la IA.
              </p>
              <button
                onClick={createNewChat}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2 mx-auto"
              >
                <Plus className="w-5 h-5" />
                Iniciar Nueva Conversación
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {currentChat.messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl p-4 rounded-lg ${
                      msg.isUser
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    {msg.type === 'image' && msg.fileData ? (
                      <div>
                        <img 
                          src={msg.fileData.content} 
                          alt={msg.fileData.name}
                          className="max-w-full h-auto rounded-lg mb-2"
                        />
                        <p className="text-sm">{msg.content}</p>
                      </div>
                    ) : msg.type === 'file' && msg.fileData ? (
                      <div>
                        <div className="flex items-center gap-2 mb-2 p-2 bg-gray-100 dark:bg-gray-700 rounded">
                          <File className="w-4 h-4" />
                          <span className="text-sm">{msg.fileData.name}</span>
                        </div>
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    ) : (
                      <div 
                        className="whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
                      />
                    )}
                    {msg.isStreaming && (
                      <div className="mt-2 flex items-center gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    )}
                    <div className="text-xs opacity-70 mt-2">
                      {msg.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              {isProcessingFile && (
                <div className="mb-2 text-sm text-blue-600 dark:text-blue-400">
                  {t.processing}...
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                      handleFileUpload(files);
                    }
                  }}
                  multiple
                  accept=".pdf,.txt,.png,.jpg,.jpeg,.gif,.bmp,.webp"
                  className="hidden"
                />
                
                <div className="relative">
                  <button
                    onClick={() => setShowPlusMenu(!showPlusMenu)}
                    className="p-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                  
                  {showPlusMenu && (
                    <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2 min-w-48 z-10">
                      <button
                        onClick={() => {
                          fileInputRef.current?.click();
                          setShowPlusMenu(false);
                        }}
                        className="w-full flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-left"
                      >
                        <Paperclip className="w-4 h-4" />
                        <span className="text-sm">{t.uploadFile}</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowInternetSearch(true);
                          setShowPlusMenu(false);
                        }}
                        className="w-full flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-left"
                      >
                        <Search className="w-4 h-4" />
                        <span className="text-sm">{t.searchInternet}</span>
                      </button>
                      <button
                        onClick={() => {
                          setMessage(message + ' [generar imagen: ');
                          setShowPlusMenu(false);
                        }}
                        className="w-full flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-left"
                      >
                        <Camera className="w-4 h-4" />
                        <span className="text-sm">{t.generateImage}</span>
                      </button>
                    </div>
                  )}
                </div>

                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder={t.typeMessage}
                  className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  disabled={isLoading}
                />
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !message.trim()}
                  className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Internet Search Modal */}
      {showInternetSearch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t.searchInternet}</h2>
              <button
                onClick={() => setShowInternetSearch(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={internetQuery}
                onChange={(e) => setInternetQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchInternet(internetQuery)}
                placeholder="Buscar en internet..."
                className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <button
                onClick={() => searchInternet(internetQuery)}
                className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {internetResults.map((result, index) => (
                <div key={index} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <a
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-1">{result.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{result.snippet}</p>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{t.settings}</h2>
            <div className="space-y-3">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
                <span>🗑️ Limpiar historial completo</span>
              </button>
              
              <button
                onClick={exportUserData}
                className="w-full flex items-center gap-3 p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Download className="w-5 h-5" />
                <span>📥 Exportar datos personales</span>
              </button>
              
              <button
                onClick={resetSettings}
                className="w-full flex items-center gap-3 p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
                <span>🔄 Restablecer configuración</span>
              </button>
              
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
              >
                <UserX className="w-5 h-5" />
                <span>⚠️ Eliminar cuenta</span>
              </button>
              
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <Mail className="w-4 h-4" />
                  <span>{t.contact}</span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {t.copyright}
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setShowSettings(false)}
              className="w-full mt-4 bg-gray-500 text-white p-3 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Confirmar eliminación</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Esta acción no se puede deshacer. ¿Estás seguro de que quieres continuar?
            </p>
            <div className="flex gap-3">
              <button
                onClick={deleteAccount}
                className="flex-1 bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 transition-colors"
              >
                Sí, eliminar
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-gray-500 text-white p-3 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfile && <ProfileForm />}

      {/* Mobile overlay */}
      {window.innerWidth <= 768 && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default App;