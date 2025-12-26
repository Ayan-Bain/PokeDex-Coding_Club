import * as Audio from 'expo-audio';

let globalPlayer = null;

export const playPokemonCry = async (url) => {
  if (!url) return;

  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
    });
    if (globalPlayer) {
      globalPlayer.pause();
    }
    globalPlayer = Audio.createAudioPlayer(url);
    globalPlayer.play();

  } catch (error) {
    console.error("expo-audio Service Error Details:", error);
  }
};