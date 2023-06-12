
//判断两个线段是否相交
export function isIntersection(a, b, c, d) {
    /** 1 解线性方程组, 求线段交点. **/
    // 如果分母为0 则平行或共线, 不相交
    var denominator = (b.y - a.y) * (d.x - c.x) - (a.x - b.x) * (c.y - d.y);
    if (denominator == 0) {
        return false;
    }

    // 线段所在直线的交点坐标 (x , y)
    var x =
        ((b.x - a.x) * (d.x - c.x) * (c.y - a.y) +
            (b.y - a.y) * (d.x - c.x) * a.x -
            (d.y - c.y) * (b.x - a.x) * c.x) /
        denominator;
    var y =
        -(
            (b.y - a.y) * (d.y - c.y) * (c.x - a.x) +
            (b.x - a.x) * (d.y - c.y) * a.y -
            (d.x - c.x) * (b.y - a.y) * c.y
        ) / denominator;

    /** 2 判断交点是否在两条线段上 **/
    if (
        // 交点在线段1上
        (x - a.x) * (x - b.x) < 0 &&
        (y - a.y) * (y - b.y) < 0 &&
        // 且交点也在线段2上
        (x - c.x) * (x - d.x) < 0 &&
        (y - c.y) * (y - d.y) < 0
    ) {
        // // 返回交点p
        // return {
        //   x: x,
        //   y: y,
        // };
        return true;
    }
    //否则不相交
    return false;
}

export function isExistIntersection(points) {
    let result = false;
    for (let i = 0; i < points.length - 1; i++) {
        let a = points[i];
        let b = points[i + 1];
        for (let j = 0; j < points.length - 1; j++) {
            if (i == j) {
                continue;
            }
            let c = points[j];
            let d = points[j + 1];
            result = isIntersection(a, b, c, d);
            if (result) {
                return result;
            }
            // console.log(result)
        }
    }
    return result;
}

// 计算向量叉乘
function crossMul(v1, v2) {
    return v1.x * v2.y - v1.y * v2.x;
}

// 判断两条线段是否相交
function checkCross(p1, p2, p3, p4) {
    let v1 = { x: p1.x - p3.x, y: p1.y - p3.y },
        v2 = { x: p2.x - p3.x, y: p2.y - p3.y },
        v3 = { x: p4.x - p3.x, y: p4.y - p3.y },
        v = crossMul(v1, v3) * crossMul(v2, v3);
    v1 = { x: p3.x - p1.x, y: p3.y - p1.y };
    v2 = { x: p4.x - p1.x, y: p4.y - p1.y };
    v3 = { x: p2.x - p1.x, y: p2.y - p1.y };
    return v <= 0 && crossMul(v1, v3) * crossMul(v2, v3) <= 0
        ? true
        : false;
}

// 判断点是否在多边形内
export function checkPP(point, polygon) {
    let p1, p2, p3, p4;
    p1 = point;
    p2 = { x: -100, y: point.y };
    let count = 0;
    // 对每条边都和射线作对比
    for (let i = 0; i < polygon.length - 1; i++) {
      p3 = polygon[i];
      p4 = polygon[i + 1];
      if (checkCross(p1, p2, p3, p4) == true) {
        count++;
      }
    }
    p3 = polygon[polygon.length - 1];
    p4 = polygon[0];
    if (checkCross(p1, p2, p3, p4) == true) {
      count++;
    }
    // 如果为偶数 说明在多边形外面，如果为奇数，说明在多边形内部
    return count % 2 == 0 ? false : true;
  }
