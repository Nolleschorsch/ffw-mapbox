import {
    colorsEven,
    colorsOdd,
    getRouteColor
} from '../colors'

describe('colors', () => {
    const cases = [
        { setup: { hoselineSize: undefined }, index: 0, expected: colorsEven.DEFAULT },
        { setup: { hoselineSize: 'A' }, index: 2, expected: colorsEven.A },
        { setup: { hoselineSize: 'B' }, index: 42, expected: colorsEven.B },
        { setup: { hoselineSize: undefined }, index: 1, expected: colorsOdd.DEFAULT },
        { setup: { hoselineSize: 'A' }, index: 41, expected: colorsOdd.A },
        { setup: { hoselineSize: 'B' }, index: 11, expected: colorsOdd.B },
        {setup: undefined, index: 4, expected: colorsEven.DEFAULT},
        {setup: undefined, index: 7, expected: colorsOdd.DEFAULT}
    ]
    it('colorsEven', () => {
        expect(colorsEven.DEFAULT).toEqual('#000000')
        expect(colorsEven.B).toEqual('#ff0000')
        expect(colorsEven.A).toEqual('#0000ff')
    })
    it('colorsOdd', () => {
        expect(colorsOdd.DEFAULT).toEqual('#b3b3cc')
        expect(colorsOdd.B).toEqual('#ff8080')
        expect(colorsOdd.A).toEqual('#8080ff')
    })
    it.each(cases)('getRouteColor with setup $setup index $index returns $expected', ({ setup, index, expected }) => {
        expect(getRouteColor(setup, index)).toEqual(expected)
    })
})