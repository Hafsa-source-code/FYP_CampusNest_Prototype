import { PATHS } from './paths'
import { ROLES } from '@/utils/constants'

const HOME_FOR_ROLE = {
  [ROLES.STUDENT]: PATHS.student.search,
  [ROLES.OWNER]: PATHS.owner.dashboard,
  [ROLES.ADMIN]: PATHS.admin.moderation,
}

/** The first page each role sees after logging in. */
export function homePathFor(role) {
  return HOME_FOR_ROLE[role] ?? PATHS.home
}
