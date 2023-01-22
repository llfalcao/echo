export interface Playlist {
  id: string;
  title: string;
  tracks: Track[];
}

export interface Track {
  id: string;
  yid: string;
  title: string;
  // url: string;
  cover?: string;
  artist?: string;
  lyrics?: string;
  // addedAt: Date;
  foundAt?: Date;
}
