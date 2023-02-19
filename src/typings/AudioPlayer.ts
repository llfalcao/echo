export interface Playlist {
  id: string;
  title: string;
  tracks: Track[];
  image?: string;
}

export interface Track {
  id: string;
  yid: string;
  title: string;
  // url: string;
  image?: string;
  artist?: string;
  lyrics?: string;
  // addedAt: Date;
  foundAt?: Date;
}
