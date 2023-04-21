export const colorsEven = {
    DEFAULT: '#000000',
    B: '#ff0000',
    A: '#0000ff'
}

export const colorsOdd = {
    DEFAULT: '#b3b3cc',
    B: '#ff8080',
    A: '#8080ff'
}

export const getRouteColor = (setup, index) => {

    const colors = index % 2 ? colorsOdd : colorsEven
    let color = colors.DEFAULT

    if (setup) {
        const size = setup.hoselineSize
        if (size) {
            if (size.startsWith('A')) {
                color = colors.A
            } else {
                color = colors.B
            }
        }
    }
    return color
}