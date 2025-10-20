// src/utils/avatarHelper.ts
const CLOUDINARY_BASE_URL = 'https://res.cloudinary.com'; // Your Cloudinary URL base
const LOCAL_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Get avatar URL with multiple fallback strategies
 * Priority: 
 * 1. Use provided avatarUrl if it's a full URL (Cloudinary)
 * 2. Try to get from localStorage/sessionStorage
 * 3. Try to get from stored user object
 * 4. Return empty string as final fallback
 */
export const getAvatarUrl = (avatarUrl?: string): string => {
  // Case 1: Avatar URL is provided and is already a full URL (Cloudinary or external)
  if (avatarUrl && (avatarUrl.startsWith('http://') || avatarUrl.startsWith('https://'))) {
    return avatarUrl;
  }

  // Case 2: Avatar URL is provided but is a partial path
  if (avatarUrl) {
    // Check if it's a Cloudinary path (contains cloudinary.com)
    if (avatarUrl.includes('cloudinary.com')) {
      return avatarUrl.startsWith('https://') ? avatarUrl : `https://${avatarUrl}`;
    }
    
    // Check if it's a local upload path
    if (avatarUrl.startsWith('/uploads/') || avatarUrl.startsWith('/api/uploads/')) {
      return `${LOCAL_API_URL}${avatarUrl}`;
    }
    
    // If it's just a filename, assume it's in local uploads
    if (!avatarUrl.includes('/')) {
      return `${LOCAL_API_URL}/api/uploads/avatars/${avatarUrl}`;
    }
    
    // Otherwise, treat it as a relative path
    return `${LOCAL_API_URL}${avatarUrl.startsWith('/') ? '' : '/'}${avatarUrl}`;
  }

  // Case 3: No avatar URL provided, try fallbacks
  // Fallback 1: Check dedicated avatar storage
  const localAvatar = localStorage.getItem('bloxmarket-avatar');
  const sessionAvatar = sessionStorage.getItem('bloxmarket-avatar');
  const storedAvatar = localAvatar || sessionAvatar;
  
  if (storedAvatar) {
    return processAvatarUrl(storedAvatar);
  }
  
  // Fallback 2: Try to get from stored user object
  const localUser = localStorage.getItem('bloxmarket-user');
  const sessionUser = sessionStorage.getItem('bloxmarket-user');
  const storedUser = localUser || sessionUser;
  
  if (storedUser) {
    try {
      const userData = JSON.parse(storedUser);
      if (userData.avatar_url) {
        return processAvatarUrl(userData.avatar_url);
      }
    } catch (error) {
      console.error('Error parsing stored user for avatar:', error);
    }
  }
  
  // Final fallback: return empty string
  return '';
};

/**
 * Helper function to process avatar URL consistently
 */
const processAvatarUrl = (url: string): string => {
  if (!url) return '';
  
  // Already a full URL (Cloudinary or external)
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Cloudinary path without protocol
  if (url.includes('cloudinary.com')) {
    return `https://${url}`;
  }

  // Local API paths
  if (url.startsWith('/uploads/') || url.startsWith('/api/uploads/')) {
    return `${LOCAL_API_URL}${url}`;
  }

  // Just a filename
  return `${LOCAL_API_URL}/api/uploads/avatars/${url}`;
};

/**
 * Store avatar URL in appropriate storage
 */
export const storeAvatarUrl = (avatarUrl: string, persistent: boolean = true) => {
  const storage = persistent ? localStorage : sessionStorage;
  storage.setItem('bloxmarket-avatar', avatarUrl);
  
  // Also update the user object
  const storedUser = storage.getItem('bloxmarket-user');
  if (storedUser) {
    try {
      const userData = JSON.parse(storedUser);
      userData.avatar_url = avatarUrl;
      storage.setItem('bloxmarket-user', JSON.stringify(userData));
    } catch (error) {
      console.error('Error updating user object with avatar:', error);
    }
  }
};

/**
 * Clear avatar from storage
 */
export const clearStoredAvatar = () => {
  localStorage.removeItem('bloxmarket-avatar');
  sessionStorage.removeItem('bloxmarket-avatar');
};