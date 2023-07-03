import moveSlashComamnd from './slash/move'
import verifiedSlashComamnd from './slash/verified'
import deleteCm from './contextMenu/delete'
import deleteReactionsCm from './contextMenu/deleteReactions'
import sendCm from './contextMenu/send'

export const CommandBodys = [
  moveSlashComamnd.Command,
  verifiedSlashComamnd.Command,
  deleteCm.Command,
  deleteReactionsCm.Command,
  sendCm.Command
]

export const SlashCommands = [
  moveSlashComamnd,
  verifiedSlashComamnd
]

export const ContextMenuCommands = [
  deleteCm,
  deleteReactionsCm,
  sendCm
]