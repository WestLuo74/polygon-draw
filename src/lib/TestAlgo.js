import {pointInCircle} from './DrawAlgorithm'

function testPointInCircle(){
    let circleR = 10
    let circleCenter = { x: 100, y: 100 }
    let p = { x: 105, y: 105 }
    if(pointInCircle(p, circleCenter, circleR)){
        console.log('testPointInCircle Ok')
    }else{
        console.log('testPointInCircle Bad')
    }
}

testPointInCircle()