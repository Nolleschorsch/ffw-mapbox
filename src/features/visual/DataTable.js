import React, { useState } from 'react'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'


export const DataTable = (props) => {

    const { route, setup } = props

    const [showAll, setShowAll] = useState(false)

    const pData = route.coordinates
    const name = setup.displayName
    const engineString = setup.hoselineSystem === 'closedSystem' ? 'Pumpe' : 'Pumpe mit Tank'
    const shownData = showAll ? pData : pData.filter(p => p.engine === true)

    return (
        <div>
            <h5>{name}</h5>
            <Button onClick={() => setShowAll(!showAll)}>{showAll ? 'zeige nur Pumpen' : 'zeige Alle'}</Button>
            {/* <table className="table table-dark table-striped"> */}
            <Table striped variant="dark">
                <thead>
                    <tr>
                        <th>Distanz</th>
                        <th>Höhe</th>
                        <th>Eingangsdruck</th>
                        {/* <th>Ausgangsdruck</th> */}
                        <th>Pumpe</th>
                    </tr>
                </thead>
                <tbody>
                    {shownData.map((x, i) => {
                        const { distance, elevation, pressureIn, pressureOut, engine } = x

                        let engineText
                        if (engine && i === 0) {
                            engineText = 'Pumpe'
                        } else {
                            engineText = engineString
                        }

                        return (
                            <tr key={i} className={engine ? "table-success" : ''}>
                                <td>{distance}m</td>
                                <td>{elevation}m</td>
                                <td>{pressureIn}bar</td>
                                {/* <td>{pressureOut}bar</td> */}
                                <td>{engine ? i + 1 === shownData.length ? 'Löschfahrzeug' : engineText : ''}</td>
                            </tr>
                        )
                    })}
                </tbody>
            {/* </table> */}
            </Table>
        </div>
    )

}

export default DataTable