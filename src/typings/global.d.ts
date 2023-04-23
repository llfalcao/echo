declare interface Playlist {
  id: string;
  title: string;
  tracks: Track[];
  cover_image?: string;
  created_at: Date;
  updated_at?: Date;
}

declare interface Track {
  id: string;
  yid: string;
  title: string;
  cover_image?: string;
  lyrics?: string;
  added_at: Date;
  updated_at: Date;
  solved_at?: Date;
}
