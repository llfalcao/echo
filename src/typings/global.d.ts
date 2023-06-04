declare interface Track {
  id: string;
  yid: string;
  title: string;
  cover_image: string;
  lyrics?: string;
  added_at: string;
  updated_at: string;
  solved_at?: string;
}

declare interface Playlist {
  id: string;
  title: string;
  tracks: Track[];
  cover_image?: string;
  created_at: string;
  updated_at?: string;
}
