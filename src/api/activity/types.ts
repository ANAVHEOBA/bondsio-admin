export interface Participant {
    id: string;
    full_name: string | null;
    user_name: string | null;
    profile_image: string | null;
  }
  
  export interface Creator {
    id: string;
    full_name: string | null;
    user_name: string | null;
    email?: string;
    phone?: string | null;
    otp_phone?: string | null;
    otp_email?: string | null;
    phone_verified?: boolean;
    email_verified?: boolean;
    dob?: string;
    country_id?: number;
    bio?: string;
    profile_image?: string | null;
    latitude?: string;
    longitude?: string;
    notification?: boolean;
    device_type?: string;
    password?: null;
    fcm_token?: string;
    social_id?: string | null;
    social_type?: string | null;
    deleted_at?: string | null;
    created_at: string;
    gender?: string | null;
    role: string;
  }
  
  export interface AdminActivity {
    id: number;
    title: string;
    description: string;
    location: string;
    latitude: string;
    longitude: string;
    start_date: string;
    end_date: string;
    max_participants: number;
    request_to_join: boolean;
    is_public: boolean;
    post_to_story: boolean;
    cover_image: string | null;
    likes_count: number;
    visibility: string;
    creator: Creator;
    creator_id: string;
    co_organizers: Creator[];
    participants: Participant[];
    total_participants_count: number;
    totalParticipantsCount: number;
    interests: any[];
  }
  
  export interface SingleActivityResponse {
    code: number;
    message: string;
    data: AdminActivity;
  }
  
  // 👇 Keep existing types for list endpoints
  export interface Bond {
    id: number;
    name: string;
    city: string;
    description: string;
    banner: string;
    member_count: number;
    likes_count: number;
    is_public: boolean;
    is_trending: boolean;
  }
  
  export interface Activity {
    id: number;
    title: string;
    description: string;
    location: string;
    latitude: string;
    longitude: string;
    start_date: string;
    end_date: string;
    max_participants: number;
    request_to_join: boolean;
    is_public: boolean;
    post_to_story: boolean;
    cover_image: string;
    likes_count: number;
    creator_id: string;
    visibility: string;
    participants: Participant[];
    interests: any[];
    bonds: Bond[];
    total_participants_count: number;
    creator: Creator;
    is_organiser: boolean;
    is_liked: boolean;
    has_joined: boolean;
  }
  
  export interface ActivityResponseData {
    activities: Activity[];
    total: number;
  }
  
  export interface ActivityResponse {
    code: number;
    message: string;
    data: ActivityResponseData;
  }
  
  export interface TrendingActivitiesResponseData {
    activities: Activity[];
    total: number;
  }
  
  export interface TrendingActivitiesResponse {
    code: number;
    message: string;
    data: TrendingActivitiesResponseData;
  }