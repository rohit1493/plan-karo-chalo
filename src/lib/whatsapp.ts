import type { StageWithOptions } from '../types'

const BASE_URL = import.meta.env.VITE_APP_URL ?? 'https://plankarochalo.com'

function tripUrl(inviteCode: string) {
  return `${BASE_URL}/trip/${inviteCode}`
}

function buildLink(text: string): string {
  // On mobile, whatsapp:// deep link. On desktop, web.whatsapp.com fallback.
  const encoded = encodeURIComponent(text)
  const isMobile = /android|iphone|ipad/i.test(navigator.userAgent)
  return isMobile
    ? `whatsapp://send?text=${encoded}`
    : `https://web.whatsapp.com/send?text=${encoded}`
}

export function shareInviteLink(tripName: string, inviteCode: string): string {
  const text = `🌴 I'm planning *${tripName}* on Plan Karo Chalo!\nHelp decide dates, location, stay & activities — no sign-up needed.\nJoin here: ${tripUrl(inviteCode)}`
  return buildLink(text)
}

export function shareNudgeLink(tripName: string, inviteCode: string, unvotedCount: number): string {
  const text = `🥀 Our *${tripName}* trip tree is dying... ${unvotedCount} ${unvotedCount === 1 ? 'person hasn\'t' : 'people haven\'t'} voted yet!\nSave it: ${tripUrl(inviteCode)}`
  return buildLink(text)
}

export function shareStageLockedLink(
  tripName: string,
  inviteCode: string,
  stageName: string,
  winner: string,
  nextStage: string
): string {
  const text = `✅ *${stageName}* decided for *${tripName}*: ${winner}!\nNext up: ${nextStage}. Keep the momentum going: ${tripUrl(inviteCode)}`
  return buildLink(text)
}

export function shareConfirmedLink(tripName: string, inviteCode: string, stages: StageWithOptions[]): string {
  const lines = stages
    .filter((s) => s.locked_option)
    .map((s) => `• ${stageLabel(s.type)}: ${s.locked_option!.title}`)
    .join('\n')
  const text = `🎉 *${tripName}* is CONFIRMED!\n\n${lines}\n\nSee the full plan: ${tripUrl(inviteCode)}`
  return buildLink(text)
}

export function stageLabel(type: string): string {
  const labels: Record<string, string> = {
    date: 'Dates',
    location: 'Location',
    stay: 'Stay',
    activity: 'Activities',
  }
  return labels[type] ?? type
}
