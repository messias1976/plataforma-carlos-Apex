import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/MockAuthContext';

const TrailsContext = createContext();

export const useTrails = () => {
  const context = useContext(TrailsContext);
  if (context === undefined) {
    throw new Error('useTrails must be used within a TrailsProvider');
  }
  return context;
};

const MOCK_TRAILS = [
  {
    id: 'trail-1',
    title: 'Frontend Mastery',
    description: 'Master modern frontend development with React, Tailwind, and more.',
    cover_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60',
    plan_level: 'free',
    modules: [
      {
        id: 'mod-1',
        title: 'React Fundamentals',
        order_index: 0,
        lessons: [
          { id: 'less-1', title: 'Components & Props', duration_minutes: 15, order_index: 0 },
          { id: 'less-2', title: 'State Management', duration_minutes: 20, order_index: 1 },
          { id: 'less-3', title: 'useEffect Hook', duration_minutes: 18, order_index: 2 }
        ]
      },
      {
        id: 'mod-2',
        title: 'Advanced Styling',
        order_index: 1,
        lessons: [
          { id: 'less-4', title: 'TailwindCSS Basics', duration_minutes: 25, order_index: 0 },
          { id: 'less-5', title: 'Responsive Design', duration_minutes: 30, order_index: 1 }
        ]
      }
    ]
  },
  {
    id: 'trail-2',
    title: 'Backend Engineering',
    description: 'Build scalable APIs and manage databases.',
    cover_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=60',
    plan_level: 'premium',
    modules: [
      {
        id: 'mod-3',
        title: 'Node.js Basics',
        order_index: 0,
        lessons: [
          { id: 'less-6', title: 'Event Loop', duration_minutes: 20, order_index: 0 },
          { id: 'less-7', title: 'Express Framework', duration_minutes: 35, order_index: 1 }
        ]
      }
    ]
  }
];

export const TrailsProvider = ({ children }) => {
  // Ensure useAuth is called inside the component body
  const { user } = useAuth();
  
  const [trails, setTrails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTrail, setCurrentTrail] = useState(null);
  const [completedLessons, setCompletedLessons] = useState({}); // { lessonId: true }
  const [userPlan, setUserPlan] = useState('free');

  useEffect(() => {
    // Simulate fetching data
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800)); // Mock network delay
      
      setTrails(MOCK_TRAILS);
      
      // Load progress from local storage
      const savedProgress = localStorage.getItem('apex_lesson_progress');
      if (savedProgress) {
        setCompletedLessons(JSON.parse(savedProgress));
      }
      
      if (user?.subscription?.plan) {
        setUserPlan(user.subscription.plan);
      }
      
      setLoading(false);
    };

    loadData();
  }, [user]);

  const getTrailDetails = async (trailId) => {
    const trail = MOCK_TRAILS.find(t => t.id === trailId);
    if (!trail) return null;
    
    // In mock version, modules are already nested. 
    // We map over them to inject completion status from local state
    const trailWithProgress = {
      ...trail,
      modules: trail.modules.map(mod => ({
        ...mod,
        lessons: mod.lessons.map(lesson => ({
          ...lesson,
          lesson_progress: { completed: !!completedLessons[lesson.id] }
        }))
      }))
    };
    
    return trailWithProgress;
  };

  const markLessonComplete = async (lessonId) => {
    const newProgress = { ...completedLessons, [lessonId]: true };
    setCompletedLessons(newProgress);
    localStorage.setItem('apex_lesson_progress', JSON.stringify(newProgress));
    
    // If we have a current trail open, update it to reflect new state immediately
    if (currentTrail) {
       const updatedTrail = await getTrailDetails(currentTrail.id);
       setCurrentTrail(updatedTrail);
    }
  };

  const canAccessTrail = (trailPlan) => {
    const plans = { 'free': 0, 'standard': 1, 'premium': 2 };
    const userLevel = plans[userPlan] || 0;
    const trailLevel = plans[trailPlan] || 0;
    return userLevel >= trailLevel;
  };

  const fetchTrails = async () => {
     // Already loaded in effect, but exposed for manual refresh if needed
     setTrails(MOCK_TRAILS);
  };

  return (
    <TrailsContext.Provider value={{
      trails,
      loading,
      userPlan,
      currentTrail,
      setCurrentTrail,
      getTrailDetails,
      markLessonComplete,
      canAccessTrail,
      fetchTrails
    }}>
      {children}
    </TrailsContext.Provider>
  );
};