/* 
nach DIN 14420 (Norm zurückgezogen): (Schema: Abkürzung "FP"="Feuerlöschkreiselpumpe" - Nennförderstrom / 100 in l/min und Nennförderdruck in bar)
FP 2/5 (Feuerlöschkreiselpumpe mit einem Nennförderstrom von 200 l/min bei einem Nennförderdruck von 5 bar)
FP 4/5 (Feuerlöschkreiselpumpe mit einem Nennförderstrom von 400 l/min bei einem Nennförderdruck von 5 bar)
FP 8/8 (Feuerlöschkreiselpumpe mit einem Nennförderstrom von 800 l/min bei einem Nennförderdruck von 8 bar)
FP 16/8 (Feuerlöschkreiselpumpe mit einem Nennförderstrom von 1600 l/min bei einem Nennförderdruck von 8 bar)
FP 24/8 (Feuerlöschkreiselpumpe mit einem Nennförderstrom von 2400 l/min bei einem Nennförderdruck von 8 bar)
FP 32/8 (Feuerlöschkreiselpumpe mit einem Nennförderstrom von 3200 l/min bei einem Nennförderdruck von 8 bar)
Transportable Pumpen tragen anstelle "FP" das Kürzel "TS" für "Tragkraftspritze"
nach DIN EN 1028 (seit 11/2002): (Schema: Abkürzung "FP"="Feuerlöschkreiselpumpe" "N="Normaldruck" (oder auf Englisch: "Fire Pump Normal Pressure") - Nennförderdruck in bar - Nennförderstrom in l/min)
FPN 6-500 (Feuerlöschkreiselpumpe als TS (im KLF nach alter Norm) für Normaldruck mit einem Nennförderstrom von 500 l/min bei einem Nennförderdruck von 6 bar)
FPN 10-1000 (Feuerlöschkreiselpumpe für Normaldruck mit einem Nennförderstrom von 1000 l/min bei einem Nennförderdruck von 10 bar)
FPN 10-2000 (Feuerlöschkreiselpumpe für Normaldruck mit einem Nennförderstrom von 2000 l/min bei einem Nennförderdruck von 10 bar)
FPN 10-3000 (Feuerlöschkreiselpumpe für Normaldruck mit einem Nennförderstrom von 3000 l/min bei einem Nennförderdruck von 10 bar)
FPN 10-4000 (Feuerlöschkreiselpumpe für Normaldruck mit einem Nennförderstrom von 4000 l/min bei einem Nennförderdruck von 10 bar)

DIN 14420 & DIN EN 1028
Garantiepunkt 1: Nennförderstrom bei Nennförderdruck und einer geodätischen Saughöhe von 3 Metern bei vom Hersteller festgelegter Nenndrehzahl

DIN 14420
50 Prozent des Nennförderstroms bei 1,5-fachem Nennförderdruck und einer geodätischen Saughöhe von 3 Metern (bei max. 1,2-facher Nenndrehzahl)
50 Prozent des Nennförderstroms bei Nennförderdruck und einer geodätischen Saughöhe von 7,5 Metern (bei max. 1,4-facher Nenndrehzahl)

DIN EN 1028
50 Prozent des Nennförderstroms bei Nennförderdruck und einer geodätischen Saughöhe von 7,5 Metern (bei einer Drehzahl bis zur Höchstdrehzahl)
50 Prozent des Nennförderstroms bei 1,2-fachem Nennförderdruck und einer geodätischen Saughöhe von 3 Metern (bei einer Drehzahl unterhalb der Höchstdrehzahl)


*/

