import { Player, PlayerAction } from ".";

export const playerReducer = (player: Player, action: PlayerAction): Player => {
  const { type, payload } = action;

  const getCurrentTrackIndex = () => {
    const { tracks } = player.playlist ?? {};
    return tracks?.findIndex((track) => track.id === player.current) ?? 0;
  };

  switch (type) {
    case "PLAY": {
      return { ...player, playing: true };
    }

    case "PAUSE": {
      return { ...player, playing: false };
    }

    case "PREVIOUS": {
      const { audioRef } = player;
      if (!audioRef?.current) return player;
      const index = getCurrentTrackIndex();
      const { tracks } = player.playlist ?? {};

      if (index > 0 && tracks?.[index - 1]) {
        return { ...player, current: tracks[index - 1].id };
      }

      audioRef.current.currentTime = 0;
      return { ...player, current: tracks?.[0].id };
    }

    case "NEXT": {
      const index = getCurrentTrackIndex();
      const { audioRef, playlist, repeat } = player;
      const { tracks } = playlist ?? {};

      if (!tracks?.length || !audioRef?.current) return player;
      const hasNext = tracks[index + 1] !== undefined;
      const isLast = tracks[tracks.length - 1].id === tracks[index].id;

      if (repeat === "song") {
        audioRef.current.currentTime = 0;
      } else if (repeat === "playlist" && isLast) {
        return { ...player, current: tracks[0].id };
      } else if (hasNext) {
        return { ...player, current: tracks[index + 1].id };
      }

      if (hasNext && audioRef.current.ended) {
        return { ...player, playing: true };
      }

      return player;
    }

    case "REPEAT": {
      const { audioRef, repeat } = player;

      if (audioRef.current) {
        if (repeat === "none") {
          return { ...player, repeat: "song" };
        }

        if (repeat === "song") {
          return { ...player, repeat: "playlist" };
        }
      }

      return { ...player, repeat: "none" };
    }

    case "SHUFFLE": {
      const index = getCurrentTrackIndex();
      const { backupPlaylist, playlist, shuffle } = player;
      const { tracks } = playlist ?? {};

      if (!tracks || !playlist || !backupPlaylist?.tracks) {
        return player;
      }

      // Currently NOT shuffled
      if (!shuffle) {
        const previous = tracks.slice(0, index + 1);
        const upcoming = tracks.slice(index + 1);

        for (let i = 0; i < upcoming.length; i++) {
          const j = Math.floor(Math.random() * (i + 1));
          [upcoming[i], upcoming[j]] = [upcoming[j], upcoming[i]];
        }

        const shuffled = [...previous, ...upcoming];

        return {
          ...player,
          playlist: { ...playlist, tracks: shuffled },
          shuffle: true,
        };
      }

      // Currently shuffled
      const currentTrackIndex = backupPlaylist.tracks.findIndex(
        (track) => track.id === tracks[index].id,
      );

      const previous = backupPlaylist.tracks.slice(0, index + 1);
      const upcoming = backupPlaylist.tracks.slice(index + 1);
      const unshuffled = [...previous, ...upcoming];

      return {
        ...player,
        playlist: { ...playlist, tracks: unshuffled },
        current: backupPlaylist.tracks[currentTrackIndex].id,
        shuffle: false,
      };
    }

    case "SET_PLAYLIST": {
      return { ...player, ...payload };
    }

    case "SET_BACKUP_PLAYLIST": {
      return { ...player, backupPlaylist: payload };
    }

    case "SET_SRC": {
      return { ...player, src: payload };
    }

    case "SET_CURRENT": {
      return { ...player, current: payload };
    }

    case "SET_TRACKS": {
      const { tracks, current } = payload;
      const { playlist } = player as { playlist: Playlist };
      return { ...player, current, playlist: { ...playlist, tracks } };
    }

    case "SET_CURRENT_TIME": {
      return { ...player, currentTime: payload };
    }

    case "SET_DURATION": {
      return { ...player, duration: payload };
    }

    case "SET_CLICKED_TIME": {
      return { ...player, clickedTime: payload };
    }

    case "SET_VOLUME": {
      return { ...player, volume: payload };
    }

    case "USER_INTERACTION": {
      return { ...player, userInteracted: payload };
    }

    default:
      throw Error("Unknown action type: " + action.type);
  }
};
