declare interface Playlist {
  id: string;
  title: string;
  tracks: Track[];
  cover_image?: string;
  created_at: string;
  updated_at?: string;
}

declare interface Track {
  id: TrackId;
  yid: string;
  title: string;
  cover_image: string;
  lyrics?: string;
  added_at: string;
  updated_at: string;
  solved_at?: string;
}

type TrackId = string;