export const availableEngines = [

    /*     {name: "FP 2/5", volume: 200, pressureSystem: 5, DIN: 14420, sizes: ['B']},
        {name: "FP 4/5", volume: 400, pressureSystem: 5, DIN: 14420, sizes: ['B']}, */
    { name: "FP 8/8", volume: 800, pressureSystem: 8, DIN: 14420, sizes: ['B'], entryPoints: { 'A': 1, 'B': 2 }, exitPoints: { 'A': 1, 'B': 2 } },
    { name: "FP 16/8", volume: 1600, pressureSystem: 8, DIN: 14420, sizes: ['B'], entryPoints: { 'A': 1, 'B': 2 }, exitPoints: { 'A': 1, 'B': 2 } },
    { name: "FP 24/8", volume: 2400, pressureSystem: 8, DIN: 14420, sizes: ['B'], entryPoints: { 'A': 1, 'B': 2 }, exitPoints: { 'A': 1, 'B': 2 } },
    { name: "FP 32/8", volume: 3200, pressureSystem: 8, DIN: 14420, sizes: ['B'], entryPoints: { 'A': 1, 'B': 2 }, exitPoints: { 'A': 1, 'B': 2 } },
    { name: "PFP 8/8", volume: 800, pressureSystem: 8, DIN: 14420, sizes: ['B'], entryPoints: { 'A': 1, 'B': 2 }, exitPoints: { 'A': 1, 'B': 2 } },
    { name: "PFP 16/8", volume: 1600, pressureSystem: 8, DIN: 14420, sizes: ['B'], entryPoints: { 'A': 1, 'B': 2 }, exitPoints: { 'A': 1, 'B': 2 } },
    { name: "FPN 6-500 ", volume: 500, pressureSystem: 10, DIN: 1028, sizes: ['B'], entryPoints: { 'A': 1, 'B': 2 }, exitPoints: { 'A': 1, 'B': 2 } },
    { name: "FPN 10-1000", volume: 1000, pressureSystem: 10, DIN: 1028, sizes: ['B'], entryPoints: { 'A': 1, 'B': 2 }, exitPoints: { 'A': 1, 'B': 2 } },
    { name: "FPN 10-2000", volume: 2000, pressureSystem: 10, DIN: 1028, sizes: ['B'], entryPoints: { 'A': 2, 'B': 4 }, exitPoints: { 'A': 2, 'B': 4 } },
    { name: "FPN 10-3000", volume: 3000, pressureSystem: 10, DIN: 1028, sizes: ['B'], entryPoints: { 'A': 2, 'B': 4 }, exitPoints: { 'A': 2, 'B': 4 } },
    { name: "FPN 10-4000", volume: 4000, pressureSystem: 10, DIN: 1028, sizes: ['B'], entryPoints: { 'A': 2, 'B': 4 }, exitPoints: { 'A': 2, 'B': 4 } },
    { name: "PFPN 10-1000", volume: 1000, pressureSystem: 10, DIN: 1028, sizes: ['B'], entryPoints: { 'A': 1, 'B': 2 }, exitPoints: { 'A': 1, 'B': 2 } },
    { name: "PFPN 10-1500", volume: 1500, pressureSystem: 10, DIN: 1028, sizes: ['B'], entryPoints: { 'A': 1, 'B': 2 }, exitPoints: { 'A': 1, 'B': 2 } },
    { name: "PFPN 10-2000", volume: 2000, pressureSystem: 10, DIN: 1028, sizes: ['B'], entryPoints: { 'A': 1, 'B': 2 }, exitPoints: { 'A': 1, 'B': 2 } },
    /* {name: "Fiktionale A-Schlauchpumpe", volume: 4000, pressureSystem: 10, DIN: 1337, sizes: ['A', 'B']} */

]

export const getEngine = (name) => {
    return availableEngines.find(engine => engine.name === name)
}

export const getValidEngines = (previousSetup) => {
    const { hoselineCount, hoselineSize, maxVolume, flow, volume } = previousSetup
    //console.log({previousSetup})
    //console.log( previousSetup.displayName, maxVolume, flow)
    return availableEngines.filter(engine =>
        (engine.volume <= maxVolume) &&
        (engine.volume >= flow)
    )
}