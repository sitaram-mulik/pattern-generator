// Utility functions for CustomizedPattern component

// Ramer-Douglas-Peucker algorithm for point simplification
function getPerpendicularDistance(point, lineStart, lineEnd) {
  const dx = lineEnd.x - lineStart.x;
  const dy = lineEnd.y - lineStart.y;

  if (dx === 0 && dy === 0) {
    return Math.hypot(point.x - lineStart.x, point.y - lineStart.y);
  }

  const numerator = Math.abs(dy * point.x - dx * point.y + lineEnd.x * lineStart.y - lineEnd.y * lineStart.x);
  const denominator = Math.sqrt(dx * dx + dy * dy);
  return numerator / denominator;
}

function rdp(points, epsilon) {
  if (points.length < 3) return points;

  let maxDistance = 0;
  let index = 0;

  for (let i = 1; i < points.length - 1; i++) {
    const distance = getPerpendicularDistance(points[i], points[0], points[points.length - 1]);
    if (distance > maxDistance) {
      index = i;
      maxDistance = distance;
    }
  }

  if (maxDistance > epsilon) {
    const left = rdp(points.slice(0, index + 1), epsilon);
    const right = rdp(points.slice(index), epsilon);

    return left.slice(0, -1).concat(right);
  } else {
    return [points[0], points[points.length - 1]];
  }
}

// Shape detection with point simplification to refine shape
export function detectShape(points) {
  const epsilon = 5; // Tolerance for simplification, adjust as needed
  const simplifiedPoints = rdp(points, epsilon);

  // Optionally, close the shape by adding the first point at the end if not already
  if (
    simplifiedPoints.length > 2 &&
    (simplifiedPoints[0].x !== simplifiedPoints[simplifiedPoints.length - 1].x ||
      simplifiedPoints[0].y !== simplifiedPoints[simplifiedPoints.length - 1].y)
  ) {
    simplifiedPoints.push(simplifiedPoints[0]);
  }

  return simplifiedPoints;
}

// Draw the detected shape on the canvas context
export function drawDetectedShape(ctx, shapePoints) {
  if (!shapePoints || shapePoints.length === 0) return;
  ctx.beginPath();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "blue";
  ctx.fillStyle = "rgba(0, 0, 255, 0.3)";
  ctx.moveTo(shapePoints[0].x, shapePoints[0].y);
  for (let i = 1; i < shapePoints.length; i++) {
    ctx.lineTo(shapePoints[i].x, shapePoints[i].y);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}
