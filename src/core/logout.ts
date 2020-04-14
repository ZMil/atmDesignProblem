
import { unAuthorize, getCurrAccountId } from './accounts'

export const handleLogout = (): string[] => {
    const currAccountId = getCurrAccountId()
    if(currAccountId === '') {
        return ['No account is currently authorized.']
    }
    unAuthorize(currAccountId)
    return [`Account ${currAccountId} is logged out.`]
}