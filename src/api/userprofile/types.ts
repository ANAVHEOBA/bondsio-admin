export interface Country {
    id: number;
    name: string;
  }
  
  export interface UserProfile {
    id: string;
    full_name: string | null;
    email: string;
    user_name: string | null;
    phone: string | null;
    bio: string | null;
    notification: boolean;
    country_id: number | null;
    dob: string | null;
    email_verified: boolean;
    profile_image: string | null;
    device_type: string | null;
    fcm_token: string | null;
    created_at: string;
    followers_count: number;
    following_count: number;
    bonds_count: number;
    activities_count: number;
    country: Country | null;
    is_following: boolean;
  }
  
  export interface UserProfileResponse {
    code: number;
    message: string;
    data: UserProfile;
  }