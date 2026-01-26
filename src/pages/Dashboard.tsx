import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { useMood } from '@/hooks/useMood';
import { useNavigate } from 'react-router-dom';
import { 
  MessageCircle, 
  Heart, 
  TrendingUp, 
  Settings, 
  Flame,
  Sun,
  Moon,
  CloudSun,
  Sparkles,
  ArrowRight,
  Calendar,
  Trophy
} from 'lucide-react';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return { text: 'Good Morning', icon: Sun };
  if (hour < 18) return { text: 'Good Afternoon', icon: CloudSun };
  return { text: 'Good Evening', icon: Moon };
};

const quickActions = [
  { 
    title: 'Start Chat', 
    description: 'Talk with your CBT companion', 
    icon: MessageCircle, 
    path: '/chat',
    color: 'bg-primary/10 text-primary'
  },
  { 
    title: 'Log Mood', 
    description: 'Track how you\'re feeling', 
    icon: Heart, 
    path: '/mood',
    color: 'bg-warm/20 text-warm-foreground'
  },
  { 
    title: 'View Progress', 
    description: 'See your wellness journey', 
    icon: TrendingUp, 
    path: '/progress',
    color: 'bg-success/20 text-success-foreground'
  },
  { 
    title: 'Settings', 
    description: 'Customize your experience', 
    icon: Settings, 
    path: '/settings',
    color: 'bg-muted text-muted-foreground'
  },
];

const dailyTips = [
  "Take a few deep breaths. Inhale for 4 counts, hold for 4, exhale for 4.",
  "Remember: Your thoughts are not facts. They're just thoughts.",
  "Small steps count. Celebrate every little victory today.",
  "It's okay to not be okay. You're doing your best.",
  "Try to notice one good thing that happens today, no matter how small.",
];

export default function Dashboard() {
  const { user, isGuest } = useAuth();
  const { entries, getStreak, getAverageMood } = useMood(isGuest);
  const navigate = useNavigate();
  
  const greeting = getGreeting();
  const GreetingIcon = greeting.icon;
  const streak = getStreak();
  const avgMood = getAverageMood(7);
  const todaysTip = dailyTips[new Date().getDay() % dailyTips.length];
  
  const displayName = user?.name || (isGuest ? 'Friend' : 'there');

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex flex-col flex-1">
          <header className="flex items-center gap-4 px-4 py-3 border-b border-border/50 bg-card">
            <SidebarTrigger className="-ml-1" />
            <div>
              <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
              <p className="text-xs text-muted-foreground">Your wellness hub</p>
            </div>
          </header>

          <ScrollArea className="flex-1 p-4 md:p-6">
            <div className="max-w-5xl mx-auto space-y-6">
              {/* Welcome Banner */}
              <Card className="card-calm border-border/50 bg-gradient-to-br from-primary/5 via-accent/5 to-warm/5">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-primary">
                        <GreetingIcon className="h-5 w-5" />
                        <span className="text-sm font-medium">{greeting.text}</span>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                        Welcome back, {displayName}! 👋
                      </h2>
                      <p className="text-muted-foreground max-w-md">
                        How are you feeling today? Take a moment to check in with yourself.
                      </p>
                      <Button 
                        onClick={() => navigate('/chat')} 
                        className="mt-4 bg-primary hover:bg-primary/90"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Start a Conversation
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                    <div className="hidden md:block">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <Sparkles className="h-10 w-10 text-primary" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="card-calm border-border/50">
                  <CardContent className="pt-4 pb-4 text-center">
                    <Flame className="h-6 w-6 text-warm-foreground mx-auto mb-1" />
                    <p className="text-2xl font-bold text-foreground">{streak}</p>
                    <p className="text-xs text-muted-foreground">Day Streak</p>
                  </CardContent>
                </Card>
                <Card className="card-calm border-border/50">
                  <CardContent className="pt-4 pb-4 text-center">
                    <Heart className="h-6 w-6 text-primary mx-auto mb-1" />
                    <p className="text-2xl font-bold text-foreground">{avgMood ? avgMood.toFixed(1) : '—'}</p>
                    <p className="text-xs text-muted-foreground">Avg Mood</p>
                  </CardContent>
                </Card>
                <Card className="card-calm border-border/50">
                  <CardContent className="pt-4 pb-4 text-center">
                    <Calendar className="h-6 w-6 text-accent-foreground mx-auto mb-1" />
                    <p className="text-2xl font-bold text-foreground">{entries.length}</p>
                    <p className="text-xs text-muted-foreground">Check-ins</p>
                  </CardContent>
                </Card>
                <Card className="card-calm border-border/50">
                  <CardContent className="pt-4 pb-4 text-center">
                    <Trophy className="h-6 w-6 text-success-foreground mx-auto mb-1" />
                    <p className="text-2xl font-bold text-foreground">{entries.length > 0 ? 1 : 0}</p>
                    <p className="text-xs text-muted-foreground">Achievements</p>
                  </CardContent>
                </Card>
              </div>

              {/* Daily Tip */}
              <Card className="card-calm border-border/50 bg-gradient-to-r from-accent/10 to-transparent">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Daily Wellness Tip
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground italic">"{todaysTip}"</p>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {quickActions.map((action) => (
                    <Card 
                      key={action.title}
                      className="card-calm border-border/50 cursor-pointer transition-all hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                      onClick={() => navigate(action.path)}
                    >
                      <CardContent className="pt-6">
                        <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center mb-3`}>
                          <action.icon className="h-6 w-6" />
                        </div>
                        <h4 className="font-semibold text-foreground">{action.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <Card className="card-calm border-border/50">
                <CardHeader>
                  <CardTitle className="text-base">Recent Activity</CardTitle>
                  <CardDescription>Your latest mood check-ins</CardDescription>
                </CardHeader>
                <CardContent>
                  {entries.length === 0 ? (
                    <div className="text-center py-8">
                      <Heart className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-muted-foreground">No mood entries yet</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => navigate('/mood')}
                      >
                        Log Your First Mood
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {entries.slice(0, 5).map((entry) => {
                        const moodEmojis = ['😢', '😔', '😐', '🙂', '😊'];
                        const emoji = moodEmojis[entry.mood - 1] || '😐';
                        return (
                          <div 
                            key={entry.id}
                            className="flex items-center gap-4 p-3 rounded-lg bg-muted/30"
                          >
                            <span className="text-2xl">{emoji}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground">
                                Mood: {entry.mood}/5
                              </p>
                              {entry.notes && (
                                <p className="text-xs text-muted-foreground truncate">
                                  {entry.notes}
                                </p>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {new Date(entry.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                        );
                      })}
                      {entries.length > 5 && (
                        <Button 
                          variant="ghost" 
                          className="w-full text-primary"
                          onClick={() => navigate('/mood')}
                        >
                          View All Entries
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Guest Mode Banner */}
              {isGuest && (
                <Card className="card-calm border-primary/30 bg-primary/5">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">You're in Guest Mode</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Your data won't be saved after this session. Create an account to save your progress!
                        </p>
                      </div>
                      <Button onClick={() => navigate('/signup')} variant="outline">
                        Sign Up
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </ScrollArea>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
