import { isDevelopment } from "../config";

export const frogDb = {
  prefix: isDevelopment ? 'f!' : 's!',
  serverId: '1053382837857943662',
  principalServerId: '1028793496674500659',
  joins: 0,
  verifiedsCooldown: 10*24*60*60000,
  leaves: 0,
  roles: {
    verified: '1057720387464593478',
    verifiedSpeech: '1083060304054849676'
  },
  owners: ['853063286320922634', '551146834941313026', '717420870267830382', '853000435098320907']
}