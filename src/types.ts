// Tipos principales de HUMANBIBLIO
export interface User {
  id: string;
  full_name: string;
  email: string;
  profession?: string;
  profession_en?: string;
  bio?: string;
  bio_en?: string;
  interests: string[];
  interests_en?: string[];
  avatar_url?: string;
  location?: string;
  country?: string;
  country_flag?: string;
  native_language?: string;
  languages_spoken?: string[];
  created_at?: string;
  is_wb_seller?: boolean;
  wb_profile_id?: string;
  wb_subscription_active?: boolean;
  trust_score?: number;
}

export interface Business {
  id: string;
  name: string;
  name_en?: string;
  category: string;
  category_en?: string;
  description: string;
  description_en?: string;
  products_services: string[];
  products_services_en?: string[];
  owner_id: string;
  contact_email?: string;
  contact_phone?: string;
  website?: string;
  location?: string;
  avatar_url?: string;
  created_at?: string;
  media_gallery?: MediaItem[];
  is_featured?: boolean;
  subscription_tier?: 'free' | 'basic' | 'premium' | 'enterprise';
  trust_score?: number;
}

export interface MediaItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  title?: string;
  description?: string;
  order?: number;
}

export interface WBSubscription {
  id: string;
  user_id: string;
  business_id: string;
  tier: 'basic' | 'premium' | 'enterprise';
  price: number;
  active: boolean;
  expires_at: string;
  created_at: string;
}

export type ActiveSection = 'agora' | 'boulevard' | 'dashboard';

export interface Message {
  id: string;
  content: string;
  sender_id: string;
  recipient_id: string;
  conversation_id: string;
  created_at: string;
  is_ai?: boolean;
  ai_personality?: string;
}

export interface Conversation {
  id: string;
  participants: string[];
  last_message?: Message;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  title_en?: string;
  description: string;
  description_en?: string;
  category: string;
  category_en?: string;
  creator_id: string;
  creator_name: string;
  creator_avatar?: string;
  funding_goal: number;
  current_funding: number;
  likes_count: number;
  comments_count: number;
  status: 'draft' | 'active' | 'funded' | 'completed' | 'cancelled';
  tags: string[];
  tags_en?: string[];
  media_urls: string[];
  conversation_id?: string;
  is_public_conversation: boolean;
  funding_threshold: number;
  created_at: string;
  updated_at: string;
  deadline?: string;
}

export interface ProjectLike {
  id: string;
  project_id: string;
  user_id: string;
  created_at: string;
}

export interface ProjectComment {
  id: string;
  project_id: string;
  user_id: string;
  content: string;
  parent_id?: string; // Para respuestas anidadas
  likes_count: number;
  created_at: string;
}

export interface UniverseProfile {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  user_profession?: string;
  topic: string;
  description: string;
  project_title?: string;
  looking_for: 'discussion' | 'collaboration' | 'funding' | 'partnership';
  contact_preference: 'chat' | 'email' | 'call' | 'any';
  is_seeking_partners: boolean; // Distintivo HJ
  likes_count: number;
  contact_count: number;
  status: 'active' | 'paused' | 'completed';
  tags: string[];
  funding_received?: number;
  funders: ProjectFunder[];
  is_funded: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProjectFunder {
  id: string;
  funder_user_id: string;
  funder_name: string;
  funder_avatar?: string;
  funder_profession?: string;
  funder_profession_en?: string;
  funder_type: 'individual' | 'business' | 'organization';
  amount_funded: number;
  funding_date: string;
  recognition_level: 'bronze' | 'silver' | 'gold' | 'platinum';
  public_message?: string;
  public_message_en?: string;
  is_wb_business: boolean;
  wb_business_id?: string;
}