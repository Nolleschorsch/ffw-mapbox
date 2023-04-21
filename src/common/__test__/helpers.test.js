import { getBadgeTextAndVariant } from '../helpers'

describe('getBadgeTextAndVariant', () => {
    it('returns expected values', () => {
        expect(getBadgeTextAndVariant(true)).toEqual(['Vollständig', 'success'])
        expect(getBadgeTextAndVariant(false)).toEqual(['Unvollständig', 'danger'])
    })
})