// This hook is deprecated as part of the removal of Supabase.
// Stub provided for compatibility.
import { useState } from 'react';

export const useTopicProgress = () => {
    return {
        progress: 0,
        updateProgress: () => {},
        loading: false
    };
};