import { useEffect, useState } from 'react'
import { SphereBufferGeometry } from 'three'
import PropTypes from 'prop-types'


function DemoPositionButton() {
    return <>
    <button onClick={console.log("button has been clicked")}>Default</button>;
    </>
}

export default DemoPositionButton;