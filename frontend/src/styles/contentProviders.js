import amazonPrimeVideo from '../assets/contentProviders/amazon_prime_video.jpg';
import appleiTunes from '../assets/contentProviders/apple_itunes.jpg';
import appleTvPlus from '../assets/contentProviders/apple_tv_plus.jpg';
import claroVideo from '../assets/contentProviders/claro_video.jpg';
import disneyPlus from '../assets/contentProviders/disney_plus.jpg';
import foxPlay from '../assets/contentProviders/fox_play.jpg';
import foxPremium from '../assets/contentProviders/fox_premium.jpg';
import globoPlay from '../assets/contentProviders/globo_play.jpg';
import googlePlayMovies from '../assets/contentProviders/google_play_movies.jpg';
import hboGo from '../assets/contentProviders/hbo_go.jpg';
import looke from '../assets/contentProviders/looke.jpg';
import microsoftStore from '../assets/contentProviders/microsoft_store.jpg';
import netflix from '../assets/contentProviders/netflix.jpg';
import now from '../assets/contentProviders/now.jpg';
import telecinePlay from '../assets/contentProviders/telecine_play.jpg';
import crunchyroll from '../assets/contentProviders/crunchyroll.jpg';
import windows from '../assets/gamePlatforms/windows.png';
import playstation5 from '../assets/gamePlatforms/playstation_5.png';
import xboxOne from '../assets/gamePlatforms/xbox_one.png';
import playstation4 from '../assets/gamePlatforms/playstation_4.png';
import xboxSeriesSX from '../assets/gamePlatforms/xbox_series_x_s.png';
import nintendoSwitch from '../assets/gamePlatforms/nintendo_switch.png';
import iOS from '../assets/gamePlatforms/iOS.png';
import android from '../assets/gamePlatforms/android.png';
import nintendo3DS from '../assets/gamePlatforms/nintendo_3DS.png';
import nintendoDS from '../assets/gamePlatforms/nintendo_DS.png';
import nintendoDSi from '../assets/gamePlatforms/nintendo_DSi.png';
import macOS from '../assets/gamePlatforms/macOS.png';
import linux from '../assets/gamePlatforms/linux.png';
import xbox360 from '../assets/gamePlatforms/xbox_360.png';
import xbox from '../assets/gamePlatforms/xbox.png';
import playstation3 from '../assets/gamePlatforms/playstation_3.png';
import playstation2 from '../assets/gamePlatforms/playstation_2.png';
import playstation from '../assets/gamePlatforms/playstation.png';
import psVita from '../assets/gamePlatforms/ps_vita.png';
import psp from '../assets/gamePlatforms/psp.png';
import wiiU from '../assets/gamePlatforms/wii_u.png';
import wii from '../assets/gamePlatforms/wii.png';
import gameCube from '../assets/gamePlatforms/game_cube.png';
import nintendo64 from '../assets/gamePlatforms/nintendo_64.png';
import gameBoyAdvance from '../assets/gamePlatforms/game_boy_advance.png';
import gameBoyColor from '../assets/gamePlatforms/game_boy_color.png';
import gameBoy from '../assets/gamePlatforms/game_boy.png';
import snes from '../assets/gamePlatforms/snes.png';
import nes from '../assets/gamePlatforms/nes.png';
import classicMacintosh from '../assets/gamePlatforms/classic_macintosh.png';
import appleII from '../assets/gamePlatforms/apple_ii.png';
import commodoreAmiga from '../assets/gamePlatforms/commodore_amiga.png';
import atari7800 from '../assets/gamePlatforms/atari_7800.png';
import atari5200 from '../assets/gamePlatforms/atari_5200.png';
import atari2600 from '../assets/gamePlatforms/atari_2600.png';
import atariFlashback from '../assets/gamePlatforms/atari_flashback.png';
import atari8bit from '../assets/gamePlatforms/atari_8_bit.png';
import atariST from '../assets/gamePlatforms/atari_st.png';
import atariLynx from '../assets/gamePlatforms/atari_lynx.png';
import atariXEGS from '../assets/gamePlatforms/atari_xegs.png';
import genesis from '../assets/gamePlatforms/genesis.png';
import segaSaturn from '../assets/gamePlatforms/sega_saturn.png';
import segaCD from '../assets/gamePlatforms/sega_cd.png';
import sega32x from '../assets/gamePlatforms/sega_32x.png';
import segaMasterSystem from '../assets/gamePlatforms/sega_master_system.png';
import dreamcast from '../assets/gamePlatforms/dreamcast.png';
import _3do from '../assets/gamePlatforms/3do.png';
import jaguar from '../assets/gamePlatforms/jaguar.png';
import gameGear from '../assets/gamePlatforms/game_gear.png';
import neoGeo from '../assets/gamePlatforms/neo_geo.png';
import web from '../assets/gamePlatforms/web.png';

const contentProviders = {
  'Amazon Prime Video': amazonPrimeVideo,
  'Apple iTunes': appleiTunes,
  'Apple TV Plus': appleTvPlus,
  'Claro Video': claroVideo,
  'Disney Plus': disneyPlus,
  'Fox Play': foxPlay,
  'Fox Premium': foxPremium,
  'Globo Play': globoPlay,
  'Google Play Movies': googlePlayMovies,
  'HBO Go': hboGo,
  Looke: looke,
  'Microsoft Store': microsoftStore,
  Netflix: netflix,
  NOW: now,
  'TeleCine Play': telecinePlay,
  Crunchyroll: crunchyroll,
  PC: windows,
  'PlayStation 5': playstation5,
  'Xbox One': xboxOne,
  'PlayStation 4': playstation4,
  'Xbox Series S/X': xboxSeriesSX,
  'Nintendo Switch': nintendoSwitch,
  iOS: iOS,
  Android: android,
  'Nintendo 3DS': nintendo3DS,
  'Nintendo DS': nintendoDS,
  'Nintendo DSi': nintendoDSi,
  macOS: macOS,
  Linux: linux,
  'Xbox 360': xbox360,
  Xbox: xbox,
  'PlayStation 3': playstation3,
  'PlayStation 2': playstation2,
  PlayStation: playstation,
  'PS Vita': psVita,
  PSP: psp,
  'Wii U': wiiU,
  Wii: wii,
  GameCube: gameCube,
  'Nintendo 64': nintendo64,
  'Game Boy Advance': gameBoyAdvance,
  'Game Boy Color': gameBoyColor,
  'Game Boy': gameBoy,
  SNES: snes,
  NES: nes,
  'Classic Macintosh': classicMacintosh,
  'Apple II': appleII,
  'Commodore / Amiga': commodoreAmiga,
  'Atari 7800': atari7800,
  'Atari 5200': atari5200,
  'Atari 2600': atari2600,
  'Atari Flashback': atariFlashback,
  'Atari 8-bit': atari8bit,
  'Atari ST': atariST,
  'Atari Lynx': atariLynx,
  'Atari XEGS': atariXEGS,
  Genesis: genesis,
  'SEGA Saturn': segaSaturn,
  'SEGA CD': segaCD,
  'SEGA 32X': sega32x,
  'SEGA Master System': segaMasterSystem,
  Dreamcast: dreamcast,
  '3DO': _3do,
  Jaguar: jaguar,
  'Game Gear': gameGear,
  'Neo Geo': neoGeo,
  Web: web,
};

export default contentProviders;
